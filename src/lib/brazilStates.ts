// Brazilian states with coordinates for map visualization
export interface StateCoordinates {
  name: string;
  sigla: string;
  lat: number;
  lng: number;
}

export const brazilStates: StateCoordinates[] = [
  { name: "Acre", sigla: "AC", lat: -9.0238, lng: -70.812 },
  { name: "Alagoas", sigla: "AL", lat: -9.5713, lng: -36.782 },
  { name: "Amapá", sigla: "AP", lat: 1.4102, lng: -51.7702 },
  { name: "Amazonas", sigla: "AM", lat: -3.4168, lng: -65.8561 },
  { name: "Bahia", sigla: "BA", lat: -12.5797, lng: -41.7007 },
  { name: "Ceará", sigla: "CE", lat: -5.4984, lng: -39.3206 },
  { name: "Distrito Federal", sigla: "DF", lat: -15.7998, lng: -47.8645 },
  { name: "Espírito Santo", sigla: "ES", lat: -19.1834, lng: -40.3089 },
  { name: "Goiás", sigla: "GO", lat: -15.827, lng: -49.8362 },
  { name: "Maranhão", sigla: "MA", lat: -4.9609, lng: -45.2744 },
  { name: "Mato Grosso", sigla: "MT", lat: -12.6819, lng: -56.9211 },
  { name: "Mato Grosso do Sul", sigla: "MS", lat: -20.7722, lng: -54.7852 },
  { name: "Minas Gerais", sigla: "MG", lat: -18.5122, lng: -44.555 },
  { name: "Pará", sigla: "PA", lat: -3.4168, lng: -52.2176 },
  { name: "Paraíba", sigla: "PB", lat: -7.2399, lng: -36.7819 },
  { name: "Paraná", sigla: "PR", lat: -24.8935, lng: -51.55 },
  { name: "Pernambuco", sigla: "PE", lat: -8.3878, lng: -37.852 },
  { name: "Piauí", sigla: "PI", lat: -7.7183, lng: -42.7289 },
  { name: "Rio de Janeiro", sigla: "RJ", lat: -22.2521, lng: -42.6526 },
  { name: "Rio Grande do Norte", sigla: "RN", lat: -5.4026, lng: -36.9541 },
  { name: "Rio Grande do Sul", sigla: "RS", lat: -30.0346, lng: -51.2177 },
  { name: "Rondônia", sigla: "RO", lat: -10.8312, lng: -63.3463 },
  { name: "Roraima", sigla: "RR", lat: 2.7376, lng: -62.0751 },
  { name: "Santa Catarina", sigla: "SC", lat: -27.2423, lng: -50.2189 },
  { name: "São Paulo", sigla: "SP", lat: -23.5505, lng: -46.6333 },
  { name: "Sergipe", sigla: "SE", lat: -10.5741, lng: -37.3857 },
  { name: "Tocantins", sigla: "TO", lat: -10.1753, lng: -48.2982 },
];

// Major Brazilian cities with coordinates
export interface CityCoordinates {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export const majorCities: CityCoordinates[] = [
  { city: "São Paulo", state: "SP", lat: -23.5505, lng: -46.6333 },
  { city: "Rio de Janeiro", state: "RJ", lat: -22.9068, lng: -43.1729 },
  { city: "Salvador", state: "BA", lat: -12.9714, lng: -38.5014 },
  { city: "Brasília", state: "DF", lat: -15.7975, lng: -47.8919 },
  { city: "Fortaleza", state: "CE", lat: -3.7172, lng: -38.5433 },
  { city: "Belo Horizonte", state: "MG", lat: -19.9167, lng: -43.9345 },
  { city: "Manaus", state: "AM", lat: -3.119, lng: -60.0217 },
  { city: "Curitiba", state: "PR", lat: -25.4284, lng: -49.2733 },
  { city: "Recife", state: "PE", lat: -8.0476, lng: -34.877 },
  { city: "Porto Alegre", state: "RS", lat: -30.0346, lng: -51.2177 },
  { city: "Belém", state: "PA", lat: -1.4558, lng: -48.4902 },
  { city: "Goiânia", state: "GO", lat: -16.6869, lng: -49.2648 },
  { city: "Guarulhos", state: "SP", lat: -23.4543, lng: -46.5337 },
  { city: "Campinas", state: "SP", lat: -22.9099, lng: -47.0626 },
  { city: "Santos", state: "SP", lat: -23.9608, lng: -46.3336 },
  { city: "Santo André", state: "SP", lat: -23.6737, lng: -46.5432 },
  { city: "Florianópolis", state: "SC", lat: -27.5954, lng: -48.548 },
  { city: "Natal", state: "RN", lat: -5.7793, lng: -35.2009 },
  { city: "João Pessoa", state: "PB", lat: -7.115, lng: -34.8641 },
  { city: "Maceió", state: "AL", lat: -9.6658, lng: -35.735 },
  { city: "Cuiabá", state: "MT", lat: -15.601, lng: -56.0974 },
  { city: "Campo Grande", state: "MS", lat: -20.4697, lng: -54.6201 },
  { city: "Vitória", state: "ES", lat: -20.2976, lng: -40.2958 },
  { city: "Ribeirão Preto", state: "SP", lat: -21.1775, lng: -47.8103 },
  { city: "Sorocaba", state: "SP", lat: -23.5015, lng: -47.4526 },
];

/**
 * Parse a region string and find the best matching coordinates
 * Supports formats like: "São Paulo, SP", "SP", "Rio de Janeiro", etc.
 */
export function parseRegion(regiao: string): { lat: number; lng: number } | null {
  if (!regiao) return null;
  
  const normalized = regiao.toLowerCase().trim();
  
  // Try to find city match first
  for (const city of majorCities) {
    if (
      normalized.includes(city.city.toLowerCase()) ||
      normalized.includes(city.state.toLowerCase())
    ) {
      return { lat: city.lat, lng: city.lng };
    }
  }
  
  // Try to find state match
  for (const state of brazilStates) {
    if (
      normalized.includes(state.name.toLowerCase()) ||
      normalized.includes(state.sigla.toLowerCase())
    ) {
      return { lat: state.lat, lng: state.lng };
    }
  }
  
  return null;
}

// Export states list for Select component
export const estadosBrasileiros = brazilStates.map((s) => ({
  label: `${s.name} (${s.sigla})`,
  value: s.sigla,
}));
