import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import type { AthleteStats } from "@/lib/types";

interface AthleteRadarChartProps {
  stats: AthleteStats;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

const STAT_LABELS: Record<keyof AthleteStats, string> = {
  tecnica: "TEC",
  velocidade: "VEL",
  fisico: "FIS",
  tatico: "TAT",
  mental: "MEN",
  drible: "DRI",
};

const STAT_FULL_LABELS: Record<keyof AthleteStats, string> = {
  tecnica: "Técnica",
  velocidade: "Velocidade",
  fisico: "Físico",
  tatico: "Tático",
  mental: "Mental",
  drible: "Drible",
};

export function AthleteRadarChart({ stats, size = "md", showLabels = true }: AthleteRadarChartProps) {
  const data = Object.entries(stats).map(([key, value]) => ({
    subject: showLabels ? STAT_LABELS[key as keyof AthleteStats] : "",
    fullName: STAT_FULL_LABELS[key as keyof AthleteStats],
    value,
    fullMark: 100,
  }));

  const sizeConfig = {
    sm: { width: 120, height: 100 },
    md: { width: 200, height: 180 },
    lg: { width: 300, height: 280 },
  };

  const { width, height } = sizeConfig[size];

  // Calculate overall rating
  const overall = Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 6);

  return (
    <div className="relative">
      <ResponsiveContainer width={width} height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.3}
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: "hsl(var(--muted-foreground))", 
              fontSize: size === "sm" ? 8 : 10,
              fontWeight: 500
            }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Stats"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Overall rating badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-background/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center border border-primary/30">
          <span className="text-sm font-bold text-primary">{overall}</span>
        </div>
      </div>
    </div>
  );
}

// Compact bar version for cards
export function AthleteStatsBar({ stats }: { stats: AthleteStats }) {
  const entries = Object.entries(stats) as [keyof AthleteStats, number][];
  
  return (
    <div className="space-y-1.5">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-8 uppercase font-medium">
            {STAT_LABELS[key]}
          </span>
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground w-6 text-right font-mono">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
