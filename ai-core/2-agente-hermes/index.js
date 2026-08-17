const path = require('path');
const cron = require('node-cron');

// Importando os especialistas (RH da Agência Hermes)
const { syncComNuvem } = require('./agents/fetcher');
const { buildJSON } = require('./agents/compiler');
const { startWatching } = require('./agents/watcher');

const VAULT_DIR = path.join(__dirname, '../4-obsidian-vault');
const OUTPUT_DIR = path.join(__dirname, '../../public/data');

console.log('\n=========================================');
console.log('🏛️  [CEO] Agência Hermes Iniciando Trabalhos');
console.log('=========================================\n');

// Fluxo principal de dados (Pipeline)
function runDataPipeline() {
  console.log('👔 [CEO] Solicitando compilação de dados da base...');
  buildJSON(VAULT_DIR, OUTPUT_DIR);
}

// Fluxo de Sincronização (Nuvem)
function runCloudSync() {
  console.log('👔 [CEO] Ordem de envio para a Nuvem recebida.');
  syncComNuvem();
}

// --- ROTINA DE BOOT ---
async function boot() {
  // 1. O CEO manda sincronizar a nuvem para puxar novidades, e então processar o cofre local.
  await syncComNuvem();
  runDataPipeline();

  // 2. O CEO manda o Watcher vigiar os arquivos locais
  startWatching(VAULT_DIR, () => {
    // Quando o Watcher vê algo, o CEO delega para o Compiler
    console.log('👔 [CEO] Watcher relatou alteração. Recompilando Base...');
    runDataPipeline();
  });

  // 3. O CEO agenda a Sincronização automática para rodar de hora em hora
  cron.schedule('0 * * * *', () => {
    console.log('\n⏰ [Cron/CEO] Sincronização horária acionada.');
    runCloudSync();
  });
}

boot();
