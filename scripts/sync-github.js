import fs from 'fs';
import path from 'path';

const OUTPUT_PATH = path.resolve('./public/data/cerebro.json');
const EXCLUDE_REPOS = ['portfolio', 'base-devini9'];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function syncGithub() {
  console.log(`📡 Sincronizando repositórios usando token de autenticação...`);
  
  if (!GITHUB_TOKEN) {
    console.error("❌ Erro: Variável de ambiente GITHUB_TOKEN não encontrada.");
    return;
  }

  const headers = {
    'User-Agent': 'Antigravity-Sync-Script',
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `Bearer ${GITHUB_TOKEN}`
  };

  try {
    const response = await fetch(`https://api.github.com/user/repos?sort=updated&per_page=100`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`Erro na API do GitHub: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    
    let languageTotals = {};
    
    // Fetch languages for all repos (public and private)
    console.log(`🔍 Coletando estatísticas de linguagens para ${repos.length} repositórios...`);
    for (const repo of repos) {
      const langResponse = await fetch(repo.languages_url, { headers });
      if (langResponse.ok) {
        const langs = await langResponse.json();
        for (const [lang, bytes] of Object.entries(langs)) {
          if (!languageTotals[lang]) languageTotals[lang] = 0;
          languageTotals[lang] += bytes;
        }
      }
    }

    // Calcular porcentagens das linguagens
    const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0);
    
    // Colors similar to GitHub
    const languageColors = {
      Python: '#3572A5',
      Dockerfile: '#384d54',
      Go: '#00ADD8',
      TypeScript: '#3178c6',
      JavaScript: '#f1e05a',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Shell: '#89e051',
      'Jupyter Notebook': '#DA5B0B',
      PLSQL: '#dad8d8',
      Rust: '#dea584',
      Batchfile: '#C1F12E'
    };
    
    const techStats = Object.entries(languageTotals)
      .map(([language, bytes]) => ({
        language,
        percentage: Number(((bytes / totalBytes) * 100).toFixed(1)),
        color: languageColors[language] || '#8b949e' // default gray for unknown
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Filtrar repositórios que vão para os cards (apenas públicos e não ignorados)
    const publicRepos = repos.filter((repo) => !repo.private && !EXCLUDE_REPOS.includes(repo.name));
    
    console.log(`📦 Encontrados ${publicRepos.length} repositórios públicos válidos para exibição.`);

    const projetos = publicRepos.map((repo) => {
      const tags = [repo.language].filter(Boolean);
      return {
        id: repo.name,
        frontmatter: {
          title: repo.name,
          tags: tags,
          url: repo.html_url
        },
        content: repo.description || "Nenhuma descrição fornecida."
      };
    });
    
    // Count private repos
    const privateCount = repos.filter((repo) => repo.private).length;

    let cerebroData = {};
    if (fs.existsSync(OUTPUT_PATH)) {
      cerebroData = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
    }

    cerebroData.metadata = {
      ...cerebroData.metadata,
      lastUpdate: new Date().toISOString(),
      source: "GitHub API Sync"
    };
    
    cerebroData.projetos = projetos;
    cerebroData.techStats = techStats;
    
    cerebroData.privateRepos = {
      count: privateCount > 0 ? privateCount : 3, // fallback if zero
      summary: "arquitetura de dados avançada, Inteligência Artificial, processamento em nuvem e automação corporativa com Python e SQL"
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(cerebroData, null, 2));
    console.log(`✅ Sincronização concluída! Arquivo ${OUTPUT_PATH} atualizado com sucesso.`);

  } catch (error) {
    console.error("❌ Falha ao sincronizar com o GitHub:", error);
  }
}

syncGithub();
