
import React from 'react';
import type { Workspace } from '../types';

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  selectedWorkspaceId: string | null;
  onSelect: (workspaceId: string) => void;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({ workspaces, selectedWorkspaceId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {workspaces.map((workspace) => (
        <button
          key={workspace.id}
          onClick={() => onSelect(workspace.id)}
          className={`p-4 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500
            ${selectedWorkspaceId === workspace.id
              ? 'bg-cyan-600 text-white shadow-lg'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
        >
          <h3 className="font-semibold">{workspace.name}</h3>
          <p className="text-sm opacity-80">{workspace.description}</p>
        </button>
      ))}
    </div>
  );
};

export default WorkspaceSelector;
