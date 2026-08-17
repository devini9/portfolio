import { Octokit } from '@octokit/rest';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';

// Load Environment Variables (used for local testing mostly)
import dotenv from 'dotenv';
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GITHUB_TOKEN) {
  console.error("Erro: GITHUB_TOKEN não fornecido.");
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.error("Erro: GEMINI_API_KEY não fornecido.");
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SUPERPOWERS_PHILOSOPHY = `
Você é um Engenheiro de Prompts especialista focado em desenhar System Prompts para Agentes Autônomos.
Sua missão é criar o "prompt perfeito" para um assistente de IA que atuará em um repositório de código específico.
O prompt deve seguir a filosofia de "superpowers" (poderes e restrições claras, identidade definida e foco em eficiência e completude).
O output DEVE ser APENAS o conteúdo do prompt (em Markdown), sem introduções.
`;

async function getRepoReadme(owner, repo) {
  try {
    const response = await octokit.rest.repos.getReadme({
      owner,
      repo,
      mediaType: {
        format: 'raw',
      },
    });
    return response.data;
  } catch (error) {
    if (error.status === 404) return null;
    console.warn(`Aviso: Não foi possível baixar o README de ${repo}: ${error.message}`);
    return null;
  }
}

async function generateSystemPrompt(repo) {
  console.log(`Gerando prompt para o repositório: ${repo.name}...`);
  
  const readmeContent = await getRepoReadme(repo.owner.login, repo.name);
  
  const promptContext = `
Aja como o 'Agent Assis', um mestre em escrever System Prompts.
Crie um System Prompt detalhado (em português brasileiro) para um agente de IA que vai ajudar o desenvolvedor a trabalhar no seguinte projeto:

Nome do Projeto: ${repo.name}
Linguagem Principal: ${repo.language || 'Não especificada'}
Descrição: ${repo.description || 'Nenhuma descrição fornecida'}
Visibilidade: ${repo.private ? 'Privado' : 'Público'}

Conteúdo do README:
${readmeContent ? readmeContent.substring(0, 5000) : 'README não disponível.'}

O System Prompt gerado deve:
1. Ter uma <identity> definida e forte.
2. Instruir o agente sobre as tecnologias específicas usadas (baseado na linguagem e README).
3. Definir regras estritas de segurança e boas práticas.
4. Ter um tom proativo e profissional.
Retorne APENAS o texto do prompt, pronto para ser copiado e colado na instrução do sistema de um LLM.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
      { text: SUPERPOWERS_PHILOSOPHY },
      { text: promptContext }
    ]);
    return result.response.text();
  } catch (error) {
    console.error(`Erro ao gerar prompt para ${repo.name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("Iniciando varredura de repositórios do Agent Assis...");
  
  try {
    // List all repositories accessible by the token (owned by the authenticated user)
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      visibility: 'all',
      sort: 'updated',
      per_page: 50 // Limit to 50 most recently updated for API limits during tests
    });
    
    console.log(`Encontrados ${repos.length} repositórios recentes.`);
    
    const baseDir = path.join(process.cwd(), 'context-prompts');
    await fs.mkdir(baseDir, { recursive: true });
    
    for (const repo of repos) {
      // Ignore very old or archived repos if needed, but for now process them
      const repoDir = path.join(baseDir, repo.name);
      await fs.mkdir(repoDir, { recursive: true });
      
      const promptText = await generateSystemPrompt(repo);
      
      if (promptText) {
        const filePath = path.join(repoDir, 'prompt.md');
        await fs.writeFile(filePath, promptText, 'utf-8');
        console.log(`✅ Prompt salvo com sucesso em: ${filePath}`);
      } else {
        console.log(`❌ Falha ao gerar prompt para: ${repo.name}`);
      }
      
      // Pausa de 6 segundos para NUNCA estourar o limite da API gratuita do Gemini (15 RPM)
      await new Promise(r => setTimeout(r, 6000));
    }
    
    console.log("Varredura concluída! Todos os prompts foram atualizados.");
  } catch (error) {
    console.error("Erro fatal na execução do Agent Assis:", error);
    process.exit(1);
  }
}

main();
