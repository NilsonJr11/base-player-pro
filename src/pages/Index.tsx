import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { TryoutsBoard } from "@/components/TryoutsBoard";
import { AthleteForm } from "@/components/AthleteForm";
import { AthleteGrid } from "@/components/AthleteGrid";
import { SearchFilter } from "@/components/SearchFilter";
import { DataBackup } from "@/components/DataBackup";
import type { Atleta } from "@/lib/types";
import heroStadium from "@/assets/hero-stadium.jpg";

export default function Index() {
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [filteredAtletas, setFilteredAtletas] = useState<Atleta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);

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

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <StatsCards stats={stats} />
        <TryoutsBoard atletas={atletas} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AthleteForm onSubmit={addAtleta} />
          </div>
          <div className="lg:col-span-2 space-y-6">
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
        </div>
      </main>
    </div>
  );
}
