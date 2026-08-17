const cron = require('node-cron');
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const repoPath = path.join(__dirname, '..');
const git = simpleGit(repoPath);

const relatoriosDir = path.join(repoPath, '4-obsidian-vault', 'Arquivo', 'Relatorios');

// Garante que a pasta de relatórios existe
if (!fs.existsSync(relatoriosDir)) {
    fs.mkdirSync(relatoriosDir, { recursive: true });
}

console.log("🛡️ Agente Guardião iniciado! Protegendo e sincronizando a base de operações.");

// Função para sincronizar com o GitHub
async function syncRepository() {
    try {
        console.log("🔄 [Agente Guardião] Iniciando sincronização (Backup)...");
        const status = await git.status();
        
        if (status.isClean()) {
            console.log("✅ [Agente Guardião] Nenhuma alteração detectada. Base já está sincronizada.");
            return;
        }

        const dataAtual = new Date().toLocaleString('pt-BR');
        
        await git.add('.');
        await git.commit(`auto: backup sincronizado pelo Agente Guardião em ${dataAtual}`);
        await git.push('origin', 'master');
        
        console.log(`✅ [Agente Guardião] Backup realizado com sucesso às ${dataAtual}!`);
    } catch (error) {
        console.error("❌ [Agente Guardião] Erro ao sincronizar:", error);
    }
}

// Função para gerar o Relatório Semanal
async function generateWeeklyReport() {
    try {
        console.log("📊 [Agente Guardião] Gerando Relatório Semanal de Atividades...");
        
        const dataFim = new Date();
        const dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 7);
        
        // Pega os commits da última semana
        const logs = await git.log({
            '--since': dataInicio.toISOString(),
            '--until': dataFim.toISOString()
        });

        const dataFormatada = dataFim.toISOString().split('T')[0];
        const fileName = `Relatorio_Semana_${dataFormatada}.md`;
        const filePath = path.join(relatoriosDir, fileName);

        let content = `# Relatório Semanal: Base de Operações\n\n`;
        content += `**Período:** ${dataInicio.toLocaleDateString('pt-BR')} até ${dataFim.toLocaleDateString('pt-BR')}\n\n`;
        content += `## Resumo de Atividades\n\n`;
        
        if (logs.total === 0) {
            content += `Nenhuma alteração registrada nesta semana.\n`;
        } else {
            content += `Total de Commits na semana: ${logs.total}\n\n`;
            content += `### Histórico de Commits\n\n`;
            logs.all.forEach(log => {
                content += `- **${log.date.substring(0,10)}**: ${log.message} (${log.author_name})\n`;
            });
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`📝 [Agente Guardião] Relatório gerado: ${fileName}`);
        
        // Força um sync logo após gerar o relatório
        await syncRepository();

    } catch (error) {
        console.error("❌ [Agente Guardião] Erro ao gerar relatório:", error);
    }
}

// Tarefa 1: Sincronização a cada 1 hora
cron.schedule('0 * * * *', () => {
    syncRepository();
});

// Tarefa 2: Relatório Semanal (Toda Sexta-feira às 18:00)
cron.schedule('0 18 * * 5', () => {
    generateWeeklyReport();
});

// Se quiser forçar a execução agora mesmo ao iniciar o script, descomente as linhas abaixo:
// syncRepository();
// generateWeeklyReport();
