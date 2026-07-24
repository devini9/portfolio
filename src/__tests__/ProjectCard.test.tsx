import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../components/ProjectCard';

describe('ProjectCard Component', () => {
  const mockProject = {
    id: 'meu-projeto-teste',
    frontmatter: {
      title: 'Projeto de Teste',
      tags: ['Python', 'PostgreSQL', 'Docker'],
      repo_url: 'https://github.com/devini9/meu-projeto-teste',
      demo_url: 'https://demo.projeto.com'
    },
    content: 'Este é um projeto de teste para demonstrar as funcionalidades do componente.'
  };

  it('renderiza o título do projeto corretamente', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Projeto de Teste')).toBeInTheDocument();
  });

  it('renderiza as tags do projeto', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('renderiza o snippet da descrição', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/este é um projeto de teste/i)).toBeInTheDocument();
  });

  it('renderiza link para o GitHub', () => {
    render(<ProjectCard project={mockProject} />);
    const githubLink = screen.getByText('Ver no GitHub →');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/devini9/meu-projeto-teste');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renderiza link para demo quando demo_url está presente', () => {
    render(<ProjectCard project={mockProject} />);
    const demoLink = screen.getByText('Demo →');
    expect(demoLink).toHaveAttribute('href', 'https://demo.projeto.com');
    expect(demoLink).toHaveAttribute('target', '_blank');
  });

  it('usa o ID como título quando title não está presente', () => {
    const projectSemTitle = {
      ...mockProject,
      frontmatter: { tags: ['Python'] }
    };
    render(<ProjectCard project={projectSemTitle} />);
    expect(screen.getByText('meu-projeto-teste')).toBeInTheDocument();
  });

  it('não renderiza link de demo quando demo_url não está presente', () => {
    const projectSemDemo = {
      ...mockProject,
      frontmatter: {
        title: 'Projeto sem Demo',
        tags: ['Python'],
        repo_url: 'https://github.com/devini9/projeto'
      }
    };
    render(<ProjectCard project={projectSemDemo} />);
    expect(screen.queryByText('Demo →')).not.toBeInTheDocument();
  });

  it('mostra mensagem padrão quando não há descrição', () => {
    const projectSemConteudo = {
      ...mockProject,
      content: ''
    };
    render(<ProjectCard project={projectSemConteudo} />);
    expect(screen.getByText('Sem descrição disponível.')).toBeInTheDocument();
  });
});
