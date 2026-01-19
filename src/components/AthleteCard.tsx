import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Target, Trash2, Footprints, Calendar, Ruler, Weight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Atleta } from "@/lib/types";

interface AthleteCardProps {
  atleta: Atleta;
  onRemove: (id: string) => void;
  index: number;
}

export function AthleteCard({ atleta, onRemove, index }: AthleteCardProps) {
  const getCategoryColor = (categoria: string) => {
    if (categoria === "Profissional") return "bg-warning/20 text-warning border-warning/30";
    if (categoria.includes("Sub-1")) return "bg-primary/20 text-primary border-primary/30";
    return "bg-accent/20 text-accent border-accent/30";
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="group glass-card border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-5 relative">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/30 ring-2 ring-primary/10">
              <AvatarImage src={atleta.foto || "/placeholder.svg"} alt={atleta.nome} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">{getInitials(atleta.nome)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-foreground truncate">{atleta.nome}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-[10px] px-2 py-0.5 ${getCategoryColor(atleta.categoria)}`}>{atleta.categoria}</Badge>
                    <span className="text-xs text-muted-foreground">{atleta.posicao}</span>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover atleta?</AlertDialogTitle>
                      <AlertDialogDescription>Essa ação não pode ser desfeita. O atleta será removido permanentemente.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-secondary">Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onRemove(atleta.id)} className="bg-destructive hover:bg-destructive/90">Remover</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {atleta.dataNascimento && <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /><span>{new Date(atleta.dataNascimento).toLocaleDateString('pt-BR')}</span></div>}
                {atleta.altura && <div className="flex items-center gap-2"><Ruler className="w-3.5 h-3.5" /><span>{atleta.altura} cm</span></div>}
                {atleta.peso && <div className="flex items-center gap-2"><Weight className="w-3.5 h-3.5" /><span>{atleta.peso} kg</span></div>}
                {atleta.perna && <div className="flex items-center gap-2"><Footprints className="w-3.5 h-3.5" /><span>{atleta.perna}</span></div>}
                {atleta.regiao && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /><span>{atleta.regiao}</span></div>}
                {atleta.clubeAlvo && <div className="flex items-center gap-2"><Target className="w-3.5 h-3.5" /><span>{atleta.clubeAlvo}</span></div>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
