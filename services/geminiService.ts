import { GoogleGenAI, Type } from "@google/genai";
import type { SuggestedQuery, Workspace } from "../types";

// Assume API_KEY is set in the environment variables
const API_KEY = process.env.API_KEY;
const isApiConfigured = Boolean(API_KEY);
const ai = isApiConfigured ? new GoogleGenAI({ apiKey: API_KEY as string }) : null;

const parseTableNamesFromSchema = (schema: string): string[] => {
  const matches = Array.from(schema.matchAll(/CREATE TABLE\s+([a-zA-Z0-9_]+)/gi));
  return matches.map(match => match[1]);
};

const buildFallbackExecutionPlan = (tableName: string) => [
  `Perform a simple scan on the "${tableName}" table.`,
  "Return the first 25 rows so you can inspect the data shape.",
];

const FALLBACK_RECOMMENDATIONS = [
  "Connect a Gemini API key to enable full AI-powered SQL generation.",
  "Add or adjust mock data to better mirror your real production datasets.",
];

export const generateSql = async (prompt: string, schema: string): Promise<{ sql: string; explanation: string; executionPlan: string[], recommendations: string[] }> => {
  if (!isApiConfigured || !ai) {
    const tableNames = parseTableNamesFromSchema(schema);
    const primaryTable = tableNames[0] ?? "mock_table";
    const sql = `SELECT *\nFROM ${primaryTable}\nLIMIT 25;`;
    return {
      sql,
      explanation: `Fallback SQL preview that returns up to 25 rows from the "${primaryTable}" table.`,
      executionPlan: buildFallbackExecutionPlan(primaryTable),
      recommendations: FALLBACK_RECOMMENDATIONS,
    };
  }

  try {
    // Step 1: Generate the SQL query and its natural language explanation.
    const generationResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sql: {
              type: Type.STRING,
              description: "The generated SQL query."
            },
            explanation: {
              type: Type.STRING,
              description: "A brief, natural language explanation of the SQL query."
            }
          },
          required: ['sql', 'explanation']
        }
      }
    });
    
    const generationResult = JSON.parse(generationResponse.text);

    // A simple check to remove markdown if the model accidentally adds it to the SQL part.
    if (generationResult.sql && typeof generationResult.sql === 'string' && generationResult.sql.startsWith('```sql')) {
        generationResult.sql = generationResult.sql.replace(/```sql|```/g, '').trim();
    }

    const { sql, explanation } = generationResult;

    if (!sql || !explanation) {
      throw new Error("The AI model failed to return a valid SQL query and explanation.");
    }

    // Step 2: Analyze the generated query for performance.
    // This function has its own error handling and will return empty arrays on failure,
    // preventing the entire process from failing if only the analysis step has an issue.
    const { executionPlan, recommendations } = await analyzeQueryPerformance(sql, schema);

    // Step 3: Return the combined result.
    return { sql, explanation, executionPlan, recommendations };

  } catch (error) {
    console.error("Error during SQL generation and analysis:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided API key is not valid. Please check your environment configuration.");
    } else if (error instanceof Error) {
        throw error; // Re-throw the original error to be caught by the component
    }
    throw new Error("Failed to generate and analyze SQL from the Gemini API.");
  }
};


export const generateQuerySuggestions = async (schemaString: string): Promise<SuggestedQuery[]> => {
  if (!isApiConfigured || !ai) {
    const tableNames = parseTableNamesFromSchema(schemaString);
    const baseTable = tableNames[0] ?? "dataset";
    return [
      { difficulty: "Easy", query: `Show the latest records from ${baseTable}.` },
      { difficulty: "Medium", query: `Which ${baseTable} entries changed in the last 30 days?` },
      { difficulty: "Hard", query: `Summarize ${baseTable} metrics grouped by the most important dimension.` },
    ];
  }

  const prompt = `
Based on the following SQL schema, generate exactly 3 natural language query suggestions for a user to ask.
The suggestions should range in complexity: one 'Easy', one 'Medium', and one 'Hard'.
The "Hard" query should ideally involve a join, aggregation, and a filter if possible given the schema.

**Database Schema:**
${schemaString}

Provide the response as a JSON array of objects.
  `.trim();
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        difficulty: {
                            type: Type.STRING,
                            enum: ['Easy', 'Medium', 'Hard'],
                        },
                        query: {
                            type: Type.STRING,
                        },
                    },
                    required: ['difficulty', 'query'],
                },
            },
        },
    });

    const suggestions = JSON.parse(response.text);
    return suggestions;
  } catch (error) {
    console.error("Error generating query suggestions:", error);
    return []; // Return empty array on failure
  }
};

