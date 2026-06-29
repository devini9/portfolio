type Department = 'cybersec' | 'web' | 'data' | 'editorial' | 'dev' | 'rh';

const dialogParts: Record<Department, { prefixes: string[], actions: string[], targets: string[], status: string[] }> = {
  cybersec: {
    prefixes: ['Atenção:', 'Log de rotina:', 'Alerta:', 'Reporte:'],
    actions: ['analisando', 'bloqueando', 'verificando', 'auditando', 'monitorando', 'rastreando', 'limpando'],
    targets: ['os IPs suspeitos', 'a porta 443', 'o tráfego de rede', 'as permissões do sistema', 'os tokens JWT', 'tentativas de injeção', 'o firewall'],
    status: ['tudo seguro.', 'nenhuma brecha encontrada.', 'acesso bloqueado com sucesso.', 'padrão normal.', 'assinatura confirmada.', 'zero incidentes críticos.', 'já notifiquei o administrador.']
  },
  web: {
    prefixes: ['Frontend report:', 'UI atualizada:', 'Status visual:', 'Deploy de rotina:'],
    actions: ['otimizando', 'renderizando', 'ajustando', 'refatorando', 'testando', 'minificando', 'animando'],
    targets: ['o bundle do Vite', 'o CSS modules', 'o Core Web Vitals', 'a taxa de quadros (60fps)', 'a árvore do DOM', 'os componentes React', 'o estado global'],
    status: ['performance máxima atingida.', 'tempo de LCP reduzido.', 'zero warnings no console.', 'animações fluidas.', 'contraste de cor 100%.', 'acessibilidade aprovada.', 'carregamento super rápido.']
  },
  data: {
    prefixes: ['Sync report:', 'Banco de dados:', 'Pipeline ativo:', 'Extração:'],
    actions: ['indexando', 'sincronizando', 'processando', 'parseando', 'compilando', 'agregando', 'filtrando'],
    targets: ['os arquivos Markdown', 'o JSON principal', 'a base de currículos', 'o fluxo do GitHub Actions', 'os metadados de projetos', 'o cache local', 'o YAML de configurações'],
    status: ['latência de 12ms.', 'arquivos atualizados com sucesso.', 'banco de dados populado.', 'nenhum gargalo de rede.', 'dados prontos para o frontend.', 'backup realizado no storage.', 'query retornou 200 OK.']
  },
  editorial: {
    prefixes: ['SEO status:', 'Conteúdo:', 'Revisão textual:', 'Copywriting:'],
    actions: ['padronizando', 'curando', 'revisando', 'ajustando', 'criando', 'analisando', 'formatando'],
    targets: ['as tags de meta', 'a descrição do projeto', 'os alt-texts das imagens', 'o tom de voz da página', 'as palavras-chave do SEO', 'a tipografia', 'os textos da interface'],
    status: ['leitura excelente.', 'ranqueamento do Google vai subir.', 'textos estão mais persuasivos.', 'semântica impecável.', 'tudo pronto para os leitores de tela.', 'gramática 100% correta.', 'visual muito mais limpo.']
  },
  dev: {
    prefixes: ['Sistema:', 'Commit report:', 'DevOps:', 'Teste automatizado:'],
    actions: ['fazendo deploy de', 'rodando testes E2E em', 'revisando o código de', 'fazendo push em', 'compilando', 'debugando', 'implementando melhorias em'],
    targets: ['o servidor serverless', 'o pipeline de CI/CD', 'os scripts locais', 'o novo branch de features', 'a estrutura do projeto', 'as configurações do Vite', 'a inteligência generativa'],
    status: ['pipeline verde.', 'build concluído em 3 segundos.', 'cobertura de testes em 98%.', 'nenhum vazamento de memória.', 'sistema 100% estável.', 'tudo integrado perfeitamente.', 'código limpo e pronto.']
  },
  rh: {
    prefixes: ['Aviso do RH:', 'Log de interações:', 'Painel de Recrutamento:', 'Tracking:'],
    actions: ['organizando', 'arquivando', 'analisando', 'processando', 'monitorando', 'classificando', 'roteando'],
    targets: ['os dados do ATS', 'as métricas de visitantes', 'o funil de contato', 'o servidor de e-mails', 'os PDFs de currículo', 'as estatísticas do mês', 'os novos contatos'],
    status: ['funil otimizado.', 'tudo documentado na nuvem.', 'dados protegidos.', 'fluxo de caixa operante.', 'nenhum ticket pendente.', 'painel de recrutamento verde.', 'pronto para novas vagas.']
  }
};

export function generateUniqueDialog(dept: Department): string {
  const parts = dialogParts[dept];
  
  // We try up to 50 times to generate a unique string
  for (let i = 0; i < 50; i++) {
    const prefix = parts.prefixes[Math.floor(Math.random() * parts.prefixes.length)];
    const action = parts.actions[Math.floor(Math.random() * parts.actions.length)];
    const target = parts.targets[Math.floor(Math.random() * parts.targets.length)];
    const status = parts.status[Math.floor(Math.random() * parts.status.length)];
    
    const sentence = `${prefix} ${action} ${target}... ${status}`;
    
    // Check localStorage to ensure uniqueness
    const seen = JSON.parse(localStorage.getItem('seen_dialogs') || '[]');
    if (!seen.includes(sentence)) {
      seen.push(sentence);
      // Optional: keep only the last 3650 to prevent infinite growth
      if (seen.length > 3650) seen.shift();
      localStorage.setItem('seen_dialogs', JSON.stringify(seen));
      return sentence;
    }
  }
  
  // Fallback if all possibilities are exhausted (very unlikely given permutations)
  return `Otimizando sistemas internos... Operação padrão concluída.`;
}
