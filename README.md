# Portfólio devini9

Portfólio pessoal de **Vinícius Mugnes Ferrira Vitorino** — Cientista de Dados & Especialista em IA.

## Sobre

Site institucional que apresenta minha trajetória profissional, projetos, stack de tecnologias e canal de contato direto. O ecossistema é mantido e atualizado por agentes de IA que sincronizam dados do GitHub e Google Sheets automaticamente.

## Funcionalidades

- **Tema claro/escuro** com detecção automática de preferência do sistema
- **Timeline de experiência profissional** com animações suaves
- **Gráfico de linguagens** baseado nos repositórios do GitHub
- **Marquee de skills** com scroll infinito
- **Formulário de contato** integrado ao FormSubmit
- **Download de currículo** em PDF
- **Layout responsivo** para desktop e mobile

## Stack

- React 19 + TypeScript
- Vite 8
- CSS puro (sem frameworks)
- GitHub Pages (deploy via `gh-pages`)

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
```

## Estrutura

```
src/
├── components/
│   ├── Header.tsx        # Navegação fixa com toggle de tema
│   ├── Hero.tsx          # Apresentação e gráfico de linguagens
│   ├── ExperienceTimeline.tsx  # Linha do tempo profissional
│   ├── Contact.tsx       # Formulário de contato
│   ├── LanguageChart.tsx # Gráfico de barras de linguagens
│   ├── ProjectCard.tsx   # Card de projeto
│   ├── SectionHeader.tsx # Título de seção com linha decorativa
│   └── SkillsMarquee.tsx # Marquee de habilidades
├── utils/
├── App.tsx
├── index.css             # Variáveis CSS e estilos globais
└── main.tsx
```

## Contato

- **Email:** viniciusfv.9@gmail.com
- **GitHub:** [github.com/devini9](https://github.com/devini9)
