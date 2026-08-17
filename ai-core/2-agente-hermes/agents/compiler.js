const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { fetchGithubStats } = require('./github');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const SPREADSHEET_ID = '1nfIyy81sG7rhNoxu7wcYmb3z6HVY4E_kyw5aEpCARgU';

async function fetchGoogleSheets(outputDir) {
  const sheets = google.sheets({ version: 'v4', auth });
  
  // Fetch Projetos
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Projetos!A2:E',
  });

  const rows = response.data.values || [];
  
  const projetos = rows.map(row => ({
    id: row[0] || '',
    titulo: row[1] || '',
    categoria: row[2] || '',
    link: row[3] || '',
    descricao: row[4] || ''
  })).filter(p => p.id !== '');

  // Fetch Regras (Arquitetura)
  let regras = [];
  try {
    const regrasResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Regras!A2:B',
    });
    const regrasRows = regrasResponse.data.values || [];
    regras = regrasRows.map(row => ({
      regra: row[0] || '',
      descricao: row[1] || ''
    })).filter(r => r.regra !== '');
  } catch (err) {
    console.log('⚠️ [Compiler] Aba Regras não encontrada ou vazia, usando padrão vazio.');
  }

  // Fetch Github Stats
  const githubToken = process.env.GITHUB_TOKEN;
  const { techStats, privateRepos } = await fetchGithubStats(githubToken);

  const cerebro = {
    metadata: {
      lastUpdate: new Date().toISOString(),
      source: 'Google Sheets (DataOps) & GitHub API'
    },
    projetos,
    regras,
    artigos: [],
    techStats,
    privateRepos
  };

  const outFile = path.join(outputDir, 'cerebro.json');
  fs.writeFileSync(outFile, JSON.stringify(cerebro, null, 2));
  console.log(`🏗️  [Compiler] Montagem concluída! cerebro.json gerado via nuvem.`);
}

module.exports = { fetchGoogleSheets };
