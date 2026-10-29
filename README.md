# Portfolio & Currículo Online — devini9

Site e currículo online de Vinícius Mugnes Ferreira Vitorino, servido no GitHub Pages.

## Descrição

SPA estático (build Vite pré-compilado) data-driven: todo o conteúdo vive em `data/cerebro.json` (fonte única). O currículo em PDF (`data/curriculo.pdf`) é gerado automaticamente a partir do mesmo JSON (`scripts/generate_cv.py`), e um job diário (`scripts/sync_portfolio.py`) sincroniza os dados do GitHub e regenera o PDF.

Funcionalidades:
- Currículo online em pt-BR (Fundador & Consultor de Dados e IA, DEVINI)
- Botão "Currículo PDF" com download direto
- PDF ATS-friendly (1 página, coluna única, texto real extraível, seções padrão)
- Tema visual "Modern Tech" (override CSS — bundles originais intocados)
- Sync diário de dados do GitHub (stats, linguagens) com push automático de dados
- SEO/ATS: schema.org Person (jobTitle + worksFor), meta description com keywords e `<noscript>` legível por crawlers sem JS

## Tecnologias / Linguagens

- HTML, CSS, JavaScript (SPA Vite pré-compilado)
- Python 3 (reportlab para geração do PDF; pypdf para verificação)
- JSON data-driven (`data/cerebro.json`)
- GitHub Pages

## Como rodar localmente

O site usa caminhos absolutos com prefixo `/portfolio/` — sirva sempre sob esse prefixo:

```bash
git clone https://github.com/devini9/portfolio.git
mkdir site && cp -r portfolio site/portfolio
cd site && python3 -m http.server 8799
# abrir http://localhost:8799/portfolio/
```

## Como testar

```bash
python3 -m json.tool data/cerebro.json    # JSON válido
python3 scripts/generate_cv.py            # regenera data/curriculo.pdf (1 página, ATS)
python3 scripts/sync_portfolio.py --dry-run  # mostra delta do GitHub sem escrever
```

## Agentes usados nesta tarefa (Staff Dinâmico)

- `site-build-mapper` — mapeou o SPA compilado: schema de dados em uso, tokens CSS e pontos de injeção seguros
- `cv-content-auditor` — auditou conteúdo multi-fonte (LinkedIn, GitHub, JSON do site, PDF anterior) e produziu o delta estruturado
- Todo o código foi escrito pelo OpenCode (agente `build`), orquestrado e verificado pelo Staff

## Skills e modelos

- Skills carregadas: staff-dinamico, github, opencode
- Staff: glm-5.2 · Subagentes: glm-5.2 · OpenCode: v2.2.0 (provider OpenCode Go, agente build)
