import { useState, useEffect, useRef } from 'react';
import './AgentTerminal.css';
import { generateUniqueDialog } from '../utils/dialogGenerator';

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
  { name: 'Lia Fernandes', dept: 'rh' },
  { name: 'Aura Gouveia', dept: 'rh' } // Recepcionista
];

interface ChatMessage {
  id: number;
  agent: AgentDef;
  text: string;
  time: string;
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

interface AgentTerminalProps {
  lastUpdate?: string;
}

export function AgentTerminal({ lastUpdate }: AgentTerminalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSender = useRef<string>('Aura Gouveia');
  const messageCountRef = useRef<number>(0);

  useEffect(() => {
    const hour = new Date().getHours();
    const isWorkingHours = hour >= 6 && hour < 24; // 06:00 to 23:59

    const aura = AGENTS.find(a => a.name === 'Aura Gouveia')!;

    if (!isWorkingHours) {
      setMessages([{
        id: Date.now(),
        agent: aura,
        text: 'A equipe está descansando agora. Nossos agentes operam das 06:00 até a meia noite. Volte mais tarde!',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })
      }]);
      return;
    }

    let welcomeText = 'Um novo visitante acaba de acessar o portfólio. Equipe, saúdem o visitante e iniciem o protocolo de monitoramento!';
    
    // Check if the portfolio was updated in the last 24 hours
    if (lastUpdate) {
      const updateDate = new Date(lastUpdate);
      const now = new Date();
      const diffHours = (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        welcomeText = 'Um novo visitante acaba de acessar! Atenção equipe: o chefe sincronizou novos repositórios e atualizou o ecossistema recentemente. Iniciem o protocolo de monitoramento atualizado!';
      }
    }

    // Recepcionista dá as boas-vindas
    const welcomeMsg = {
      id: Date.now(),
      agent: aura,
      text: welcomeText,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })
    };
    
    setMessages([welcomeMsg]);
    messageCountRef.current = 1;

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextMessage = () => {
      // Limitar a 10 mensagens automáticas por sessão para não poluir
      if (messageCountRef.current >= 10) return;

      const delay = Math.floor(Math.random() * 8000) + 4000;

      timeoutId = setTimeout(() => {
        let nextAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
        
        if (nextAgent.name === lastSender.current) {
           const others = AGENTS.filter(a => a.name !== lastSender.current);
           nextAgent = others[Math.floor(Math.random() * others.length)];
        }

        // Usar o gerador procedural ao invés da lista fixa
        const text = generateUniqueDialog(nextAgent.dept);
        
        const newMsg = {
          id: Date.now(),
          agent: nextAgent,
          text,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })
        };

        setMessages(prev => {
          const newMsgs = [...prev, newMsg];
          if (newMsgs.length > 25) return newMsgs.slice(newMsgs.length - 25);
          return newMsgs;
        });

        lastSender.current = nextAgent.name;
        messageCountRef.current += 1;
        
        scheduleNextMessage();
      }, delay);
    };

    // Resposta imediata de outro agente após a saudação de Aura
    setTimeout(() => {
      const dev = AGENTS.find(a => a.name === 'José Alcântara')!;
      setMessages(prev => [...prev, {
        id: Date.now(),
        agent: dev,
        text: 'Seja bem-vindo(a)! Sistemas operando com força total.',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })
      }]);
      messageCountRef.current += 1;
      scheduleNextMessage();
    }, 2000);

    // Event Listener para as Ações do Usuário (Download e Contato)
    const handleUserAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      let text = '';
      let agentName = '';

      if (customEvent.detail === 'CV_DOWNLOAD') {
        text = 'Atenção equipe! O visitante acaba de baixar o currículo do Vinícius. Notifiquem o RH para preparar a documentação!';
        agentName = 'Luna Castro'; // Editorial/Notificações
      } else if (customEvent.detail === 'CONTACT_SENT') {
        text = 'Opa! Recebemos um formulário de contato! Verificando os dados inseridos e repassando diretamente para o e-mail do chefe de operações.';
        agentName = 'Otto Müller'; // RH/Contato
      }

      if (text && agentName) {
        const reactingAgent = AGENTS.find(a => a.name === agentName)!;
        setMessages(prev => {
          const newMsgs = [...prev, {
            id: Date.now(),
            agent: reactingAgent,
            text,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })
          }];
          return newMsgs.slice(-25); // Mantém os últimos 25
        });
      }
    };

    window.addEventListener('USER_ACTION', handleUserAction);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('USER_ACTION', handleUserAction);
    };
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
