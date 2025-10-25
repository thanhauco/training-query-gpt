import React from 'react';
import type { HistoryEntry, Workspace } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { StarIcon } from './icons/StarIcon';

interface HistoryProps {
  history: HistoryEntry[];
  workspaces: Workspace[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
  onToggleFavorite: (entryId: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, workspaces, onSelect, onClear, onToggleFavorite }) => {
    
    const getWorkspaceName = (workspaceId: string) => {
        return workspaces.find(w => w.id === workspaceId)?.name || 'Unknown';
    }

    const formatTimestamp = (timestamp: number) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    }

    const favorites = history.filter(entry => entry.isFavorite);
    const recent = history.filter(entry => !entry.isFavorite);

    const renderEntry = (entry: HistoryEntry) => (
        <div
            key={entry.id}
            className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-cyan-500"
        >
            <button
                onClick={() => onSelect(entry)}
                className="flex-1 text-left focus:outline-none"
            >
                <p className="text-sm font-medium text-gray-200 truncate" title={entry.canonicalQuery || entry.userQuery}>
                    {entry.canonicalQuery || entry.userQuery}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span>{getWorkspaceName(entry.workspaceId)}</span>
                    <span>{formatTimestamp(entry.timestamp)}</span>
                </div>
            </button>
            <button
                onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(entry.id);
                }}
                className={`p-1 rounded-md transition-colors ${entry.isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-gray-200'}`}
                aria-label={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                title={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <StarIcon filled={Boolean(entry.isFavorite)} className="w-4 h-4" />
            </button>
        </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Query History</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-red-300 bg-red-900/50 rounded-md hover:bg-red-900/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto -mr-3 pr-3">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 h-full flex items-center justify-center text-center">
            Your generated queries will appear here.
          </p>
        ) : (
          <div className="space-y-4">
            {favorites.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-2">Favorites</h3>
                    <div className="space-y-2">
                        {favorites.map(renderEntry)}
                    </div>
                </div>
            )}
            {recent.length > 0 && (
                <div>
                    {favorites.length > 0 && (
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Recent</h3>
                    )}
                    <div className="space-y-2">
                        {recent.map(renderEntry)}
                    </div>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
