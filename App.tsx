import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Workspace, Table, SampleQuery, SuggestedQuery, HistoryEntry, QueryResult } from './types';
import { WORKSPACES, SAMPLE_QUERIES } from './constants';
import { generateSql, generateQuerySuggestions, suggestTablesForQuery, suggestInitialTablesForWorkspace, generateCanonicalQuery } from './services/geminiService';
import * as historyService from './services/historyService';
import { executeSql } from './services/sqlExecutor';
import Header from './components/Header';
import WorkspaceSelector from './components/WorkspaceSelector';
import TableSelector from './components/TableSelector';
import QueryInput from './components/QueryInput';
import SqlQueryDisplay from './components/SqlQueryDisplay';
import SampleQueriesComponent from './components/SampleQueries';
import QuerySuggestions from './components/QuerySuggestions';
import History from './components/History';
import TableSelectorHeader from './components/TableSelectorHeader';
import SchemaDiagram from './components/SchemaDiagram';

const App: React.FC = () => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [selectedTableNames, setSelectedTableNames] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState<string>('');
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [sqlExplanation, setSqlExplanation] = useState<string>('');
  const [executionPlan, setExecutionPlan] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [suggestedQueries, setSuggestedQueries] = useState<SuggestedQuery[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState<boolean>(false);
  const suggestionTimeoutRef = useRef<number | null>(null);

  const [isTableSuggestionLoading, setIsTableSuggestionLoading] = useState<boolean>(false);
  const tableSuggestionTimeoutRef = useRef<number | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  const [tableView, setTableView] = useState<'list' | 'diagram'>('list');

  // State for SQL execution
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  useEffect(() => {
    setHistory(historyService.getHistory());
  }, []);


  const selectedWorkspace = useMemo(() => {
    return WORKSPACES.find(w => w.id === selectedWorkspaceId) || null;
  }, [selectedWorkspaceId]);

  const clearQueryResults = () => {
    setGeneratedSql('');
    setSqlExplanation('');
    setExecutionPlan([]);
    setRecommendations([]);
    setQueryResult(null);
    setQueryError(null);
  }

  const handleWorkspaceSelect = useCallback((workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setUserQuery('');
    setError('');
    setSuggestedQueries([]);
    setTableView('list'); 
    clearQueryResults();
  }, []);

  const handleTableToggle = useCallback((tableName: string) => {
    setSelectedTableNames(prev =>
      prev.includes(tableName)
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  }, []);
  
  const createSchemaString = useCallback((tables: Table[]): string => {
    return tables.map(table => {
      const columns = table.columns.map(col => `  ${col.name} ${col.type} -- ${col.description}`).join(',\n');
      return `CREATE TABLE ${table.name} (\n${columns}\n); -- ${table.description}`;
    }).join('\n\n');
  }, []);

  // Effect for AI-powered TABLE suggestions
  useEffect(() => {
    if (tableSuggestionTimeoutRef.current) {
        clearTimeout(tableSuggestionTimeoutRef.current);
    }

    if (!selectedWorkspace) {
        setSelectedTableNames([]);
        return;
    }

    tableSuggestionTimeoutRef.current = window.setTimeout(async () => {
        setIsTableSuggestionLoading(true);
        try {
            if (userQuery.trim()) {
                const allTables = selectedWorkspace.tables;
                const schemaString = createSchemaString(allTables);
                const suggestedTableNames = await suggestTablesForQuery(userQuery, schemaString);
                setSelectedTableNames(suggestedTableNames);
            } else {
                const suggestedTableNames = await suggestInitialTablesForWorkspace(selectedWorkspace);
                setSelectedTableNames(suggestedTableNames);
            }
        } catch (err) {
            console.error("Failed to fetch table suggestions:", err);
        } finally {
            setIsTableSuggestionLoading(false);
        }
    }, 500);

    return () => {
        if (tableSuggestionTimeoutRef.current) {
            clearTimeout(tableSuggestionTimeoutRef.current);
        }
    };
  }, [userQuery, selectedWorkspace, createSchemaString]);

  // Effect for AI-powered QUERY suggestions
  useEffect(() => {
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    if (!selectedWorkspace || selectedTableNames.length === 0) {
      setSuggestedQueries([]);
      return;
    }

    setIsSuggestionsLoading(true);

    suggestionTimeoutRef.current = window.setTimeout(async () => {
      try {
        const selectedTables = selectedWorkspace.tables.filter(t => selectedTableNames.includes(t.name));
        const schemaString = createSchemaString(selectedTables);
        const suggestions = await generateQuerySuggestions(schemaString);
        setSuggestedQueries(suggestions);
      } catch (err) {
        console.error("Failed to fetch query suggestions:", err);
        setSuggestedQueries([]); // Clear suggestions on error
      } finally {
        setIsSuggestionsLoading(false);
      }
    }, 500); // Debounce for 500ms

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [selectedWorkspace, selectedTableNames, createSchemaString]);

  const handleGenerateQuery = async (queryOverride?: string, tablesOverride?: string[]) => {
    const currentQuery = queryOverride ?? userQuery;
    const currentTables = tablesOverride ?? selectedTableNames;

    if (!currentQuery.trim() || !selectedWorkspace || currentTables.length === 0) {
      setError("Please select a workspace, at least one table, and enter a query.");
      return;
    }

    setIsLoading(true);
    setError('');
    clearQueryResults();

    try {
      const selectedTables = selectedWorkspace.tables.filter(t => currentTables.includes(t.name));
      const schemaString = createSchemaString(selectedTables);

      const generationPrompt = `
You are an expert SQL generator. Your task is to convert natural language questions into SQL queries based on the provided database schema.

**Database Schema:**
${schemaString}

**Instructions:**
1. Use the provided schema to write an accurate and performant SQL query.
2. The query must directly answer the user's question.
3. Format the SQL query for readability with proper indentation and capitalization of keywords (e.g., SELECT, FROM, WHERE).
4. Incorporate business logic implied by the schema, like how tables join.
5. Provide a brief, one or two-sentence natural language explanation of what the query does.
6. ONLY output a single JSON object with two keys: "sql" and "explanation". Do not include any other text or markdown formatting.

**User Question:**
"${currentQuery}"

**JSON Output:**
      `.trim();
      
      const { sql, explanation, executionPlan, recommendations } = await generateSql(generationPrompt, schemaString);
      
      const canonicalQuery = await generateCanonicalQuery(sql, schemaString);

      setGeneratedSql(sql);
      setSqlExplanation(explanation);
      setExecutionPlan(executionPlan);
      setRecommendations(recommendations);

      const newEntry: Omit<HistoryEntry, 'id' | 'timestamp'> = {
          userQuery: currentQuery,
          sql: sql,
          explanation: explanation,
          workspaceId: selectedWorkspace.id,
          tableNames: currentTables,
          executionPlan: executionPlan,
          recommendations: recommendations,
          canonicalQuery: canonicalQuery,
      };
      const updatedHistory = historyService.addToHistory(newEntry);
      setHistory(updatedHistory);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunQuery = async () => {
    if (!generatedSql || !selectedWorkspace) return;

    setIsExecuting(true);
    setQueryResult(null);
    setQueryError(null);

    // This needs to be in a timeout to allow the UI to update to the loading state
    setTimeout(async () => {
        try {
            const tablesWithData = selectedWorkspace.tables
                .filter(t => selectedTableNames.includes(t.name))
                .map(t => ({ name: t.name, data: t.data || [] }));
            
            if (tablesWithData.some(t => t.data.length === 0)) {
                console.warn("Executing query on tables with no mock data.");
            }

            const { result, error } = await executeSql(generatedSql, tablesWithData);

            if (error) {
                setQueryError(error);
            } else {
                setQueryResult(result);
            }
        } catch (err) {
            setQueryError(err instanceof Error ? err.message : 'An unknown error occurred during execution.');
        } finally {
            setIsExecuting(false);
        }
    }, 50);
  };

  const handleSampleQuerySelect = (sample: SampleQuery) => {
    setUserQuery(sample.query);
  };
  
  const handleSuggestionSelect = (query: string) => {
    setUserQuery(query);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    if (selectedWorkspaceId !== entry.workspaceId) {
        handleWorkspaceSelect(entry.workspaceId);
    }
    setTimeout(() => {
        setSelectedTableNames(entry.tableNames);
        setUserQuery(entry.userQuery);
        setGeneratedSql(entry.sql);
        setSqlExplanation(entry.explanation);
        setExecutionPlan(entry.executionPlan || []);
        setRecommendations(entry.recommendations || []);
        setQueryResult(null);
        setQueryError(null);
    }, 0);
  };

  const handleClearHistory = () => {
      historyService.clearHistory();
      setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 light:bg-gray-50 flex flex-col transition-colors">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-6">
          <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">1. Select Workspace</h2>
            <p className="text-sm text-gray-400 mb-4 -mt-2">This acts as the "Intent Agent" to narrow the search domain.</p>
            <WorkspaceSelector
              workspaces={WORKSPACES}
              selectedWorkspaceId={selectedWorkspaceId}
              onSelect={handleWorkspaceSelect}
            />
          </div>

          {selectedWorkspace && (
            <>
              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <TableSelectorHeader
                  isLoading={isTableSuggestionLoading}
                  view={tableView}
                  onViewChange={setTableView}
                />
                {tableView === 'list' ? (
                  <TableSelector
                    tables={selectedWorkspace.tables}
                    selectedTableNames={selectedTableNames}
                    onToggle={handleTableToggle}
                  />
                ) : (
                  <SchemaDiagram
                    tables={selectedWorkspace.tables}
                    selectedTableNames={selectedTableNames}
                    onTableSelect={handleTableToggle}
                  />
                )}
              </div>

              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h2 className="text-lg font-semibold text-gray-200 mb-4">3. AI-Generated Query Suggestions</h2>
                <QuerySuggestions
                    suggestions={suggestedQueries}
                    isLoading={isSuggestionsLoading}
                    onSelect={handleSuggestionSelect}
                    hasSelectedTables={selectedTableNames.length > 0}
                />
              </div>

              <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h2 className="text-lg font-semibold text-gray-200 mb-4">4. Or, Try a Sample Test</h2>
                 <SampleQueriesComponent
                  queries={SAMPLE_QUERIES[selectedWorkspace.id] || []}
                  onSelect={handleSampleQuerySelect}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}

          <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 flex-grow">
              <History
                history={history}
                onSelect={handleHistorySelect}
                onClear={handleClearHistory}
                workspaces={WORKSPACES}
              />
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">5. Generate Query</h2>
            <QueryInput
              query={userQuery}
              onQueryChange={setUserQuery}
              onGenerate={() => handleGenerateQuery()}
              isLoading={isLoading}
              disabled={!selectedWorkspaceId || selectedTableNames.length === 0}
            />
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            <div className="mt-4 flex-grow">
              <SqlQueryDisplay 
                sql={generatedSql} 
                explanation={sqlExplanation}
                executionPlan={executionPlan}
                recommendations={recommendations}
                isLoading={isLoading}
                isExecuting={isExecuting}
                queryResult={queryResult}
                queryError={queryError}
                onRunQuery={handleRunQuery}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;