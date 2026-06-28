import './SkillsMarquee.css';

export function SkillsMarquee() {
  const skills = [
    "SQL", "PostgreSQL", "SQL Server", "Oracle DB", "Power BI", "Data Science", "Grafana",
    "Python", "Agentes de IA", "Automação IA", "Prompt Engineering", "LLMs",
    "Azure", "AWS", "Google Cloud", "Docker", "Portainer", "Azure Service Bus",
    "Git / GitHub", "Scrum", "Kanban", "QA & Testes", "VS Code"
  ];

  // Duplicamos a lista para o scroll infinito funcionar sem saltos
  const marqueeItems = [...skills, ...skills];

  return (
    <div className="skills-marquee-container">
      <div className="marquee-fade-left"></div>
      <div className="marquee-fade-right"></div>
      
      <div className="skills-marquee">
        <div className="marquee-track">
          {marqueeItems.map((skill, index) => (
            <div key={index} className="skill-badge">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
