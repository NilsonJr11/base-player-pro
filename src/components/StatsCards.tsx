import { motion } from "framer-motion";
import { Users, Shield, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Stats } from "@/lib/types";

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total de Atletas",
      value: stats.total,
      icon: Users,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
    },
    {
      title: "Categorias de Base",
      value: stats.base,
      icon: Shield,
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
    },
    {
      title: "Profissionais",
      value: stats.profissional,
      icon: Star,
      gradient: "from-warning/20 to-warning/5",
      iconBg: "bg-warning/20",
      iconColor: "text-warning",
    },
    {
      title: "Taxa de Aprovação",
      value: stats.total > 0 ? Math.round((stats.profissional / stats.total) * 100) : 0,
      suffix: "%",
      icon: TrendingUp,
      gradient: "from-success/20 to-success/5",
      iconBg: "bg-success/20",
      iconColor: "text-success",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="stat-card glass-card border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-5">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-lg opacity-50`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {card.value}
                    {card.suffix && <span className="text-lg ml-1">{card.suffix}</span>}
                  </p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
