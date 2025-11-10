import { Loader2 } from "lucide-react";
import logoImage from "@/assets/ns-finsight-logo.png";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-white shadow-glow animate-pulse-slow ring-4 ring-primary/30">
          <img 
            src={logoImage} 
            alt="NS FinSight" 
            className="h-full w-full object-contain p-2"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Fetching your data...</p>
          <p className="text-xs text-muted-foreground/70">Almost there, just getting your numbers ready 📊</p>
        </div>
      </div>
    </div>
  );
};
