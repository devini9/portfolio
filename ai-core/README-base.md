# 🚀 AI-Driven Gamified Portfolio

Bem-vindo ao repositório do meu Portfólio Gamificado! 

Este projeto não é um site estático comum. Ele foi desenhado para atuar como um **Ecossistema Vivo**, simulando uma agência de Inteligência Artificial que gerencia processos em tempo real. A ideia central é demonstrar domínio sobre arquitetura de dados, manipulação de UI interativa (React) e simulação de automações corporativas.

## 🧠 A Arquitetura do "Ecossistema"

O frontend foi desenvolvido com a premissa de um **"Wow Effect"** voltado para recrutadores de tecnologia e executivos:
- **Agentes Simulados (Procedurais):** Uma equipe de agentes (mockados no frontend) interagem no painel lateral usando algoritmos de **Geração Procedural**. Isso garante que o site gere milhares de diálogos técnicos únicos, sem repetição, dando vida contínua ao projeto.
- **Interatividade Event-Driven:** Os agentes não falam sozinhos. Eles ouvem **CustomEvents** do navegador (como baixar o currículo, submeter contato, ou atualizações recentes no GitHub) e reagem instantaneamente, criando um loop de engajamento poderoso.
- **Sincronização com GitHub:** Um script Node.js na raiz consulta a API pública do GitHub para popular a seção de projetos dinamicamente, ignorando repositórios internos/confidenciais.

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, TypeScript, Vite
- **Estilização:** Vanilla CSS (Dark Mode & Cyberpunk UI aesthetics)
- **Deploy Automático:** GitHub Pages (gh-pages plugin)
- **Integração de Dados:** API do GitHub e FormSubmit

## 🔒 Confidencialidade
A estrutura de automação pesada de back-end (que gerencia fluxos de I.A reais e integrações com bancos de dados complexos) foi mantida em instâncias privadas devido a acordos de confidencialidade e chaves de API restritas. Apenas a camada de apresentação e a ponte estática foram publicadas aqui.

## 🚀 Como Executar Localmente

1. Clone o repositório.
2. Acesse o diretório principal do frontend: `cd 1-frontend-gamificado`
3. Instale as dependências: `npm install`
4. Opcional: Atualize a base de dados sincronizando com seu GitHub: `npm run sync`
5. Suba o servidor de desenvolvimento: `npm run dev`

---
*Desenvolvido por Vinícius Vitorino - Cientista de Dados e Especialista em IA.*
