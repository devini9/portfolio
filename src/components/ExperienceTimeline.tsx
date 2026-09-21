import './ExperienceTimeline.css';

interface LinkedInExperience {
  company: string;
  role: string;
  location?: string;
  start: string;
  end: string;
  description?: string;
}

interface FallbackExperience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

interface ExperienceTimelineProps {
  linkedinExperiences?: LinkedInExperience[];
}

const FALLBACK_EXPERIENCES: FallbackExperience[] = [
  {
    company: "Vento International Logistics",
    role: "Consultor SAP BI",
    period: "Setembro de 2026 – Presente",
    description: [
      "Modelagem e construção de dashboards analíticos no Power BI para suporte a decisões estratégicas e financeiras da diretoria executiva, gerando inteligência de negócios em tempo real."
    ]
  },
  {
    company: "Vento International Logistics",
    role: "Consultor de Banco de Dados e Automação de Processos",
    period: "Março de 2026 – Presente",
    description: [
      "Liderança na modernização da infraestrutura de banco de dados e na automatização inteligente de workflows corporativos, reduzindo falhas sistêmicas.",
      "Modelagem e construção de dashboards analíticos no Power BI para suporte a decisões estratégicas e financeiras da diretoria executiva.",
      "Projetou e implantou agentes de IA baseados em modelos de linguagem (LLMs) para a automação de tarefas operacionais repetitivas."
    ]
  },
  {
    company: "DEVINI Serviços de Tecnologia Ltda",
    role: "Fundador & Consultor de Dados e IA",
    period: "Novembro de 2025 – Presente",
    description: [
      "Consultoria especializada em modelagem e arquitetura de bancos de dados (Oracle, SQL Server, PostgreSQL) de alta performance.",
      "Projeto, desenvolvimento e deploy de agentes autônomos de IA personalizados para simplificação de processos de TI e infraestrutura corporativa.",
      "Gerenciamento de conteinerização e orquestração de ambientes com Docker e Portainer, e assessoria em nuvens públicas (AWS, Azure, GCP)."
    ]
  },
  {
    company: "ELIS",
    role: "Support T.I",
    period: "Agosto de 2024 – Outubro de 2025",
    description: [
      "Monitoramento contínuo de filas no Azure Service Bus e pipelines de processamento corporativo, garantindo a estabilidade sistêmica.",
      "Resolução de incidentes críticos de banco de dados (Nível 2) via TopDesk, desenvolvendo scripts Python e consultas SQL customizadas.",
      "Configuração de alertas inteligentes e painéis de monitoramento no Grafana e Power BI para integridade de microsserviços e Docker."
    ]
  },
  {
    company: "Freelance, TudoBônus, LNG Automotive Parts, Passarela, Dafiti",
    role: "Editor de Vídeo & Assistente de Marketing",
    period: "Maio de 2013 – Agosto de 2024",
    description: [
      "Produção e edição de vídeos, fotografias, campanhas e mídias sociais atuando como autônomo e para grandes marcas do varejo."
    ]
  },
  {
    company: "Saraiva, DECO, Outback, Sá Metais, Foxconn, Exército Brasileiro",
    role: "Outras Experiências Diversificadas",
    period: "Março de 2007 – Junho de 2024",
    description: [
      "Experiências diversificadas em Vendas, Atendimento ao Cliente, Logística, Testes de Equipamentos (QA) e vivência militar como Praça do Exército Brasileiro."
    ]
  }
];

export function ExperienceTimeline({ linkedinExperiences }: ExperienceTimelineProps) {
  const hasLinkedIn = linkedinExperiences && linkedinExperiences.length > 0;

  const experiences = hasLinkedIn
    ? linkedinExperiences!.map((exp) => ({
        company: exp.company,
        role: exp.role,
        period: exp.end === "Presente"
          ? `${exp.start} – Presente`
          : `${exp.start} – ${exp.end}`,
        description: exp.description
          ? exp.description.split("\n").filter(Boolean)
          : [],
      }))
    : FALLBACK_EXPERIENCES;

  return (
    <section id="experience" className="section experience-section">
      <div className="section-header">
        <h2 className="section-title">Trajetória Profissional</h2>
        {hasLinkedIn && (
          <span className="data-source-badge">Dados atualizados via LinkedIn</span>
        )}
      </div>
      {hasLinkedIn && (
        <div className="section-lead">
          "Experiências profissionais sincronizadas automaticamente com seu perfil LinkedIn."
        </div>
      )}

      <div className="timeline-container">
        {experiences.map((exp, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h3 className="timeline-role">{exp.role}</h3>
                <span className="timeline-period">{exp.period}</span>
              </div>
              <h4 className="timeline-company">{exp.company}</h4>
              {exp.description.length > 0 && (
                <ul className="timeline-description">
                  {exp.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
