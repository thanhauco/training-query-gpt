import React, { useState, useEffect, useRef } from 'react';
import type { QueryResult } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { RunIcon } from './icons/RunIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import ExecutionPlanVisualizer from './ExecutionPlanVisualizer';
import QueryResultTable from './QueryResultTable';


interface SqlQueryDisplayProps {
  sql: string;
  explanation: string;
  executionPlan: string[];
  recommendations: string[];
  isLoading: boolean;
  isExecuting: boolean;
  queryResult: QueryResult | null;
  queryError: string | null;
  onRunQuery: () => void;
}

const SqlQueryDisplay: React.FC<SqlQueryDisplayProps> = ({ 
    sql, 
    explanation, 
    executionPlan, 
    recommendations, 
    isLoading,
    isExecuting,
    queryResult,
    queryError,
    onRunQuery,
}) => {
  const [copied, setCopied] = useState(false);
  const [planView, setPlanView] = useState<'text' | 'visual'>('text');
  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (codeRef.current && sql && !isLoading) {
      (window as any).hljs?.highlightElement(codeRef.current);
    }
  }, [sql, isLoading]);


  const handleCopy = () => {
    if (sql) {
      navigator.clipboard.writeText(sql);
      setCopied(true);
    }
  };
  
  const Placeholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m12.728 0l-1.414 1.414M5.636 18.364l-1.414 1.414M12 16a4 4 0 110-8 4 4 0 010 8z" /></svg>
      <p className="text-sm">Your generated SQL will appear here.</p>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="pt-4 mt-2 border-t border-gray-800">
        <div className="h-3 bg-gray-700 rounded w-1/4 mb-3"></div>
        <div className="h-3 bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="pt-4 mt-2 border-t border-gray-800">
        <div className="h-3 bg-gray-700 rounded w-1/3 mb-3"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/4 mt-4 mb-3"></div>
        <div className="h-3 bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );


  return (
    <div className="relative h-full bg-gray-900 rounded-md border border-gray-700 flex flex-col">
      <div className="p-4 flex-shrink-0">
        {sql && !isLoading && (
            <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                    onClick={onRunQuery}
                    disabled={isExecuting}
                    className="p-1.5 rounded-md text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center gap-1.5 px-2"
                    aria-label="Run SQL query"
                >
                    {isExecuting ? <SpinnerIcon className="w-5 h-5"/> : <RunIcon className="w-5 h-5"/>}
                    <span className="text-sm font-medium">{isExecuting ? 'Running...' : 'Run'}</span>
                </button>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-gray-200 transition-colors"
                    aria-label="Copy SQL to clipboard"
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
        )}
        <div className="h-full">
            {isLoading ? <LoadingSkeleton /> : 
             sql ? (
              <div>
                <pre><code ref={codeRef} className="language-sql font-mono text-sm bg-transparent p-0 whitespace-pre-wrap">{sql}</code></pre>
                {explanation && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Explanation</h4>
                    <p className="text-sm text-gray-300 font-sans">{explanation}</p>
                  </div>
                )}
                {(executionPlan?.length > 0 || recommendations?.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Execution Plan & Recommendations</h4>
                        {executionPlan?.length > 0 && (
                            <div className="flex items-center gap-1 p-0.5 bg-gray-800 rounded-md text-xs">
                               <button 
                                    onClick={() => setPlanView('text')}
                                    className={`px-2 py-1 rounded-md transition-colors ${planView === 'text' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                                >
                                    Text
                                </button>
                                <button 
                                    onClick={() => setPlanView('visual')}
                                    className={`px-2 py-1 rounded-md transition-colors ${planView === 'visual' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                                >
                                    Visual
                                </button>
                            </div>
                        )}
                      </div>
                      
                      {executionPlan?.length > 0 && (
                          <div className="mb-4">
                              {planView === 'text' ? (
                                <>
                                  <h5 className="text-sm font-semibold text-gray-300 mb-2">Plan</h5>
                                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300 font-sans">
                                    {executionPlan.map((step, i) => <li key={i}>{step}</li>)}
                                  </ol>
                                </>
                              ) : (
                                <ExecutionPlanVisualizer plan={executionPlan} />
                              )}
                          </div>
                      )}
                      {recommendations?.length > 0 && (
                          <div>
                              <h5 className="text-sm font-semibold text-gray-300 mb-2">Recommendations</h5>
                              <ul className="space-y-2 text-sm text-gray-300 font-sans">
                                {recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <LightbulbIcon className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                                        <span>{rec}</span>
                                    </li>
                                ))}
                              </ul>
                          </div>
                      )}
                  </div>
                )}
              </div>
            ) : (
              <Placeholder />
            )}
        </div>
      </div>
      
      {(queryResult || queryError) && !isLoading && (
          <div className="flex-grow mt-4 pt-4 border-t border-gray-700/50 flex flex-col min-h-0">
             <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-4 flex-shrink-0">Query Result</h4>
              <div className="flex-grow overflow-auto px-4 pb-2">
                {queryError ? (
                    <div className="p-3 bg-red-900/50 text-red-300 rounded-md text-sm font-mono">
                        <p className="font-bold mb-1">Execution Failed</p>
                        <p>{queryError}</p>
                    </div>
                ) : queryResult ? (
                    <QueryResultTable results={queryResult} />
                ) : null}
              </div>
          </div>
      )}

    </div>
  );
};

export default SqlQueryDisplay;