export const suggestTablesForQuery = async (query: string, schema: string): Promise<string[]> => {
  if (!isApiConfigured || !ai) {
    const tableNames = parseTableNamesFromSchema(schema);
    if (tableNames.length === 0) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();
    const matchingTables = tableNames.filter(name => normalizedQuery.includes(name.toLowerCase()));

    if (matchingTables.length > 0) {
      return matchingTables;
    }

    return tableNames.slice(0, 3);
  }

  const prompt = `
You are an expert database schema analyst. Your task is to identify which tables are necessary to answer a user's question, given a database schema.

**Database Schema:**
${schema}

**User's Question:**
"${query}"

**Instructions:**
- Read the user's question carefully.
- Examine the tables and their descriptions to find the ones containing the relevant data.
- Return a JSON array of strings, where each string is the name of a required table.
- ONLY return tables from the provided schema. Do not invent tables.
- If the question is ambiguous or doesn't relate to any tables, return an empty array.
- Be concise. Only include the absolutely essential tables. For example, if the user asks about "customers" and "orders", you should return ["customers", "orders"].

**JSON Output:**
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error suggesting tables for query:", error);
    return [];
  }
};

export const suggestInitialTablesForWorkspace = async (workspace: Workspace): Promise<string[]> => {
  if (!isApiConfigured || !ai) {
    return workspace.tables.slice(0, 3).map(table => table.name);
  }

  const tableDescriptions = workspace.tables.map(t => `- ${t.name}: ${t.description}`).join('\n');
  const prompt = `
You are an expert database architect. Your task is to identify the most important or central tables within a given workspace based on its description and the tables it contains. This is for providing a useful starting point for a user.

**Workspace Name:**
${workspace.name}

**Workspace Description:**
${workspace.description}

**Tables in Workspace:**
${tableDescriptions}

**Instructions:**
- Analyze the workspace description to understand its primary purpose.
- Review the list of tables.
- Identify the 1 to 3 tables that are most central to the workspace's function. These are often "fact" tables or primary entities (e.g., 'trips' in a mobility workspace, 'orders' in an e-commerce workspace).
- Return a JSON array of strings, where each string is the name of a suggested table.

**JSON Output:**
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error suggesting initial tables:", error);
    return [];
  }
};

export const analyzeQueryPerformance = async (sqlQuery: string, schema: string): Promise<{ executionPlan: string[]; recommendations: string[]; }> => {
  if (!isApiConfigured || !ai) {
    const tableNames = parseTableNamesFromSchema(schema);
    const primaryTable = tableNames[0] ?? "mock_table";
    return {
      executionPlan: buildFallbackExecutionPlan(primaryTable),
      recommendations: FALLBACK_RECOMMENDATIONS,
    };
  }

  const prompt = `
You are an expert database performance tuning specialist. Your task is to analyze a SQL query, provide a simplified, human-readable execution plan, and offer actionable recommendations for improvement based on the given schema.

**Database Schema:**
${schema}

**SQL Query to Analyze:**
\`\`\`sql
${sqlQuery}
\`\`\`

**Instructions:**
1.  **Execution Plan:** Describe the logical steps a database query planner would likely take to execute this query. Use simple terms. For example: "1. Perform a full scan on the 'drivers' table. 2. Filter for drivers with a rating > 4.5. 3. Sort the results in descending order. 4. Return the top 5 records."
2.  **Recommendations:** Provide a list of potential performance improvements. Focus on common best practices like indexing, join strategies, or avoiding costly operations. For example: "Ensure an index exists on the 'rating' column of the 'drivers' table to speed up filtering." If the query is already well-optimized, state that.
3.  **Output Format:** Return a single JSON object with two keys: "executionPlan" (an array of strings) and "recommendations" (an array of strings).

**JSON Output:**
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of steps describing the query's logical execution plan."
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of actionable performance improvement recommendations."
            }
          },
          required: ['executionPlan', 'recommendations']
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing query performance:", error);
    // Return empty state on failure to avoid breaking the UI
    return { executionPlan: [], recommendations: [] };
  }
};

export const generateCanonicalQuery = async (sqlQuery: string, schema: string): Promise<string> => {
  if (!isApiConfigured || !ai) {
    const tableNames = parseTableNamesFromSchema(schema);
    const primaryTable = tableNames[0] ?? "this dataset";
    return `What are some recent records from ${primaryTable}?`;
  }

  const prompt = `
You are an expert at translating SQL queries into clear, natural language questions.
Based on the provided SQL query and the database schema, generate a single, concise, human-readable question that this SQL query would answer.

**Database Schema:**
${schema}

**SQL Query:**
\`\`\`sql
${sqlQuery}
\`\`\`

**Instructions:**
- The question should be what a non-technical business user might ask.
- Keep the question direct and to the point.
- Output a single JSON object with one key: "query".

**JSON Output:**
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            query: {
              type: Type.STRING,
              description: "The natural language question."
            }
          },
          required: ['query']
        }
      }
    });
    const result = JSON.parse(response.text);
    return result.query;
  } catch (error) {
    console.error("Error generating canonical query:", error);
    // On failure, return an empty string. The app can then fall back to the user's original query.
    return ""; 
  }
};
