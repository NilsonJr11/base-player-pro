import { useRef } from "react";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
      backgroundColor: "#0f1729",
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
    pdf.save(`relatorio-${atleta.nome.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const getOverall = () => {
    if (!atleta.stats) return null;
    return Math.round(Object.values(atleta.stats).reduce((a, b) => a + b, 0) / 6);
  };

  const getStatLabel = (key: string) => {
    const labels: Record<string, string> = {
      tecnica: "Técnica",
      velocidade: "Velocidade",
      fisico: "Físico",
      tatico: "Tático",
      mental: "Mental",
      drible: "Drible",
    };
    return labels[key] || key;
  };

  const getStatColor = (value: number) => {
    if (value >= 80) return "#22c55e";
    if (value >= 60) return "#eab308";
    if (value >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <FileText className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto glass-card border-border p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Relatório de Observação
            </span>
            <Button onClick={generatePDF} size="sm" className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Professional Report Template */}
        <div className="p-6 pt-4">
          <div
            ref={reportRef}
            className="bg-[#0f1729] text-white rounded-lg overflow-hidden"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-6">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTJoLTJ2Mmgyem0tNiA2aC0ydi00aDJ2NHptMC02di0yaC0ydjJoMnptLTYgNmgtMnYtNGgydjR6bTAtNnYtMmgtMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    Scout<span className="text-emerald-100">Pro</span>
                  </h1>
                  <p className="text-emerald-100 text-sm mt-1">Relatório de Observação Técnica</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    CONFIDENCIAL
                  </Badge>
                  <p className="text-emerald-100 text-xs mt-2">
                    Ref: #{atleta.id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {/* Athlete Header */}
              <div className="flex gap-6 mb-6">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-40 rounded-xl border-2 border-emerald-500/50 overflow-hidden bg-gradient-to-br from-emerald-500/20 to-transparent flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    {atleta.foto ? (
                      <img src={atleta.foto} alt={atleta.nome} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-emerald-400">{getInitials(atleta.nome)}</span>
                    )}
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{atleta.nome}</h2>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {atleta.posicao}
                        </Badge>
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          {atleta.categoria}
                        </Badge>
                      </div>
                    </div>
                    {getOverall() && (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <span className="text-2xl font-bold text-white">{getOverall()}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">OVERALL</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <QuickStat label="Idade" value={atleta.dataNascimento ? `${calculateAge(atleta.dataNascimento)}` : "—"} unit="anos" />
                    <QuickStat label="Altura" value={atleta.altura || "—"} unit="cm" />
                    <QuickStat label="Peso" value={atleta.peso || "—"} unit="kg" />
                    <QuickStat label="Pé" value={atleta.perna || "—"} unit="" />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Personal Info */}
                <div>
                  <SectionTitle>Informações Pessoais</SectionTitle>
                  <div className="space-y-3">
                    <InfoRow label="Nome Completo" value={atleta.nome} />
                    <InfoRow 
                      label="Data de Nascimento" 
                      value={atleta.dataNascimento ? new Date(atleta.dataNascimento).toLocaleDateString("pt-BR") : "—"} 
                    />
                    <InfoRow label="Região" value={atleta.regiao || "Não informada"} />
                    <InfoRow label="Perna Dominante" value={atleta.perna || "Não informada"} />
                  </div>

                  {atleta.clubeAlvo && (
                    <div className="mt-6">
                      <SectionTitle>Clube Alvo</SectionTitle>
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <p className="text-amber-400 font-semibold text-lg">{atleta.clubeAlvo}</p>
                        <p className="text-amber-400/70 text-xs mt-1">Indicação prioritária</p>
                      </div>
                    </div>
                  )}

                  {/* Physical Profile */}
                  <div className="mt-6">
                    <SectionTitle>Perfil Físico</SectionTitle>
                    <div className="grid grid-cols-3 gap-3">
                      <MetricCard label="Altura" value={atleta.altura || "—"} unit="cm" />
                      <MetricCard label="Peso" value={atleta.peso || "—"} unit="kg" />
                      <MetricCard 
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
                </div>

                {/* Right Column - Technical Evaluation */}
                <div>
                  <SectionTitle>Avaliação Técnica</SectionTitle>
                  {atleta.stats ? (
                    <div className="space-y-3">
                      {Object.entries(atleta.stats).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">{getStatLabel(key)}</span>
                            <span className="font-semibold" style={{ color: getStatColor(value) }}>{value}</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${value}%`,
                                backgroundColor: getStatColor(value)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">Avaliação técnica não realizada</p>
                  )}

                  {/* Scout Notes Section */}
                  <div className="mt-6">
                    <SectionTitle>Observações do Scout</SectionTitle>
                    {atleta.observations && atleta.observations.length > 0 ? (
                      <div className="space-y-2 max-h-[150px] overflow-hidden">
                        {atleta.observations.slice(0, 3).map((obs) => (
                          <div key={obs.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                              <span className={`w-2 h-2 rounded-full ${
                                obs.type === "positivo" ? "bg-green-500" :
                                obs.type === "negativo" ? "bg-red-500" : "bg-gray-500"
                              }`} />
                              {new Date(obs.date).toLocaleDateString("pt-BR")}
                            </div>
                            <p className="text-gray-300 text-sm">{obs.text}</p>
                          </div>
                        ))}
                        {atleta.observations.length > 3 && (
                          <p className="text-gray-500 text-xs text-center">
                            +{atleta.observations.length - 3} observações adicionais
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <p className="text-gray-500 text-sm italic">
                          Nenhuma observação registrada
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendation Section */}
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-emerald-400 font-semibold">Recomendação: APTO PARA AVALIAÇÃO</p>
                    <p className="text-emerald-400/70 text-xs">Atleta atende aos requisitos mínimos para teste no clube alvo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800/50 px-6 py-4 flex justify-between items-center text-xs text-gray-500">
              <div>
                <p>Gerado em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                <p className="text-gray-600 mt-1">Este documento é confidencial e de uso exclusivo do destinatário.</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 font-semibold">ScoutPro</p>
                <p>© {new Date().getFullYear()} Todos os direitos reservados</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
      <span className="w-1 h-4 bg-emerald-500 rounded-full" />
      {children}
    </h3>
  );
}

function QuickStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700/50">
      <p className="text-lg font-bold text-white">
        {value}
        {unit && <span className="text-xs text-gray-400 ml-1">{unit}</span>}
      </p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-800">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function MetricCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700/50">
      <p className="text-xl font-bold text-emerald-400">
        {value}
        {unit && <span className="text-xs text-gray-400 ml-1">{unit}</span>}
      </p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
