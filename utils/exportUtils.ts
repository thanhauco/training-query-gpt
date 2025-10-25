import type { QueryResult } from '../types';

/**
 * Convert query results to CSV format
 */
export const exportToCSV = (results: QueryResult, filename: string = 'query_results.csv'): void => {
    if (!results || results.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = Object.keys(results[0]);
    
    // Escape CSV values
    const escapeCSV = (value: any): string => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        // If value contains comma, quote, or newline, wrap in quotes and escape quotes
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    // Create CSV content
    const csvRows = [
        headers.join(','), // Header row
        ...results.map(row => 
            headers.map(header => escapeCSV(row[header])).join(',')
        )
    ];

    const csvContent = csvRows.join('\n');
    downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

/**
 * Convert query results to JSON format
 */
export const exportToJSON = (results: QueryResult, filename: string = 'query_results.json'): void => {
    if (!results || results.length === 0) {
        alert('No data to export');
        return;
    }

    const jsonContent = JSON.stringify(results, null, 2);
    downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
};

/**
 * Helper function to trigger file download
 */
const downloadFile = (content: string, filename: string, mimeType: string): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
