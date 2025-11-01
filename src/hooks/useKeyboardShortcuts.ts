import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;
        
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Common shortcuts configuration
export const DASHBOARD_SHORTCUTS = [
  { key: 'n', ctrlKey: true, description: 'Add new transaction' },
  { key: 'b', ctrlKey: true, description: 'Set budget' },
  { key: 'c', ctrlKey: true, description: 'Open AI chatbot' },
  { key: 'f', ctrlKey: true, description: 'View family' },
  { key: 'r', ctrlKey: true, description: 'Refresh data' },
  { key: 'd', ctrlKey: true, description: 'Toggle dark mode' },
  { key: '/', ctrlKey: true, description: 'Show shortcuts help' },
];
