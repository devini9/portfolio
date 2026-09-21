import './CVTemplate.css';
import { FALLBACK_EXPERIENCES } from './ExperienceTimeline';

const skills = [
  "SQL", "PostgreSQL", "SQL Server", "Oracle DB", "Power BI", "Data Science", "Grafana", "Analytics",
  "Python", "Agentes de IA", "Automação IA", "Prompt Engineering", "LLMs", "NLP",
  "Microsoft Azure", "AWS", "Google Cloud Platform (GCP)", "Docker", "Portainer", "Azure Service Bus",
  "Git / GitHub", "Scrum", "Kanban", "QA & Testes de Software", "VS Code"
];

export function CVTemplate() {
  return (
    <div id="cv-template" className="cv-template-container">
      <div className="cv-header-brand">
        <span className="cv-brand-prompt">&gt;_</span>
        <span className="cv-brand-name">Vinícius Mugnes Ferrira Vitorino</span>
        <span className="cv-brand-cursor"></span>
      </div>

      <div className="cv-hero">
        <h2 className="cv-hero-tagline">
          Especialista em IA & Automação | Consultor de Banco de Dados | LLMs | Agentes de IA | Python | SQL
        </h2>
        <div className="cv-hero-contact">
          <span>contato@devini.com.br</span> • <span>linkedin.com/in/vinicius-mugnes</span>
        </div>
        <p className="cv-hero-description">
          Impulsiono o crescimento das empresas por meio de tecnologias de dados e Inteligência Artificial.
          Ajudo a modernizar sua infraestrutura de dados e a automatizar rotinas corporativas, focando em segurança,
          visibilidade em tempo real e eficiência.
        </p>
      </div>

      <div className="cv-section">
        <h2 className="cv-section-title">Habilidades e Tecnologias</h2>
        <div className="cv-skills-list">
          {skills.join("  •  ")}
        </div>
      </div>

      <div className="cv-section">
        <h2 className="cv-section-title">Trajetória Profissional</h2>
        <div className="cv-timeline">
          {FALLBACK_EXPERIENCES.map((exp, index) => (
            <div key={index} className="cv-timeline-item">
              <div className="cv-timeline-dot"></div>
              <div className="cv-timeline-content">
                {exp.roles ? (
                  <>
                    <h3 className="cv-timeline-company-title">{exp.company}</h3>
                    <div className="cv-timeline-roles-container">
                      {exp.roles.map((r, idx) => (
                        <div key={idx} className="cv-timeline-nested-role">
                          <div className="cv-timeline-nested-dot"></div>
                          <div className="cv-timeline-header">
                            <h4 className="cv-timeline-role">{r.title}</h4>
                            <span className="cv-timeline-period">{r.period}</span>
                          </div>
                          <ul className="cv-timeline-description">
                            {r.description.map((desc, i) => <li key={i}>{desc}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cv-timeline-header">
                      <h3 className="cv-timeline-role">{exp.role}</h3>
                      <span className="cv-timeline-period">{exp.period}</span>
                    </div>
                    <h4 className="cv-timeline-company">{exp.company}</h4>
                    {exp.description && exp.description.length > 0 && (
                      <ul className="cv-timeline-description">
                        {exp.description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
