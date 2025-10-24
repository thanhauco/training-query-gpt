import React from 'react';
import type { HistoryEntry, Workspace } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryProps {
  history: HistoryEntry[];
  workspaces: Workspace[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, workspaces, onSelect, onClear }) => {
    
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
          <div className="space-y-2">
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="w-full text-left p-3 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
              >
                <p className="text-sm font-medium text-gray-200 truncate">{entry.userQuery}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                  <span>{getWorkspaceName(entry.workspaceId)}</span>
                  <span>{formatTimestamp(entry.timestamp)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
