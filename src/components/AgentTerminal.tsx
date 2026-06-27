import { useState, useEffect, useRef } from 'react';
import './AgentTerminal.css';

type Department = 'cybersec' | 'web' | 'data' | 'editorial' | 'dev' | 'rh';

interface AgentDef {
  name: string;
  dept: Department;
}

const AGENTS: AgentDef[] = [
  { name: 'Josiane Martins', dept: 'cybersec' },
  { name: 'Cipher Costa', dept: 'cybersec' },
  { name: 'Carlos Mendes', dept: 'web' },
  { name: 'Maya Santos', dept: 'web' },
  { name: 'Silas Ferreira', dept: 'web' },
  { name: 'Hermes Silva', dept: 'data' },
  { name: 'Vector Lima', dept: 'data' },
  { name: 'Sofia Almeida', dept: 'editorial' },
  { name: 'Luna Castro', dept: 'editorial' },
  { name: 'Íris Ribeiro', dept: 'editorial' },
  { name: 'José Alcântara', dept: 'dev' },
  { name: 'Alan Pereira', dept: 'dev' },
  { name: 'Ada Gomes', dept: 'dev' },
  { name: 'Bugsy Souza', dept: 'dev' },
  { name: 'Linus Carvalho', dept: 'dev' },
  { name: 'Clara Nogueira', dept: 'rh' },
  { name: 'Otto Müller', dept: 'rh' },
  { name: 'Lia Fernandes', dept: 'rh' }
];

const messagesByDept: Record<Department, string[]> = {
  cybersec: [
    'Monitorando tráfego de entrada na porta 443. Tudo limpo.',
    'Regras de firewall atualizadas. Nenhuma anomalia detectada.',
    'Achei uma chave exposta: [REDACTED:AKIA_AWS_KEY]. Já ofusquei nos logs.',
    'Varredura de vulnerabilidades concluída. Zero dependências críticas.',
    'Auditoria de permissões feita. Os acessos ao Vault estão restritos.',
    'Bloqueei 3 tentativas de scraping vindas de IPs suspeitos.',
    'A política de CSP tá redondinha no servidor estático.',
    'Injetando tarja preta nos endpoints de dados sensíveis.'
  ],
  web: [
    'Componentes re-renderizando a 60fps constantes na página principal.',
    'Ajustei o padding da seção de projetos no mobile.',
    'Core Web Vitals voando. O LCP bateu 0.8s.',
    'O bundle do Vite foi reduzido após ativar o lazy-loading nas imagens.',
    'Integração do React com o JSON estático sem gargalos.',
    'Paleta Dark Mode revisada. Contraste nota 100 no Lighthouse.',
    'Adicionei animações mais suaves na transição de rotas.',
    'O DOM tá super limpo, removi divs desnecessárias.'
  ],
  data: [
    'Ping no repositório base. Nenhuma alteração detectada no momento.',
    'Coletando os últimos markdowns do Obsidian.',
    'Compilação do YAML concluída. Exportando as tags.',
    'Parse do arquivo finalizado. Convertendo para cerebro.json...',
    'O GitHub Actions disparou o fluxo de dados em background.',
    'Tô mantendo a escuta ativa para novos commits do Vinícius.',
    'Limpando o cache de dados para a próxima varredura.',
    'Nó de sincronização estável. Latência de 45ms.'
  ],
  editorial: [
    'Revisando a copy da descrição técnica do último projeto.',
    'Metadatas atualizadas com as novas palavras-chave para o Google.',
    'Ajeitei a paleta de cores dos ícones para bater com a thumbnail.',
    'A formatação do markdown tava quebrada, mas já estruturei a tipografia.',
    'O SEO score dessa página subiu pra 98. Lindo!',
    'Padronizando os subtítulos das descrições de arquitetura.',
    'As tags semânticas tão perfeitas pros leitores de tela.',
    'Finalizei a curadoria visual da galeria de repositórios.'
  ],
  dev: [
    'O pipeline do GitHub Pages acabou de rodar liso.',
    'Tô arquitetando uma melhoria de cache pra próxima sprint.',
    'Refatorei aquela função antiga. Código tá bem mais enxuto.',
    'Os testes E2E passaram. Nenhuma quebra de contrato.',
    'Tô subindo as métricas dos workers de CI/CD pro dashboard.',
    'O algoritmo de IA generativa já tá pré-treinado no modelo local.',
    'Corrigi aquele bug de memória que dava quando minimizava a janela.',
    'Deploy em produção autorizado. Sistema está 100% online.'
  ],
  rh: [
    'Verificando logs de acesso na aba de contatos...',
    'O formulário de contato tá com proteção contra spam ativada.',
    'Atualizando a base de dados do currículo ATS.',
    'Recebemos um novo ping de visitante na página inicial.',
    'Gerador de PDF dinâmico está em standby, pronto para emitir o CV.',
    'A rotina de arquivamento guardou os dados na nuvem segura.',
    'Tô classificando as últimas interações do portfólio.',
    'O servidor serverless tá ativo pra lidar com chamadas de recrutadores.'
  ]
};

