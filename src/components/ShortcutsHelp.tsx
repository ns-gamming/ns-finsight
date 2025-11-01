import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface ShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShortcutsHelp = ({ open, onOpenChange }: ShortcutsHelpProps) => {
  const shortcuts = [
    { key: 'Ctrl+N', description: 'Add new transaction' },
    { key: 'Ctrl+B', description: 'Set budget' },
    { key: 'Ctrl+C', description: 'Open AI financial advisor' },
    { key: 'Ctrl+F', description: 'View family members' },
    { key: 'Ctrl+R', description: 'Refresh dashboard data' },
    { key: 'Ctrl+D', description: 'Toggle dark/light mode' },
    { key: 'Ctrl+/', description: 'Show this shortcuts help' },
    { key: 'Esc', description: 'Close dialogs' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-fade-in-up">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate faster
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {shortcuts.map((shortcut, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="text-sm text-foreground">{shortcut.description}</span>
              <kbd className="px-3 py-1.5 text-xs font-semibold bg-background border border-border rounded-md shadow-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
