import { Button } from "@/components/ui/button";
import { Building2, LogIn, UserPlus } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary rounded-lg">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">immoautomation</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Funktionen
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Preise
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Über uns
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <LogIn className="h-4 w-4 mr-2" />
            Anmelden
          </Button>
          <Button variant="primary" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Jetzt starten
          </Button>
        </div>
      </div>
    </header>
  );
};