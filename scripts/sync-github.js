import fs from 'fs';
import path from 'path';

const USERNAME = 'devini9';
const OUTPUT_PATH = path.resolve('./public/data/cerebro.json');
const EXCLUDE_REPOS = ['portfolio', 'base-devini9'];

async function syncGithub() {
  console.log(`📡 Sincronizando repositórios públicos do usuário: ${USERNAME}...`);
  
  try {
    const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`, {
      headers: {
        'User-Agent': 'Antigravity-Sync-Script',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na API do GitHub: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    
    // Filtrar repositórios indesejados
    const publicRepos = repos.filter((repo) => !EXCLUDE_REPOS.includes(repo.name));
    
    console.log(`📦 Encontrados ${publicRepos.length} repositórios válidos para exibição.`);

    const projetos = publicRepos.map((repo) => {
      // Extrair linguagens principais como tags
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

    // Ler arquivo atual para manter regras e outras configs intactas
    let cerebroData = {};
    if (fs.existsSync(OUTPUT_PATH)) {
      cerebroData = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
    }

    // Atualizar dados
    cerebroData.metadata = {
      ...cerebroData.metadata,
      lastUpdate: new Date().toISOString(),
      source: "GitHub API Sync"
    };
    
    cerebroData.projetos = projetos;
    
    // Injetar informação confidencial (Projetos Privados) baseada na realidade local do usuário
    cerebroData.privateRepos = {
      count: 3, // Pode alterar esse número manualmente depois se quiser
      summary: "arquitetura de dados avançada, Inteligência Artificial, processamento em nuvem e automação corporativa com Python e SQL"
    };

    // Salvar
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(cerebroData, null, 2));
    console.log(`✅ Sincronização concluída! Arquivo ${OUTPUT_PATH} atualizado com sucesso.`);

  } catch (error) {
    console.error("❌ Falha ao sincronizar com o GitHub:", error);
  }
}

syncGithub();
