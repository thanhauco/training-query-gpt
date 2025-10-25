import React from 'react';
import type { QueryResult } from '../types';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { DownloadIcon } from './icons/DownloadIcon';

interface QueryResultTableProps {
    results: QueryResult;
}

const QueryResultTable: React.FC<QueryResultTableProps> = ({ results }) => {
    if (!results || results.length === 0) {
        return (
            <div className="text-center text-sm text-gray-500 py-4">
                Query executed successfully, but returned no rows.
            </div>
        );
    }

    const headers = Object.keys(results[0]);
    
    const formatValue = (value: any): string => {
        if (value === null) return 'NULL';
        if (value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">{results.length} row{results.length !== 1 ? 's' : ''} returned</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportToCSV(results)}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                        title="Export as CSV"
                    >
                        <DownloadIcon className="w-3.5 h-3.5" />
                        CSV
                    </button>
                    <button
                        onClick={() => exportToJSON(results)}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                        title="Export as JSON"
                    >
                        <DownloadIcon className="w-3.5 h-3.5" />
                        JSON
                    </button>
                </div>
            </div>
            <div className="w-full overflow-x-auto border border-gray-700 rounded-md">
                <table className="min-w-full divide-y divide-gray-700 text-sm">
                <thead className="bg-gray-800/70">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                scope="col"
                                className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50 bg-gray-900">
                    {results.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-800/50">
                            {headers.map((header) => (
                                <td key={`${rowIndex}-${header}`} className="px-4 py-2 whitespace-nowrap text-gray-300 font-mono">
                                    {formatValue(row[header])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default QueryResultTable;
