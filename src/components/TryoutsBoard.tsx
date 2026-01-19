import { motion } from "framer-motion";
import { Calendar, ExternalLink, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { peneiras } from "@/lib/data";
import type { Atleta } from "@/lib/types";

interface TryoutsBoardProps {
  atletas?: Atleta[];
}

export function TryoutsBoard({ atletas = [] }: TryoutsBoardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto": return "bg-success/20 text-success border-success/30";
      case "Em breve": return "bg-warning/20 text-warning border-warning/30";
      case "Encerrado": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getMatchingAthletes = (peneiraCategoria: string) => {
    return atletas.filter((atleta) => atleta.categoria === peneiraCategoria);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card className="glass-card border-accent/20" id="peneiras">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center glow-accent">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Mural de Peneiras</CardTitle>
                <p className="text-xs text-muted-foreground">Oportunidades abertas</p>
              </div>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent">
              {peneiras.filter((p) => p.status === "Aberto").length} abertas
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {peneiras.map((peneira, index) => {
              const matchingAthletes = getMatchingAthletes(peneira.categoria);
              const hasMatches = matchingAthletes.length > 0;

              return (
                <motion.div
                  key={peneira.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`group relative p-4 rounded-xl bg-secondary/50 border transition-all duration-300 ${
                    hasMatches ? "border-primary/50 ring-1 ring-primary/20" : "border-border hover:border-accent/50"
                  }`}
                >
                  <div className="absolute top-3 right-3">
                    <Badge className={`text-[10px] px-2 py-0.5 ${getStatusColor(peneira.status)}`}>{peneira.status}</Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {peneira.escudo && (
                      <img 
                        src={peneira.escudo} 
                        alt={`Escudo ${peneira.clube}`} 
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <h3 className="font-bold text-foreground text-lg">{peneira.clube}</h3>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /><span>{peneira.data}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /><span>{peneira.categoria}</span></div>
                  </div>

                  {/* Match Indicator */}
                  <div className={`mb-3 p-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    hasMatches 
                      ? "bg-primary/20 text-primary border border-primary/30" 
                      : "bg-muted/50 text-muted-foreground"
                  }`}>
                    <Users className="w-3.5 h-3.5" />
                    {hasMatches ? (
                      <span>{matchingAthletes.length} atleta{matchingAthletes.length > 1 ? "s" : ""} compatível{matchingAthletes.length > 1 ? "eis" : ""}</span>
                    ) : (
                      <span>Nenhum atleta compatível</span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-accent/30 text-accent hover:bg-accent/10"
                    onClick={() => window.open(peneira.contato, "_blank")}
                    disabled={peneira.status === "Encerrado"}
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-2" />
                    Saiba mais
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