interface ChatMessage {
  id: number;
  agent: AgentDef;
  text: string;
  time: string;
}

function getRandomMessage(agent: AgentDef, recentMsgs: string[]) {
  const pool = messagesByDept[agent.dept];
  const available = pool.filter(msg => !recentMsgs.includes(msg));
  const finalPool = available.length > 0 ? available : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

function renderTextWithRedaction(text: string) {
  const parts = text.split(/(\[REDACTED:.*?\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('[REDACTED:') && part.endsWith(']')) {
      const hiddenText = part.slice(10, -1);
      return <span key={i} className="redacted" title="[Confidencial]">{hiddenText}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function AgentTerminal() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recentTexts = useRef<string[]>([]);
  const lastSender = useRef<string>('José Alcântara');

  useEffect(() => {
    const startAgent = AGENTS.find(a => a.name === 'José Alcântara')!;
    const initialMsg = {
      id: Date.now(),
      agent: startAgent,
      text: 'Opa equipe! Iniciando os pipelines da Agência. Sistema online e monitorado.',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })
    };
    
    setMessages([initialMsg]);
    recentTexts.current.push(initialMsg.text);

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextMessage = () => {
      // Tempo de 2 a 12 segundos entre mensagens
      const delay = Math.floor(Math.random() * 10000) + 2000;

      timeoutId = setTimeout(() => {
        let nextAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
        
        // Evita repeteco da mesma pessoa
        if (nextAgent.name === lastSender.current) {
           const others = AGENTS.filter(a => a.name !== lastSender.current);
           nextAgent = others[Math.floor(Math.random() * others.length)];
        }

        const text = getRandomMessage(nextAgent, recentTexts.current);
        
        const newMsg = {
          id: Date.now(),
          agent: nextAgent,
          text,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })
        };

        recentTexts.current.push(text);
        if (recentTexts.current.length > 25) {
          recentTexts.current.shift();
        }
        
        setMessages(prev => {
          const newMsgs = [...prev, newMsg];
          if (newMsgs.length > 25) return newMsgs.slice(newMsgs.length - 25);
          return newMsgs;
        });

        lastSender.current = nextAgent.name;
        scheduleNextMessage();
      }, delay);
    };

    scheduleNextMessage();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="agent-chat">
      <div className="chat-header">
        <span className="chat-title">Equipe devini9</span>
        <div className="chat-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div className="chat-body" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message">
            <div className={`chat-avatar avatar-${msg.agent.dept}`}>
              {msg.agent.name.charAt(0)}
            </div>
            <div className="chat-content">
              <div className="chat-meta">
                <span className={`sender-name color-${msg.agent.dept}`}>{msg.agent.name}</span>
                <span className="msg-time">{msg.time}</span>
              </div>
              <div className="msg-text">
                {renderTextWithRedaction(msg.text)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
