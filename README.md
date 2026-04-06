# ⚽ Base Player Pro (ScoutPro)

O **Base Player Pro** é um sistema de gerenciamento e captação de atletas de futebol de base, projetado para facilitar o acompanhamento de desempenho, registros físicos e scouts técnicos. O projeto oferece uma interface moderna e intuitiva para que gestores e observadores possam catalogar novos talentos com eficiência.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as tecnologias mais modernas do ecossistema Full-Stack:

* **Frontend:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
* **Ferramenta de Build:** [Vite](https://vitejs.dev/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
* **Gerenciamento de Estado & Cache:** [React Query](https://tanstack.com/query/latest)
* **Roteamento:** [React Router Dom](https://reactrouter.com/)
* **Deploy Automatizado:** [GitHub Pages](https://pages.github.com/) com `gh-pages`

---

## 🛠️ O que foi implementado até agora

Durante o desenvolvimento, passamos pelas seguintes etapas de engenharia:

1.  **Estruturação de Componentes:** Criação de cards de atletas e dashboards de monitoramento.
2.  **Configuração de Rotas:** Implementação de rotas protegidas e tratamento de erro 404 personalizado.
3.  **Deploy em Produção:** * Configuração do `basename` no `BrowserRouter` para compatibilidade com subdiretórios do GitHub.
    * Ajuste do `vite.config.ts` para mapeamento de assets estáticos.
    * Automação do fluxo de build e deploy via scripts customizados no `package.json`.
4.  **Resolução de Dependências:** Alinhamento de versões entre o Vite e plugins do React para garantir estabilidade no ambiente local (Linux).

---

## ⚙️ Como rodar o projeto localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/NilsonJr11/base-player-pro/](https://nilsonjr11.github.io/base-player-pro/)