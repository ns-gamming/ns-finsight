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
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputField = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      shortcuts.forEach((shortcut) => {
        if (!e.key || !shortcut.key) return;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.altKey ? e.altKey : !e.altKey;

        if (
          keyMatch &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          if (isInputField && shortcut.key !== '/') { // Prevent shortcuts on input fields unless it's the shortcut help
            return;
          }
          e.preventDefault();
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