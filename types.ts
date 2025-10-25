export interface Column {
  name: string;
  type: string;
  description: string;
}

export interface Table {
  name: string;
  description: string;
  columns: Column[];
  data?: any[];
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  tables: Table[];
}

export interface SampleQuery {
  query: string;
  tables: string[];
}

export interface SuggestedQuery {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  query: string;
}

export type QueryResult = Record<string, any>[];

export interface HistoryEntry {
  id: string;
  userQuery: string;
  sql: string;
  explanation: string;
  workspaceId: string;
  tableNames: string[];
  timestamp: number;
  executionPlan?: string[];
  recommendations?: string[];
  canonicalQuery?: string;
  isFavorite?: boolean;
}
