import React from 'react';
import type { Table } from '../types';

interface TableSelectorProps {
  tables: Table[];
  selectedTableNames: string[];
  onToggle: (tableName: string) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ tables, selectedTableNames, onToggle }) => {
  return (
    <div className="space-y-4">
      {tables.map((table) => {
        const isSelected = selectedTableNames.includes(table.name);
        return (
          <div
            key={table.name}
            className={`rounded-lg border transition-all duration-200 ${isSelected ? 'bg-gray-700/60 border-cyan-500' : 'bg-gray-700/30 border-gray-600 hover:border-gray-500'}`}
          >
            <div
              onClick={() => onToggle(table.name)}
              className="p-3 flex items-start space-x-3 cursor-pointer"
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id={table.name}
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 bg-gray-800 border-gray-600 rounded cursor-pointer"
                />
              </div>
              <div className="text-sm">
                <label htmlFor={table.name} className="font-mono font-medium text-gray-200 cursor-pointer">
                  {table.name}
                </label>
                <p className="text-gray-400">{table.description}</p>
              </div>
            </div>

            {/* Column Details */}
            <div className="ml-8 mr-3 mb-3 mt-1 pt-3 border-t border-gray-600/50">
              <div className="space-y-1.5">
                {table.columns.map((col) => (
                  <div key={col.name} className="grid grid-cols-[auto_auto_1fr] gap-x-3 items-center text-xs">
                    <span className="font-mono text-cyan-300 truncate" title={col.name}>
                      {col.name}
                    </span>
                    <span className="font-mono text-yellow-400/80 truncate bg-gray-800/50 px-1.5 py-0.5 rounded" title={col.type}>
                      {col.type}
                    </span>
                    <span className="text-gray-400 truncate" title={col.description}>
                      {col.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableSelector;
