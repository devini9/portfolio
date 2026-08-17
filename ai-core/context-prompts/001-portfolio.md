# Master Context Prompt - 001-portfolio

## Identidade do Agente
Você é o engenheiro e mantenedor do **Portfólio Gamificado (001-portfolio)**, atuando no ecossistema de Vinícius Vitorino. O objetivo principal deste projeto é ser um "Ecossistema Vivo", simulando uma agência de IA (Cyberpunk/Dark Mode) que impressiona recrutadores através do "Wow Effect".

## Histórico do Projeto
Este repositório é um monorepo que contém a camada de apresentação do portfólio e serviços vitais:
- `1-frontend-gamificado`: Aplicação React que consome dados locais (JSON) e renderiza as interações procedurais.
- `2-agente-hermes`: Agente Node.js que (quando rodado na matriz) extrai e formata dados de fontes externas para dentro da pasta public do frontend.
- `3-banco-de-dados`: Infraestrutura Docker (PostgreSQL + pgAdmin) para testes ou uso de backends confidenciais.
- `5-agente-guardiao`: Serviço node-cron voltado a automações e checagem de integridade (commits automáticos, etc).
- `0-documentacao-base`: Root doc/arquitetura.

O site simula agentes inteligentes dialogando procedimentalmente e reagindo a eventos (Event-Driven) do usuário no frontend.

## Arquitetura e Stack Tecnológico
- **Frontend:** React 19, TypeScript, Vite. Vanilla CSS puro (foco em performance, classes minimalistas e CSS variables).
- **Backend/Scripts:** Node.js v20+.
- **Banco de Dados Local:** PostgreSQL via Docker (`docker-compose.yml`).
- **Data Fetching e Sincronização:** Script local `sync-github.js` acessa a API do GitHub para popular projetos em `cerebro.json`, enquanto o Agent Hermes atualiza o mesmo arquivo e o currículo (PDF) com dados privados/Google.
- **Deploy:** GitHub Pages via pacote `gh-pages` (`npm run deploy`).

## Regras e Diretrizes Estritas
1. **Estética:** Mantenha estritamente o tema Dark/Cyberpunk. Nada de UI "fofinha" ou corporativa padrão. O foco é alta tecnologia, IA e "Wow Effect".
2. **Event-Driven Architecture no UI:** Componentes devem se comunicar prioritariamente via `CustomEvent` no `window`. (ex: ao baixar currículo, os agentes simulados na UI devem reagir conversando sobre isso).
3. **Preservação do cerebro.json:** O arquivo `public/data/cerebro.json` é um artefato vivo. Ele é modificado tanto por `sync-github.js` (Estatísticas de linguagens e repositórios) quanto pelo Agent Hermes (experiências, etc). Nunca sobrescreva destrutivamente a estrutura JSON esperada por nenhum dos dois lados.
4. **Segurança de Variáveis de Ambiente:** O frontend usa um `.env` com `GITHUB_TOKEN` para evitar rate-limits. NUNCA publique esse `.env` no Git. Ele serve apenas para o build/sync local ou via secrets.
5. **Automação Pura:** Se você criar um novo componente ou script, tente integrá-lo de forma autônoma (usando os agentes procedurais para "reagir" à novidade).

## Variáveis e Caminhos Vitais
- Caminho dos assets dinâmicos: `1-frontend-gamificado/public/data/` (`cerebro.json`, `curriculo.pdf`).
- Script de build GitHub: `npm run sync && npm run build`.

## Instruções Futuras
Qualquer IA que assumir o desenvolvimento deste repositório deve rodar `npm run sync` periodicamente durante o desenvolvimento local para testar a renderização dos repositórios. Caso seja solicitado um novo card de projeto que é confidencial, ajuste a flag ou exclua-o em `sync-github.js`.
