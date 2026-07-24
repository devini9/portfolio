import './ProjectCard.css';

interface ProjetoData {
  id: string;
  frontmatter: {
    title?: string;
    tags?: string[];
    repo_url?: string;
    demo_url?: string;
    private?: boolean;
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
  const repoUrl = project.frontmatter.repo_url || `https://github.com/devini9/${project.id}`;
  const demoUrl = project.frontmatter.demo_url;
  const isPrivate = project.frontmatter.private || false;

  const snippet = project.content
    ? project.content.substring(0, 150).replace(/#/g, '').trim() + '...'
    : 'Sem descrição disponível.';

  return (
    <article className={`project-card reveal ${isPrivate ? 'project-card-private' : ''}`}>
      <div className={`project-content ${isPrivate ? 'project-content-blur' : ''}`}>
        <h3 className="project-title">{name}</h3>
        <p className="project-description">{snippet}</p>
        
        <div className="project-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      {isPrivate && (
        <div className="project-private-overlay">
          <span className="private-badge">🔒 PROJETO CONFIDENCIAL</span>
        </div>
      )}
      
      <div className="project-links">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Ver no GitHub →
        </a>
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
            style={{ marginLeft: '1rem' }}
          >
            Demo →
          </a>
        )}
      </div>
    </article>
  );
}
