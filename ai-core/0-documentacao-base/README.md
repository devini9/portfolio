# Base Operacional de Agentes: Portfólio devini9

Bem-vindo à base central do ecossistema de portfólio automatizado e gamificado do usuário **devini9**. Este repositório atua como o sistema nervoso central e centro de operações locais para os Agentes de Inteligência Artificial.

## 🏗 Arquitetura do Sistema

O repositório está estruturado em 5 grandes blocos:

1. **`0-documentacao-base/`**: Contém este documento e instruções de manutenção.
2. **`1-frontend-gamificado/`**: É o "Palco" (Interface Visual). Um projeto React (Vite) responsável por ler os dados do cérebro e renderizar o portfólio em formato interativo/gamificado para o usuário final.
3. **`2-agente-hermes/`**: É o "Motor / Orquestrador". Um agente que roda em segundo plano consumindo a API do GitHub, extraindo repositórios da conta `devini9` e convertendo tudo em anotações e um arquivo `cerebro.json`.
4. **`3-banco-de-dados/`**: Contêineres Docker (PostgreSQL e pgAdmin) configurados para salvar o progresso dos visitantes e dados analíticos.
5. **`4-obsidian-vault/`**: É o "Cérebro" e painel de controle administrativo. Contém as configurações do jogo, níveis, e a base de conhecimento `Superpowers` contendo as diretrizes metodológicas dos agentes.

## ⚙️ O que foi instalado na Máquina Local

Para que esse ambiente opere perfeitamente na máquina base (Bazzite/Fedora), os seguintes softwares estão configurados:
- **Node.js e NVM**: Instalados para gerenciar pacotes locais e rodar o Agente Hermes / Frontend.
- **Docker Compose**: Utilizado para gerenciar instâncias de banco de dados nativas sem sujar o sistema.
- **GitHub CLI (gh)**: Gerenciamento automatizado de repositórios diretamente pelo terminal.
- **Obsidian**: Interface local (Vault) usada como Painel de Controle das Regras do Agente.

## 🚀 Como Executar

### 1. Iniciar o Banco de Dados (Docker)
```bash
cd 3-banco-de-dados
docker-compose up -d
```

### 2. Rodar o Agente Hermes
O Agente Hermes observa o GitHub a cada 1 hora e constrói o `cerebro.json` automaticamente.
```bash
cd 2-agente-hermes
npm install
npm start
```

### 3. Rodar o Jogo (Frontend Gamificado)
```bash
cd 1-frontend-gamificado
npm install
npm run dev
```

---

*Este repositório foi construído pela inteligência artificial Antigravity. Todos os agentes têm instruções para consultar o diretório `4-obsidian-vault/Arquivo/Superpowers/skills` em caso de dúvidas metodológicas.*
