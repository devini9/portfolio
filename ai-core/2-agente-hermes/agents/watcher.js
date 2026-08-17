const chokidar = require('chokidar');

function startWatching(vaultDir, onChangeCallback) {
  console.log('👁️  [Watcher] Sentinela de olhos abertos para o Obsidian...');
  
  const watcher = chokidar.watch(vaultDir, { 
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  watcher.on('change', (path) => {
    console.log(`\n👁️  [Watcher] Detectei movimento! Arquivo modificado: ${path}`);
    onChangeCallback();
  });

  return watcher;
}

module.exports = {
  startWatching
};
