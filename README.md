# Portfólio devini9

Portfólio pessoal de **Vinícius Mugnes Ferrira Vitorino** — Cientista de Dados & Especialista em IA.

## Sobre

Site institucional que apresenta minha trajetória profissional, projetos, stack de tecnologias e canal de contato direto. Os dados são atualizados automaticamente via GitHub API e LinkedIn.

## Funcionalidades

- **Tema claro/escuro** com detecção automática de preferência do sistema
- **Timeline de experiência profissional** com animações suaves
- **Gráfico de linguagens** baseado nos repositórios do GitHub
- **Marquee de skills** com scroll infinito
- **Formulário de contato** integrado ao FormSubmit
- **Download de currículo** em PDF
- **Layout responsivo** para desktop e mobile

## Automação

O portfólio se atualiza sozinho através de scripts Python e GitHub Actions:

### GitHub (automático)
- **Script:** `scripts/sync-github.py`
- **Frequência:** Todo dia às 06:00 UTC (via GitHub Action)
- **Dados:** Repositórios, linguagens, stars, stats do perfil

### LinkedIn (manual)
- **Script:** `scripts/sync-linkedin.py`
- **Frequência:** Manual (quando você baixa seus dados)
- **Dados:** Experiências, educação, habilidades, certificações

#### Como sincronizar o LinkedIn:
1. Acesse [linkedin.com/mypreferences/d/download-my-data](https://www.linkedin.com/mypreferences/d/download-my-data)
2. Selecione todos os dados → baixe o ZIP
3. Rode localmente:
   ```bash
   python scripts/sync-linkedin.py caminho/para/linkedin.zip
   ```
4. Ou faça upload do ZIP na pasta `data/` e rode o workflow manual no GitHub Actions

## Stack

- React 19 + TypeScript
- Vite 8
- CSS puro (sem frameworks)
- Python (scripts de automação)
- GitHub Actions (CI/CD + sync)
- GitHub Pages (deploy)

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Deploy no GitHub Pages
npm run deploy

# Sincronizar dados do GitHub (precisa de GITHUB_TOKEN)
python scripts/sync-github.py

# Sincronizar dados do LinkedIn
python scripts/sync-linkedin.py data/linkedin.zip
```

## Estrutura

```
portfolio/
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Navegação fixa com toggle de tema
│   │   ├── Hero.tsx              # Apresentação e gráfico de linguagens
│   │   ├── ExperienceTimeline.tsx # Linha do tempo (usa dados do LinkedIn)
│   │   ├── Contact.tsx           # Formulário de contato
│   │   ├── LanguageChart.tsx     # Gráfico de barras de linguagens
│   │   ├── ProjectCard.tsx       # Card de projeto
│   │   ├── SectionHeader.tsx     # Título de seção com linha decorativa
│   │   └── SkillsMarquee.tsx     # Marquee de habilidades
│   ├── App.tsx
│   ├── index.css                 # Variáveis CSS e estilos globais
│   └── main.tsx
├── scripts/
│   ├── sync-github.py            # Sincroniza dados do GitHub
│   └── sync-linkedin.py          # Parseia data export do LinkedIn
├── public/data/
│   └── cerebro.json              # Dados do portfólio (gerado pelos scripts)
├── .github/workflows/
│   ├── deploy.yml                # Deploy automático no push
│   ├── sync.yml                  # Sync diário do GitHub
│   └── sync-linkedin.yml         # Sync manual do LinkedIn
└── package.json
```

## Contato

- **Email:** viniciusfv.9@gmail.com
- **GitHub:** [github.com/devini9](https://github.com/devini9)
