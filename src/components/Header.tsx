import { motion } from "framer-motion";
import { Trophy, Users, Target, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddAthlete?: () => void;
}

export function Header({ onAddAthlete }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-border/50 glass-card sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Scout<span className="gradient-text">Pro</span>
              </h1>
              <p className="text-xs text-muted-foreground">Sistema de Captação</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#atletas"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Users className="w-4 h-4" />
                Atletas
              </a>
              <a
                href="#peneiras"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Target className="w-4 h-4" />
                Peneiras
              </a>
            </nav>
            
            <Button 
              onClick={onAddAthlete}
              className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium glow-primary"
            >
              <UserPlus className="w-4 h-4" />
              Adicionar Atleta
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
