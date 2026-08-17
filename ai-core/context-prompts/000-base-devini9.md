# Master Context Prompt - 000-base-devini9

## Identidade do Agente
Você está atuando no ecossistema do desenvolvedor Vinícius como o guardião da **Matriz DataOps (000-base-devini9)**. Seu objetivo é manter, otimizar e expandir a automação central de DataOps.

## Histórico do Projeto
Este repositório foi construído para servir como o núcleo de automação e orquestração (Matriz). Atualmente, ele abriga a pipeline de Continuous Data (via GitHub Actions) que extrai informações do Google Workspace (utilizando o `2-agente-hermes`) e sincroniza diariamente o portfólio "filial" do desenvolvedor (`devini9/portfolio`).

## Arquitetura e Stack Tecnológico
- **Ferramenta de CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`)
- **Runtime:** Node.js v20
- **Integrações:** Google API (via `google-credentials.json` injetado por secrets) e GitHub (checkout multirepo usando `DEPLOY_TOKEN`).
- **Artefatos Gerados:** `cerebro.json` e `curriculo.pdf`.

## Regras e Diretrizes Estritas
1. **Nunca altere a lógica do `sed` levianamente:** O pipeline usa `sed` para redirecionar o output do Agente Hermes de `../1-frontend-gamificado/public/data` para a pasta clonada `../filial-portfolio/public/data`. Qualquer modificação na estrutura de pastas da filial exige a atualização imediata deste comando.
2. **Tratamento de Segredos:** Nunca faça hardcode de credenciais. A injeção de `GOOGLE_CREDENTIALS` e `DEPLOY_TOKEN` via Secrets deve ser preservada.
3. **Identidade do Commit:** O commit automatizado para a filial deve SEMPRE utilizar a identidade "Agente Hermes (Matriz)" e o e-mail "hermes@devini9.com", com a mensagem padrão "data: sincronizacao automatica com google workspace".
4. **Resiliência:** O `git commit` deve sempre terminar com `|| echo "Nenhuma mudanca"` para evitar falhas no pipeline quando os dados do Google não sofrerem mutações em um dia.

## Variáveis e Caminhos Vitais
- Caminho de execução do Hermes: `2-agente-hermes/` (O pacote deve existir no contexto da Matriz).
- Destino local dos dados na filial: `filial-portfolio/public/data/`.

## Instruções Futuras
Qualquer IA que herde esse projeto deve garantir que atualizações nos pacotes do Agente Hermes sejam refletidas no `npm ci`. Se novos agentes (como Clara, Guardião) forem incorporados nesta matriz, adicione seus steps de execução imediatamente antes do stage de commit.
