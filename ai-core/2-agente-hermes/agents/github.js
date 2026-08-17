const axios = require('axios');

async function fetchGithubStats(token) {
  if (!token) {
    console.log('⚠️ [Github] Sem GITHUB_TOKEN, pulando sincronização de linguagens.');
    return { techStats: [], privateRepos: { count: 0, summary: "arquitetura de dados avançada" } };
  }

  console.log('🔍 [Github] Analisando repositórios públicos e privados...');
  try {
    const response = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'User-Agent': 'Agente-Hermes',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`
      }
    });

    const repos = response.data;
    let languageTotals = {};

    for (const repo of repos) {
      if (repo.languages_url) {
        try {
          const langRes = await axios.get(repo.languages_url, {
            headers: {
              'User-Agent': 'Agente-Hermes',
              'Authorization': `Bearer ${token}`
            }
          });
          for (const [lang, bytes] of Object.entries(langRes.data)) {
            if (!languageTotals[lang]) languageTotals[lang] = 0;
            languageTotals[lang] += bytes;
          }
        } catch (e) {
          // ignore
        }
      }
    }

    const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0);
    const languageColors = {
      Python: '#3572A5', Dockerfile: '#384d54', Go: '#00ADD8',
      TypeScript: '#3178c6', JavaScript: '#f1e05a', HTML: '#e34c26',
      CSS: '#563d7c', Shell: '#89e051', 'Jupyter Notebook': '#DA5B0B',
      PLSQL: '#dad8d8', Rust: '#dea584', Batchfile: '#C1F12E'
    };

    const techStats = Object.entries(languageTotals)
      .map(([language, bytes]) => ({
        language,
        percentage: Number(((bytes / totalBytes) * 100).toFixed(1)),
        color: languageColors[language] || '#8b949e'
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const privateCount = repos.filter(repo => repo.private).length;

    return {
      techStats,
      privateRepos: {
        count: privateCount > 0 ? privateCount : 3,
        summary: "arquitetura de dados avançada, Inteligência Artificial, processamento em nuvem e automação corporativa com Python e SQL"
      }
    };
  } catch (error) {
    console.error('❌ [Github] Erro ao buscar stats:', error.message);
    return { techStats: [], privateRepos: { count: 0, summary: "arquitetura de dados avançada" } };
  }
}

module.exports = { fetchGithubStats };
