import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, TrendingUp, TrendingDown, Minus, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Atleta, Observation } from "@/lib/types";

interface ObservationsTimelineProps {
  atleta: Atleta;
  onUpdate: (observations: Observation[]) => void;
}

export function ObservationsTimeline({ atleta, onUpdate }: ObservationsTimelineProps) {
  const [newObservation, setNewObservation] = useState("");
  const [observationType, setObservationType] = useState<Observation["type"]>("neutro");
  const [isOpen, setIsOpen] = useState(false);

  const observations = atleta.observations || [];

  const addObservation = () => {
    if (!newObservation.trim()) return;

    const observation: Observation = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text: newObservation.trim(),
      type: observationType,
    };

    onUpdate([observation, ...observations]);
    setNewObservation("");
    setObservationType("neutro");
  };

  const removeObservation = (id: string) => {
    onUpdate(observations.filter((obs) => obs.id !== id));
  };

  const getTypeIcon = (type: Observation["type"]) => {
    switch (type) {
      case "positivo":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "negativo":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeBadge = (type: Observation["type"]) => {
    switch (type) {
      case "positivo":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "negativo":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary relative">
          <History className="w-4 h-4" />
          {observations.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] rounded-full flex items-center justify-center text-primary-foreground font-bold">
              {observations.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] glass-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Histórico de Observações
            <Badge variant="outline" className="ml-2 text-muted-foreground">
              {atleta.nome}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Add New Observation */}
        <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Nova Observação</span>
          </div>
          
          <Textarea
            value={newObservation}
            onChange={(e) => setNewObservation(e.target.value)}
            placeholder="Ex: Melhorou muito o tempo de reação no 1x1..."
            className="min-h-[80px] bg-background/50 border-border resize-none"
          />
          
          <div className="flex items-center gap-3">
            <Select value={observationType} onValueChange={(v) => setObservationType(v as Observation["type"])}>
              <SelectTrigger className="w-[140px] bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positivo">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    Positivo
                  </span>
                </SelectItem>
                <SelectItem value="negativo">
                  <span className="flex items-center gap-2">
                    <TrendingDown className="w-3 h-3 text-red-400" />
                    Negativo
                  </span>
                </SelectItem>
                <SelectItem value="neutro">
                  <span className="flex items-center gap-2">
                    <Minus className="w-3 h-3 text-gray-400" />
                    Neutro
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={addObservation} 
              disabled={!newObservation.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Adicionar
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <ScrollArea className="h-[300px] pr-4">
          {observations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma observação registrada</p>
              <p className="text-xs mt-1">Adicione notas sobre a evolução do atleta</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-border" />
              
              <AnimatePresence mode="popLayout">
                {observations.map((obs, index) => (
                  <motion.div
                    key={obs.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-10 pb-4 group"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-2.5 top-1 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center ${
                      obs.type === "positivo" ? "border-green-500" :
                      obs.type === "negativo" ? "border-red-500" : "border-gray-500"
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        obs.type === "positivo" ? "bg-green-500" :
                        obs.type === "negativo" ? "bg-red-500" : "bg-gray-500"
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="bg-secondary/30 rounded-lg p-3 border border-border hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {getTypeIcon(obs.type)}
                          <span className="font-medium">{formatDate(obs.date)}</span>
                          <span>•</span>
                          <span>{formatTime(obs.date)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={() => removeObservation(obs.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-foreground mt-2">{obs.text}</p>
                      <Badge className={`mt-2 text-[10px] ${getTypeBadge(obs.type)}`}>
                        {obs.type === "positivo" ? "Evolução" : obs.type === "negativo" ? "Atenção" : "Nota"}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
