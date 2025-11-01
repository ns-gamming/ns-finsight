import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

export const FloatingActionButton = ({ onClick, className, label = "Add Transaction" }: FloatingActionButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl",
          "bg-primary hover:bg-primary/90",
          "transition-all duration-300 ease-out",
          "hover:scale-110 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]",
          "active:scale-95",
          "animate-in fade-in slide-in-from-bottom-4 duration-500",
          className
        )}
        aria-label={label}
      >
        <Plus className="h-6 w-6" />
      </Button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-sm font-medium shadow-lg whitespace-nowrap border">
          {label}
        </div>
      </div>
    </div>
  );
};
