export interface Atleta {
  id: string;
  nome: string;
  categoria: string;
  posicao: string;
  perna: string;
  regiao: string;
  clubeAlvo: string;
  foto: string;
  dataCadastro?: string;
}

export interface Peneira {
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
