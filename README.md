# QueryGPT: AI Agent for English to SQL

This project is an interactive web application inspired by Uber's multi-agent RAG (Retrieval-Augmented Generation) system, QueryGPT. It translates natural language questions into SQL queries and allows you to test them instantly, providing a complete, end-to-end solution for data exploration.

## The Problem
In data-driven organizations, engineers and analysts spend a significant amount of time writing SQL queries. This process involves searching for correct table schemas, understanding complex business logic, and manually constructing queries, which can be a major productivity bottleneck. This tool aims to drastically reduce that time and cognitive load.

## Key Features

*   **Multi-Agent RAG System:** Uses a step-by-step process (Intent -> Table Selection -> Generation) to ensure high-accuracy SQL generation.
*   **Interactive Schema Diagram:** Visualize your database with an auto-arranging, graph-based diagram. Understand table relationships at a glance and select tables directly from the visual interface.
*   **Instant SQL Execution:** Run the generated SQL query directly in the browser against mock data with a single click. See results or errors immediately without needing a separate database client.
*   **Visual & Textual Execution Plans:** Toggle between a simple text-based execution plan and an intuitive visual flow-chart with icons for each operation to easily understand and optimize query performance.
*   **AI-Powered Suggestions:** Get intelligent suggestions for which tables to select based on your query, and discover interesting questions to ask about your selected data.
*   **Persistent Query History:** Your past queries are automatically saved, allowing you to revisit and reuse them at any time.

## How It Works: The Multi-Agent RAG Approach

This application simulates the core principles of QueryGPT by breaking down the problem into a series of specialized "agents" that work together.

### 1. Intent Agent (Workspace Selector)
The user first selects a **Workspace**, which represents a specific business domain (e.g., "Mobility", "Ads"). This acts as the Intent Agent, dramatically narrowing the search space and providing the initial, high-level context.

### 2. Table Agent (Schema Pruning & Visualization)
Once in a workspace, the Table Agent helps identify the specific tables needed to answer the user's question. This is where the user experience is enhanced with several tools:
- **AI Table Suggestions:** As you type your question, Gemini analyzes it and pre-selects the most relevant tables for you.
- **List View:** A classic, detailed list of tables with their columns, types, and descriptions.
- **Diagram View:** An interactive, hierarchical diagram that visually maps out tables and their relationships, making complex schemas easy to understand.

By selecting tables, the user implicitly performs schema pruning, ensuring only the most relevant context is sent to the final generation agent.

### 3. Query Generation & Analysis Agent (Gemini Pro)
With the context precisely defined, the user's question and the pruned schema are sent to Google Gemini.
- **Generation:** Gemini generates a clean, performant SQL query.
- **Analysis:** It then provides a natural language explanation, a step-by-step execution plan, and actionable recommendations for performance tuning (e.g., suggesting an index).

## How to Use

1.  **Select a Workspace:** Choose the business domain your question relates to (e.g., "Northwind Traders").
2.  **Select Tables:**
    *   Start typing your question and let the AI suggest and select relevant tables.
    *   Alternatively, manually select tables from the list or the interactive **diagram view**.
3.  **Refine Your Question:**
    *   Use the AI-generated query suggestions for inspiration.
    *   Type your own question in plain English (e.g., "Show the top 5 selling products by revenue.").
4.  **Generate SQL:** Click the **"Generate SQL"** button.
5.  **Review the Output:**
    *   Examine the generated SQL query.
    *   Read the explanation to understand what it does.
    *   Toggle the **Execution Plan** between "Text" and "Visual" to analyze its performance.
6.  **Run & Test:** Click the **"Run"** button to execute the query against the built-in mock data and see the results instantly in a table.

## Technology Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Model:** Google Gemini API (`gemini-2.5-pro` for generation, `gemini-2.5-flash` for suggestions/analysis)
-   **In-Browser Database:** AlaSQL for instant query execution.
