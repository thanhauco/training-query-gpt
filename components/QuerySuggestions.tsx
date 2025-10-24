import React from 'react';
import type { SuggestedQuery } from '../types';

interface QuerySuggestionsProps {
  suggestions: SuggestedQuery[];
  isLoading: boolean;
  onSelect: (query: string) => void;
  hasSelectedTables: boolean;
}

const SuggestionSkeleton: React.FC = () => (
    <div className="space-y-2 animate-pulse">
        <div className="h-6 bg-gray-700 rounded-full w-3/4"></div>
        <div className="h-6 bg-gray-700 rounded-full w-1/2"></div>
        <div className="h-6 bg-gray-700 rounded-full w-5/6"></div>
    </div>
);

const DifficultyBadge: React.FC<{ difficulty: 'Easy' | 'Medium' | 'Hard' }> = ({ difficulty }) => {
    const colorClasses = {
        Easy: 'bg-green-800 text-green-200',
        Medium: 'bg-yellow-800 text-yellow-200',
        Hard: 'bg-red-800 text-red-200',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colorClasses[difficulty]}`}>
            {difficulty}
        </span>
    );
};

const QuerySuggestions: React.FC<QuerySuggestionsProps> = ({ suggestions, isLoading, onSelect, hasSelectedTables }) => {
    if (isLoading) {
        return <SuggestionSkeleton />;
    }

    if (!hasSelectedTables) {
         return <p className="text-sm text-gray-500">Select one or more tables above to get AI-generated query suggestions.</p>;
    }

    if (suggestions.length === 0) {
        return <p className="text-sm text-gray-500">No suggestions could be generated for the selected tables.</p>;
    }

  return (
    <div className="space-y-2">
      {suggestions.sort((a,b) => {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }).map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion.query)}
          className="w-full flex items-center gap-3 text-left p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
        >
          <DifficultyBadge difficulty={suggestion.difficulty} />
          <span className="text-sm text-gray-300">{suggestion.query}</span>
        </button>
      ))}
    </div>
  );
};

export default QuerySuggestions;
