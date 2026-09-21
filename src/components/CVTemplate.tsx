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
      <div className="cv-header">
        <h1>Vinícius Mugnes Ferrira Vitorino</h1>
        <h2>Especialista em IA & Automação | Consultor de Banco de Dados | LLMs | Agentes de IA | Python | SQL</h2>
        <div className="cv-contact">
          <p>Email: contato@devini.com.br</p>
          <p>LinkedIn: linkedin.com/in/vinicius-mugnes</p>
        </div>
        <p className="cv-summary">
          Impulsiono o crescimento das empresas por meio de tecnologias de dados e Inteligência Artificial.
          Ajudo a modernizar sua infraestrutura de dados e a automatizar rotinas corporativas, focando em segurança,
          visibilidade em tempo real e eficiência.
        </p>
      </div>

      <div className="cv-section">
        <h3>Habilidades e Tecnologias</h3>
        <div className="cv-skills">
          {skills.join(" • ")}
        </div>
      </div>

      <div className="cv-section">
        <h3>Experiência Profissional</h3>
        <div className="cv-experiences">
          {FALLBACK_EXPERIENCES.map((exp, index) => (
            <div key={index} className="cv-experience-item">
              {exp.roles ? (
                <>
                  <h4 className="cv-company">{exp.company}</h4>
                  {exp.roles.map((r, idx) => (
                    <div key={idx} className="cv-nested-role">
                      <div className="cv-role-header">
                        <span className="cv-role">{r.title}</span>
                        <span className="cv-period">{r.period}</span>
                      </div>
                      <ul>
                        {r.description.map((desc, i) => <li key={i}>{desc}</li>)}
                      </ul>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="cv-role-header">
                    <span className="cv-role">{exp.role}</span>
                    <span className="cv-period">{exp.period}</span>
                  </div>
                  <h4 className="cv-company">{exp.company}</h4>
                  {exp.description && exp.description.length > 0 && (
                    <ul>
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
