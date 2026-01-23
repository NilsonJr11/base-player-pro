import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { TryoutsBoard } from "@/components/TryoutsBoard";
import { AthleteForm } from "@/components/AthleteForm";
import { AthleteGrid } from "@/components/AthleteGrid";
import { SearchFilter } from "@/components/SearchFilter";
import { DataBackup } from "@/components/DataBackup";
import { TalentMap } from "@/components/TalentMap";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import type { Atleta } from "@/lib/types";
import heroStadium from "@/assets/hero-stadium.jpg";

export default function Index() {
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [filteredAtletas, setFilteredAtletas] = useState<Atleta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("atletas");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAtletas(parsed);
      setFilteredAtletas(parsed);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let result = atletas;
    if (searchTerm) {
      result = result.filter(
        (a) =>
          a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.posicao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((a) => a.categoria === categoryFilter);
    }
    setFilteredAtletas(result);
  }, [searchTerm, categoryFilter, atletas]);

  const addAtleta = (atleta: Atleta) => {
    const updated = [...atletas, { ...atleta, id: Date.now().toString() }];
    setAtletas(updated);
    localStorage.setItem("atletas", JSON.stringify(updated));
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    toast({
      title: "✅ Atleta cadastrado!",
      description: "O novo atleta foi adicionado com sucesso ao sistema.",
    });
  };

  const removeAtleta = (id: string) => {
    const updated = atletas.filter((a) => a.id !== id);
    setAtletas(updated);
    localStorage.setItem("atletas", JSON.stringify(updated));
  };

  const updateAtleta = (id: string, updates: Partial<Atleta>) => {
    const updated = atletas.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setAtletas(updated);
    localStorage.setItem("atletas", JSON.stringify(updated));
  };

  const importAtletas = (imported: Atleta[]) => {
    const merged = [...atletas];
    imported.forEach((imp) => {
      if (!merged.some((a) => a.id === imp.id)) {
        merged.push(imp);
      }
    });
    setAtletas(merged);
    localStorage.setItem("atletas", JSON.stringify(merged));
  };

  const stats = {
    total: atletas.length,
    base: atletas.filter((a) => a.categoria.includes("Sub")).length,
    profissional: atletas.filter((a) => a.categoria === "Profissional").length,
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-glow text-primary text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img src={heroStadium} alt="Stadium" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Scout<span className="gradient-text">Pro</span>
            </h1>
            <p className="text-lg text-muted-foreground">Sistema Profissional de Captação de Atletas</p>
          </motion.div>
        </div>
      </div>

      <Header onAddAthlete={() => setIsFormOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <StatsCards stats={stats} />
        <TalentMap atletas={atletas} />
        <TryoutsBoard atletas={atletas} />

        {/* Athlete Grid - Full Width */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
            />
            <DataBackup atletas={atletas} onImport={importAtletas} />
          </div>
          <AthleteGrid atletas={filteredAtletas} onRemove={removeAtleta} onUpdate={updateAtleta} />
        </div>
      </main>

      {/* Floating Action Button */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg glow-primary z-50 p-0 animate-pulse hover:animate-none transition-all duration-300 hover:scale-110"
            aria-label="Adicionar atleta"
          >
            <UserPlus className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-background border-border">
          <SheetHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold">Cadastrar Novo Atleta</SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  Preencha os dados para adicionar um jogador ao sistema.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <AthleteForm onSubmit={addAtleta} onSuccess={handleFormSuccess} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
