import { Users } from "lucide-react";
import { AthleteCard } from "./AthleteCard";
import type { Atleta } from "@/lib/types";

interface AthleteGridProps {
  atletas: Atleta[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Atleta>) => void;
}

export function AthleteGrid({ atletas, onRemove, onUpdate }: AthleteGridProps) {
  if (atletas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum atleta cadastrado</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Comece cadastrando seu primeiro atleta usando o formulário ao lado.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {atletas.map((atleta, index) => (
        <AthleteCard key={atleta.id} atleta={atleta} onRemove={onRemove} onUpdate={onUpdate} index={index} />
      ))}
    </div>
  );
}
