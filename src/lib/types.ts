/** Avaliação técnica do atleta (0-100) */
export interface AthleteStats {
  tecnica: number;    // Controle de bola, passes, finalizações
  velocidade: number; // Velocidade e aceleração
  fisico: number;     // Força, resistência, salto
  tatico: number;     // Posicionamento, visão de jogo
  mental: number;     // Concentração, liderança, compostura
  drible: number;     // Capacidade de driblar adversários
}

/** Observação datada do scout sobre o atleta */
export interface Observation {
  id: string;
  date: string;      // ISO date string
  text: string;
  type: "positivo" | "negativo" | "neutro";
}

/** Dados do atleta cadastrado no sistema */
export interface Atleta {
  id: string;
  nome: string;
  dataNascimento: string;
  altura: string;
  peso: string;
  categoria: string;
  posicao: string;
  perna: string;
  regiao: string;
  clubeAlvo: string;
  foto: string;
  dataCadastro?: string;
  stats?: AthleteStats;
  observations?: Observation[];
}

export interface Peneira {
  escudo?: string;
  id: string;
  clube: string;
  categoria: string;
  data: string;
  contato: string;
  status: "Aberto" | "Em breve" | "Encerrado";
}

export interface Stats {
  total: number;
  base: number;
  profissional: number;
}
