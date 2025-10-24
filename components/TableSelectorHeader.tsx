import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ListIcon } from './icons/ListIcon';
import { DiagramIcon } from './icons/DiagramIcon';

interface TableSelectorHeaderProps {
  isLoading: boolean;
  view: 'list' | 'diagram';
  onViewChange: (view: 'list' | 'diagram') => void;
}

const TableSelectorHeader: React.FC<TableSelectorHeaderProps> = ({ isLoading, view, onViewChange }) => {
  const commonButtonClasses = "p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800";
  const activeButtonClasses = "bg-gray-600 text-white";
  const inactiveButtonClasses = "text-gray-400 hover:bg-gray-700 hover:text-gray-200";

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <span>2. Select Tables</span>
          {isLoading && <SpinnerIcon className="w-5 h-5 text-cyan-400" />}
        </h2>
        <div className="flex items-center gap-1 p-1 bg-gray-900/50 rounded-lg">
          <button
            onClick={() => onViewChange('list')}
            className={`${commonButtonClasses} ${view === 'list' ? activeButtonClasses : inactiveButtonClasses}`}
            aria-label="List view"
            title="List view"
          >
            <ListIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewChange('diagram')}
            className={`${commonButtonClasses} ${view === 'diagram' ? activeButtonClasses : inactiveButtonClasses}`}
            aria-label="Schema diagram view"
            title="Schema diagram view"
          >
            <DiagramIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        This acts as the "Table Agent" to prune the schema. Tables are auto-selected based on your query.
      </p>
    </>
  );
};

export default TableSelectorHeader;
