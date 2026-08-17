const path = require('path');
const fs = require('fs');
const { fetchGoogleSheets } = require('./agents/compiler');
const { downloadCV } = require('./agents/clara');

const OUTPUT_DIR = path.join(__dirname, '../../public/data');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('\n=========================================');
console.log('🏛️  [Agência Devini9] Sincronização em Nuvem (DataOps API)');
console.log('=========================================\n');

async function runCloudBuild() {
  console.log('👔 [Hermes] Extraindo dados da Nuvem (Google Sheets)...');
  
  try {
    await fetchGoogleSheets(OUTPUT_DIR);
    console.log('✅ [DataOps] Compilação do Banco de Dados concluída!');
    
    console.log('📄 [Clara] Buscando o currículo mais recente no Google Drive...');
    await downloadCV(OUTPUT_DIR);
    console.log('✅ [Clara] Currículo sincronizado com sucesso!');
    
  } catch (err) {
    console.error('❌ [DataOps] Erro durante a compilação:', err);
    process.exit(1);
  }
}

runCloudBuild();
