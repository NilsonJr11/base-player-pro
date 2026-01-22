import { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { MapPin, Users, Target, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseRegion } from "@/lib/brazilStates";
import type { Atleta } from "@/lib/types";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icon with primary color
const createCustomIcon = (count: number) => {
  const size = Math.min(40, 24 + count * 4);
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: linear-gradient(135deg, hsl(142, 76%, 46%), hsl(142, 76%, 36%));
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size > 30 ? 14 : 12}px;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
        border: 2px solid rgba(255,255,255,0.3);
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Component to fit bounds when markers change
function FitBounds({ markers }: { markers: { lat: number; lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [markers, map]);

  return null;
}

interface GroupedLocation {
  lat: number;
  lng: number;
  region: string;
  atletas: Atleta[];
}

interface TalentMapProps {
  atletas: Atleta[];
}

export function TalentMap({ atletas }: TalentMapProps) {
  // Group athletes by location
  const groupedLocations = useMemo(() => {
    const groups: Record<string, GroupedLocation> = {};

    atletas.forEach((atleta) => {
      if (!atleta.regiao) return;

      const coords = parseRegion(atleta.regiao);
      if (!coords) return;

      const key = `${coords.lat.toFixed(2)},${coords.lng.toFixed(2)}`;
      if (!groups[key]) {
        groups[key] = {
          lat: coords.lat,
          lng: coords.lng,
          region: atleta.regiao,
          atletas: [],
        };
      }
      groups[key].atletas.push(atleta);
    });

    return Object.values(groups);
  }, [atletas]);

  // Stats by region
  const regionStats = useMemo(() => {
    const stats = groupedLocations.map((loc) => ({
      region: loc.region,
      count: loc.atletas.length,
      categories: [...new Set(loc.atletas.map((a) => a.categoria))],
    }));
    return stats.sort((a, b) => b.count - a.count).slice(0, 5);
  }, [groupedLocations]);

  const totalMapped = groupedLocations.reduce((sum, loc) => sum + loc.atletas.length, 0);
  const unmappedCount = atletas.length - totalMapped;

  // Brazil center coordinates
  const brazilCenter: [number, number] = [-14.235, -51.9253];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-border/50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Mapa de Talentos
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Users className="w-3 h-3 mr-1" />
                {totalMapped} mapeados
              </Badge>
              {unmappedCount > 0 && (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  {unmappedCount} sem região
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-4 gap-0">
            {/* Map */}
            <div className="lg:col-span-3 h-[400px] relative">
              {groupedLocations.length > 0 ? (
                <MapContainer
                  center={brazilCenter}
                  zoom={4}
                  className="h-full w-full z-10"
                  style={{ background: "hsl(var(--background))" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <FitBounds markers={groupedLocations} />
                  {groupedLocations.map((location, index) => (
                    <Marker
                      key={index}
                      position={[location.lat, location.lng]}
                      icon={createCustomIcon(location.atletas.length)}
                    >
                      <Popup className="custom-popup">
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {location.region}
                          </h3>
                          <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                            {location.atletas.map((atleta) => (
                              <div
                                key={atleta.id}
                                className="flex items-center gap-2 text-xs p-1.5 bg-muted/50 rounded"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium">
                                  {atleta.nome.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{atleta.nome}</p>
                                  <p className="text-muted-foreground text-[10px]">
                                    {atleta.posicao} • {atleta.categoria}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-secondary/30">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Nenhum atleta com região válida</p>
                    <p className="text-xs mt-1">
                      Adicione atletas com região no formato "Cidade, UF"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats sidebar */}
            <div className="lg:col-span-1 border-l border-border/50 bg-secondary/20 p-4">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Top Regiões
              </h4>
              <ScrollArea className="h-[340px]">
                {regionStats.length > 0 ? (
                  <div className="space-y-3">
                    {regionStats.map((stat, index) => (
                      <motion.div
                        key={stat.region}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-background/50 border border-border/30"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium truncate flex-1 mr-2">
                            {stat.region}
                          </span>
                          <Badge className="bg-primary/20 text-primary border-0 text-xs">
                            {stat.count}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {stat.categories.slice(0, 3).map((cat) => (
                            <Badge
                              key={cat}
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {cat}
                            </Badge>
                          ))}
                          {stat.categories.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 bg-muted"
                            >
                              +{stat.categories.length - 3}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>Sem dados regionais</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
