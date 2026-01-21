import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Camera, MapPin, Target, Calendar, Ruler, Weight, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { categorias, pernas, posicoes } from "@/lib/data";
import { StatsInput } from "@/components/StatsInput";
import type { Atleta, AthleteStats } from "@/lib/types";

interface AthleteFormProps {
  onSubmit: (atleta: Atleta) => void;
}

const DEFAULT_STATS: AthleteStats = {
  tecnica: 50,
  velocidade: 50,
  fisico: 50,
  tatico: 50,
  mental: 50,
  drible: 50,
};

export function AthleteForm({ onSubmit }: AthleteFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    altura: "",
    peso: "",
    categoria: "",
    posicao: "",
    perna: "",
    regiao: "",
    clubeAlvo: "",
    foto: "",
  });
  const [stats, setStats] = useState<AthleteStats>(DEFAULT_STATS);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = () => {
    return (
      formData.nome.trim() !== "" &&
      formData.dataNascimento !== "" &&
      formData.altura.trim() !== "" &&
      formData.peso.trim() !== "" &&
      formData.categoria !== "" &&
      formData.posicao !== "" &&
      formData.perna !== "" &&
      formData.regiao.trim() !== "" &&
      formData.clubeAlvo.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    onSubmit({
      ...formData,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString(),
      stats,
    });

    setFormData({ nome: "", dataNascimento: "", altura: "", peso: "", categoria: "", posicao: "", perna: "", regiao: "", clubeAlvo: "", foto: "" });
    setStats(DEFAULT_STATS);
    setIsStatsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
      <Card className="glass-card border-primary/20 sticky top-24">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Novo Atleta</CardTitle>
              <p className="text-xs text-muted-foreground">Cadastrar jogador</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Digite o nome do atleta"
                className={`bg-secondary/50 border-border focus:border-primary input-glow ${!formData.nome.trim() ? "border-destructive/50" : ""}`}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Data de Nascimento *</Label>
              <Input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData((prev) => ({ ...prev, dataNascimento: e.target.value }))}
                className={`bg-secondary/50 border-border focus:border-primary ${!formData.dataNascimento ? "border-destructive/50" : ""}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2"><Ruler className="w-3.5 h-3.5" /> Altura (cm) *</Label>
                <Input
                  type="number"
                  value={formData.altura}
                  onChange={(e) => setFormData((prev) => ({ ...prev, altura: e.target.value }))}
                  placeholder="Ex: 175"
                  className={`bg-secondary/50 border-border focus:border-primary ${!formData.altura.trim() ? "border-destructive/50" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2"><Weight className="w-3.5 h-3.5" /> Peso (kg) *</Label>
                <Input
                  type="number"
                  value={formData.peso}
                  onChange={(e) => setFormData((prev) => ({ ...prev, peso: e.target.value }))}
                  placeholder="Ex: 70"
                  className={`bg-secondary/50 border-border focus:border-primary ${!formData.peso.trim() ? "border-destructive/50" : ""}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(v) => setFormData((prev) => ({ ...prev, categoria: v }))}>
                  <SelectTrigger className={`bg-secondary/50 border-border ${!formData.categoria ? "border-destructive/50" : ""}`}><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Posição *</Label>
                <Select value={formData.posicao} onValueChange={(v) => setFormData((prev) => ({ ...prev, posicao: v }))}>
                  <SelectTrigger className={`bg-secondary/50 border-border ${!formData.posicao ? "border-destructive/50" : ""}`}><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{posicoes.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Perna Dominante *</Label>
              <Select value={formData.perna} onValueChange={(v) => setFormData((prev) => ({ ...prev, perna: v }))}>
                <SelectTrigger className={`bg-secondary/50 border-border ${!formData.perna ? "border-destructive/50" : ""}`}><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{pernas.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Região *</Label>
              <Input
                value={formData.regiao}
                onChange={(e) => setFormData((prev) => ({ ...prev, regiao: e.target.value }))}
                placeholder="Ex: São Paulo, SP"
                className={`bg-secondary/50 border-border focus:border-primary ${!formData.regiao.trim() ? "border-destructive/50" : ""}`}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Clube Alvo *</Label>
              <Input
                value={formData.clubeAlvo}
                onChange={(e) => setFormData((prev) => ({ ...prev, clubeAlvo: e.target.value }))}
                placeholder="Clube de interesse"
                className={`bg-secondary/50 border-border focus:border-primary ${!formData.clubeAlvo.trim() ? "border-destructive/50" : ""}`}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2"><Camera className="w-3.5 h-3.5" /> URL da Foto</Label>
              <Input
                value={formData.foto}
                onChange={(e) => setFormData((prev) => ({ ...prev, foto: e.target.value }))}
                placeholder="https://..."
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>

            {/* Stats Collapsible */}
            <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full justify-between border-primary/30 text-primary hover:bg-primary/10"
                >
                  <span className="flex items-center gap-2">
                    📊 Avaliação Técnica
                  </span>
                  {isStatsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <StatsInput stats={stats} onChange={setStats} />
              </CollapsibleContent>
            </Collapsible>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary" disabled={isSubmitting || !isFormValid()}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Atleta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
