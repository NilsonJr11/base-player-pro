import type { Peneira } from "./types";

export const peneiras: Peneira[] = [
  {
    id: "1",
    clube: "Santos FC",
    categoria: "Sub-15",
    data: "15/02/2026",
    contato: "https://www.santosfc.com.br",
    status: "Aberto",
    escudo: "https://logodetimes.com/times/santos/logo-santos-256.png",
  },
  {
    id: "2",
    clube: "São Paulo FC",
    categoria: "Sub-17",
    data: "10/03/2026",
    contato: "https://www.saopaulofc.net",
    status: "Aberto",
    escudo: "https://logodetimes.com/times/sao-paulo/logo-sao-paulo-256.png",
  },
  {
    id: "3",
    clube: "Palmeiras",
    categoria: "Sub-13",
    data: "Abril/2026",
    contato: "https://www.palmeiras.com.br",
    status: "Em breve",
    escudo: "https://logodetimes.com/times/palmeiras/logo-palmeiras-256.png",
  },
  {
    id: "4",
    clube: "Corinthians",
    categoria: "Sub-15",
    data: "20/02/2026",
    contato: "https://www.corinthians.com.br",
    status: "Aberto",
    escudo: "https://logodetimes.com/times/corinthians/logo-corinthians-256.png",
  },
];

export const categorias = [
  "Sub-11",
  "Sub-13", 
  "Sub-15",
  "Sub-17",
  "Sub-20",
  "Profissional",
];

export const pernas = ["Destro", "Canhoto", "Ambidestro"];

export const posicoes = [
  "Goleiro",
  "Zagueiro",
  "Lateral Direito",
  "Lateral Esquerdo",
  "Volante",
  "Meia",
  "Meia Atacante",
  "Ponta Direita",
  "Ponta Esquerda",
  "Centroavante",
];
