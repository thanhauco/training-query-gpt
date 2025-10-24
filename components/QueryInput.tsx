
import React from 'react';

interface QueryInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ query, onQueryChange, onGenerate, isLoading, disabled }) => {
  return (
    <div className="flex flex-col h-full">
      <label htmlFor="query-input" className="block text-sm font-medium text-gray-400 mb-2">
        Ask a question in English
      </label>
      <textarea
        id="query-input"
        rows={4}
        className="block w-full rounded-md bg-gray-900 border-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm p-3 font-mono resize-none"
        placeholder="e.g., Show me the top 5 drivers with the highest ratings who joined this year."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        disabled={disabled}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading || disabled || !query.trim()}
        className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate SQL'
        )}
      </button>
    </div>
  );
};

export default QueryInput;
