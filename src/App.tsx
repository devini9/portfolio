import { useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SectionHeader } from './components/SectionHeader';
import { ProjectCard } from './components/ProjectCard';
import { Contact } from './components/Contact';
import { ExperienceTimeline } from './components/ExperienceTimeline';

// @ts-ignore
import cerebroData from '../public/data/cerebro.json';

function App() {
  const data = cerebroData as any;

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main className="main-container">
        <Hero stats={data?.techStats} />
        <ExperienceTimeline />

        <section id="projects" className="section">
          <SectionHeader title="Projetos em Destaque" />
          <div className="section-lead">
            Repositórios e arquiteturas extraídas da base de operações.
          </div>
          
          <div className="project-grid">
            {data?.projetos && data.projetos.length > 0 ? (
              data.projetos.map((proj: any) => (
                <ProjectCard key={proj.id} project={proj} />
              ))
            ) : (
              <p className="loading"><span className="brand-cursor"></span> Nenhum repositório público configurado para exibição no momento.</p>
            )}
          </div>
          
          {/* Private Repos Note will go here */}
          {data?.privateRepos && (
            <div className="private-repos-note" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--text-bright)' }}>🔒 Arquivos Confidenciais:</strong> Além dos projetos acima, a agência mantém mais de <strong>{data.privateRepos.count} repositórios privados</strong>. 
                Estes projetos envolvem {data.privateRepos.summary} operando sob acordos estritos de confidencialidade.
              </p>
            </div>
          )}
        </section>

        <Contact />

      </main>

      <footer className="site-footer">
        <span>© 2026 devini9. Sistemas operando normalmente.</span>
      </footer>
    </>
  );
}

export default App;
