import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;

        if (keyMatches && ctrlMatches && shiftMatches) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export const KEYBOARD_SHORTCUTS: ShortcutConfig[] = [
  {
    key: 'Enter',
    ctrlKey: true,
    callback: () => {}, // Will be overridden
    description: 'Generate SQL query'
  },
  {
    key: 'k',
    ctrlKey: true,
    callback: () => {},
    description: 'Focus query input'
  },
  {
    key: '/',
    ctrlKey: true,
    callback: () => {},
    description: 'Show keyboard shortcuts'
  }
];
