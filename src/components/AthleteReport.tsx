import { useRef } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Atleta } from "@/lib/types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface AthleteReportProps {
  atleta: Atleta;
}

export function AthleteReport({ atleta }: AthleteReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      backgroundColor: "#0a0f1a",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`ficha-${atleta.nome.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <FileText className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Ficha do Atleta</span>
            <Button onClick={generatePDF} size="sm" className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Report Template */}
        <div
          ref={reportRef}
          className="bg-[#0a0f1a] text-white p-8 rounded-lg"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Scout<span className="text-emerald-400">Pro</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1">Sistema Profissional de Captação</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">FICHA TÉCNICA</p>
              <p className="text-lg font-semibold text-emerald-400">#{atleta.id.slice(-6).toUpperCase()}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-36 h-44 rounded-lg border-2 border-emerald-500/50 overflow-hidden bg-gradient-to-br from-emerald-500/20 to-transparent flex items-center justify-center">
                {atleta.foto ? (
                  <img src={atleta.foto} alt={atleta.nome} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-emerald-400">{getInitials(atleta.nome)}</span>
                )}
              </div>
              <div className="mt-3 text-center">
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                  {atleta.categoria}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{atleta.nome}</h2>
              <p className="text-emerald-400 font-medium mb-4">{atleta.posicao}</p>

              <div className="grid grid-cols-2 gap-4">
                <InfoBlock label="Idade" value={atleta.dataNascimento ? `${calculateAge(atleta.dataNascimento)} anos` : "—"} />
                <InfoBlock label="Nascimento" value={atleta.dataNascimento ? new Date(atleta.dataNascimento).toLocaleDateString("pt-BR") : "—"} />
                <InfoBlock label="Altura" value={atleta.altura ? `${atleta.altura} cm` : "—"} />
                <InfoBlock label="Peso" value={atleta.peso ? `${atleta.peso} kg` : "—"} />
                <InfoBlock label="Pé Preferido" value={atleta.perna || "—"} />
                <InfoBlock label="Região" value={atleta.regiao || "—"} />
              </div>
            </div>
          </div>

          {/* Target Club */}
          {atleta.clubeAlvo && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg border border-amber-500/30">
              <p className="text-xs text-amber-400 font-semibold mb-1">CLUBE ALVO</p>
              <p className="text-lg font-bold text-white">{atleta.clubeAlvo}</p>
            </div>
          )}

          {/* Physical Profile */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Perfil Físico</h3>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Altura" value={atleta.altura || "—"} unit="cm" />
              <StatCard label="Peso" value={atleta.peso || "—"} unit="kg" />
              <StatCard
                label="IMC"
                value={
                  atleta.altura && atleta.peso
                    ? (parseFloat(atleta.peso) / Math.pow(parseFloat(atleta.altura) / 100, 2)).toFixed(1)
                    : "—"
                }
                unit=""
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
            <p>Gerado em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
            <p>ScoutPro © {new Date().getFullYear()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
      <p className="text-2xl font-bold text-emerald-400">
        {value}
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
      </p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
