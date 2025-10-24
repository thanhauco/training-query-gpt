
import React from 'react';
import type { SampleQuery } from '../types';

interface SampleQueriesProps {
  queries: SampleQuery[];
  onSelect: (query: SampleQuery) => void;
  isLoading: boolean;
}

const SampleQueriesComponent: React.FC<SampleQueriesProps> = ({ queries, onSelect, isLoading }) => {
  if (queries.length === 0) {
    return <p className="text-sm text-gray-500">No sample queries available for this workspace.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {queries.map((sample, index) => (
        <button
          key={index}
          onClick={() => onSelect(sample)}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm font-medium text-cyan-200 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sample.query}
        </button>
      ))}
    </div>
  );
};

export default SampleQueriesComponent;
