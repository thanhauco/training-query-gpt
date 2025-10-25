import type { HistoryEntry } from '../types';

const HISTORY_KEY = 'queryGptHistory';
const MAX_HISTORY_SIZE = 50;

type NewHistoryEntry = Omit<HistoryEntry, 'id' | 'timestamp'>;

export const getHistory = (): HistoryEntry[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Failed to parse history from localStorage', error);
    return [];
  }
};

const saveHistory = (history: HistoryEntry[]): void => {
  try {
    const historyJson = JSON.stringify(history);
    localStorage.setItem(HISTORY_KEY, historyJson);
  } catch (error) {
    console.error('Failed to save history to localStorage', error);
  }
};

export const addToHistory = (newEntry: NewHistoryEntry): HistoryEntry[] => {
  const currentHistory = getHistory();
  
  const entry: HistoryEntry = {
    ...newEntry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    isFavorite: newEntry.isFavorite ?? false,
  };

  const updatedHistory = [entry, ...currentHistory];

  // Limit the history size
  if (updatedHistory.length > MAX_HISTORY_SIZE) {
    updatedHistory.splice(MAX_HISTORY_SIZE);
  }

  saveHistory(updatedHistory);
  return updatedHistory;
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history from localStorage', error);
  }
};

export const toggleFavorite = (entryId: string): HistoryEntry[] => {
  const currentHistory = getHistory();
  const updatedHistory = currentHistory.map(entry => 
    entry.id === entryId
      ? { ...entry, isFavorite: !entry.isFavorite }
      : entry
  );
  saveHistory(updatedHistory);
  return updatedHistory;
};
