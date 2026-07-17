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
    role: "Consultor de Banco de Dados e Automação de Processos",
    period: "Março de 2026 – Presente",
    description: [
      "Modernização da infraestrutura de banco de dados e automatização inteligente de workflows corporativos.",
      "Modelagem e construção de dashboards analíticos no Power BI para suporte a decisões estratégicas.",
      "Projeção e implantação de agentes de IA baseados em LLMs para automação de tarefas."
    ]
  },
  {
    company: "DEVINI Serviços de Tecnologia Ltda",
    role: "Fundador & Consultor de Dados e IA",
    period: "Novembro de 2025 – Presente",
    description: [
      "Consultoria especializada em modelagem e arquitetura de bancos de dados de alta performance.",
      "Desenvolvimento e deploy de agentes autônomos de IA personalizados para simplificação de processos.",
      "Orquestração de ambientes com Docker/Portainer e assessoramento em nuvens (AWS, Azure, GCP)."
    ]
  },
  {
    company: "ELIS",
    role: "Analista de Suporte de TI / Azure Monitor",
    period: "Agosto de 2024 – Outubro de 2025",
    description: [
      "Monitoramento contínuo de filas no Azure Service Bus e pipelines corporativos.",
      "Resolução de incidentes críticos de banco de dados, desenvolvendo scripts Python e consultas SQL.",
      "Configuração de alertas inteligentes e painéis de monitoramento no Grafana e Power BI."
    ]
  },
  {
    company: "TudoBônus, Passarela, Dafiti",
    role: "Editor de Vídeo & Marketing",
    period: "2015 – 2024",
    description: [
      "Produção de vídeo-aulas, campanhas e mídias sociais atuando como autônomo e para grandes marcas do varejo."
    ]
  },
  {
    company: "Saraiva, DECO, Sá Metais, Foxconn, Exército Brasileiro",
    role: "Outras Experiências",
    period: "2007 – 2024",
    description: [
      "Experiências diversificadas em Vendas, Logística, Testes de Qualidade (QA) e vivência militar no Exército Brasileiro."
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
      <div className="section-lead">
        {hasLinkedIn
          ? "Experiências profissionais sincronizadas automaticamente com seu perfil LinkedIn."
          : "Um histórico de experiências moldando a base sólida que suporta minhas soluções atuais."}
      </div>

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
