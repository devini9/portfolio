const { exec } = require('child_process');
const path = require('path');

const REPO_DIR = path.join(__dirname, '../../');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: REPO_DIR }, (error, stdout, stderr) => {
      if (error) {
        console.warn(`[Fetcher] Aviso no comando: ${command}`);
        console.warn(stderr);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

async function syncComNuvem() {
  console.log('📦 [Fetcher] Iniciando protocolo de sincronização externa...');
  
  // Como é apenas Hermes buscando e subindo pra base-devini9,
  // vamos focar no pull/push simples.
  await runCommand('git add .');
  
  const dateStr = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const commitMsg = `[Hermes:Fetcher] Sincronização Automática - ${dateStr}`;
  
  const commited = await runCommand(`git commit -m "${commitMsg}"`);
  
  if (commited) {
    console.log('📦 [Fetcher] Novos dados embalados no commit.');
    const pushed = await runCommand('git push origin main');
    if (pushed) {
      console.log('📦 [Fetcher] Pacote entregue na nuvem com sucesso (GitHub).');
    } else {
      console.log('📦 [Fetcher] Falha ao entregar pacote (Verifique as credenciais).');
    }
  } else {
    console.log('📦 [Fetcher] Não há nada de novo para embalar e enviar.');
  }
}

module.exports = {
  syncComNuvem
};
