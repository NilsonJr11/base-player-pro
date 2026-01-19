import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Atleta } from "@/lib/types";

interface DataBackupProps {
  atletas: Atleta[];
  onImport: (atletas: Atleta[]) => void;
}

export function DataBackup({ atletas, onImport }: DataBackupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (atletas.length === 0) {
      toast.error("Nenhum atleta para exportar");
      return;
    }

    const dataStr = JSON.stringify(atletas, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scoutpro-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${atletas.length} atletas exportados com sucesso!`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImport(imported);
          toast.success(`${imported.length} atletas importados com sucesso!`);
        } else {
          toast.error("Formato de arquivo inválido");
        }
      } catch {
        toast.error("Erro ao ler o arquivo JSON");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="border-primary/30 text-primary hover:bg-primary/10"
      >
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="border-accent/30 text-accent hover:bg-accent/10"
      >
        <Upload className="w-4 h-4 mr-2" />
        Importar
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
}
