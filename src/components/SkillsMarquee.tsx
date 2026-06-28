import './SkillsMarquee.css';

export function SkillsMarquee() {
  const skills = [
    "React", "TypeScript", "Vite", "Node.js", "Firebase", "Google Cloud", 
    "Git", "DataOps", "CI/CD", "Next.js", "TailwindCSS", "Python"
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
