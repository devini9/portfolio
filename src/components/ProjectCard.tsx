import './ProjectCard.css';

interface ProjetoData {
  id: string;
  frontmatter: {
    title?: string;
    tags?: string[];
    [key: string]: any;
  };
  content: string;
}

interface ProjectCardProps {
  project: ProjetoData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const name = project.frontmatter.title || project.id;
  const tags = project.frontmatter.tags || [];
  
  const snippet = project.content
    ? project.content.substring(0, 150).replace(/#/g, '').trim() + '...'
    : 'Sem descrição disponível.';

  return (
    <article className="project-card reveal">
      <div className="project-content">
        <h3 className="project-title">{name}</h3>
        <p className="project-description">{snippet}</p>
        
        <div className="project-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="project-links">
        <a href="#" className="text-link" onClick={(e) => { e.preventDefault(); alert('Em breve: Ver Detalhes'); }}>
          Ver detalhes
        </a>
      </div>
    </article>
  );
}
