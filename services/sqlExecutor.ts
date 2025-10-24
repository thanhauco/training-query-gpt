import type { QueryResult } from '../types';

interface TableData {
    name: string;
    data: any[];
}

interface ExecutionResult {
    result?: QueryResult;
    error?: string;
}

export const executeSql = async (sql: string, tables: TableData[]): Promise<ExecutionResult> => {
    return new Promise((resolve) => {
        try {
            // alasql is attached to window in the browser from the script tag in index.html
            const alasql = (window as any).alasql;
            if (!alasql) {
                throw new Error("alasql library not found.");
            }

            // Create a new database to avoid name collisions.
            const dbId = `db_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            alasql(`CREATE DATABASE ${dbId}; USE ${dbId};`);

            // Create tables and insert data.
            tables.forEach(table => {
                // Sanitize table name just in case
                const tableName = table.name.replace(/[^a-zA-Z0-9_]/g, '');
                alasql(`CREATE TABLE ${tableName}`);
                // Use alasql's utility to load data into the table
                if (table.data && table.data.length > 0) {
                   alasql.tables[tableName].data = table.data;
                }
            });

            // Execute the query
            const result = alasql(sql);

            // Clean up the database
            alasql(`DROP DATABASE ${dbId}`);

            resolve({ result });
        } catch (error) {
            console.error("SQL Execution Error:", error);
            resolve({ error: error instanceof Error ? error.message : String(error) });
        }
    });
};
