import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { AthleteStats } from "@/lib/types";
import { AthleteRadarChart } from "./AthleteRadarChart";

interface StatsInputProps {
  stats: AthleteStats;
  onChange: (stats: AthleteStats) => void;
}

const STAT_CONFIG: { key: keyof AthleteStats; label: string; description: string }[] = [
  { key: "tecnica", label: "Técnica", description: "Controle, passes, finalização" },
  { key: "velocidade", label: "Velocidade", description: "Aceleração e sprint" },
  { key: "fisico", label: "Físico", description: "Força e resistência" },
  { key: "tatico", label: "Tático", description: "Posicionamento e visão" },
  { key: "mental", label: "Mental", description: "Concentração e liderança" },
  { key: "drible", label: "Drible", description: "Finta e 1v1" },
];

export function StatsInput({ stats, onChange }: StatsInputProps) {
  const handleChange = (key: keyof AthleteStats, value: number[]) => {
    onChange({ ...stats, [key]: value[0] });
  };

  const overall = Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 6);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Avaliação Técnica</Label>
        <span className="text-xs text-muted-foreground">
          Overall: <span className="text-primary font-bold">{overall}</span>
        </span>
      </div>
      
      {/* Radar preview */}
      <div className="flex justify-center py-2">
        <AthleteRadarChart stats={stats} size="sm" />
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        {STAT_CONFIG.map(({ key, label, description }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{label}</span>
              <span className="text-xs text-primary font-mono">{stats[key]}</span>
            </div>
            <Slider
              value={[stats[key]]}
              onValueChange={(v) => handleChange(key, v)}
              min={0}
              max={100}
              step={1}
              className="cursor-pointer"
            />
            <p className="text-[10px] text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
