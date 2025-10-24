import React from 'react';
import type { QueryResult } from '../types';

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
    );
};

export default QueryResultTable;
