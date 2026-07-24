import { useEffect, useState, lazy, Suspense } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SectionHeader } from './components/SectionHeader';
import { ProjectCard } from './components/ProjectCard';

// Lazy loading para componentes não críticos
const Contact = lazy(() => import('./components/Contact').then(mod => ({ default: mod.Contact })));
const ExperienceTimeline = lazy(() => import('./components/ExperienceTimeline').then(mod => ({ default: mod.ExperienceTimeline })));

function App() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);

    // Detecta base path automaticamente (GitHub Pages = /portfolio/)
    const base = import.meta.env.BASE_URL || '/';
    const jsonUrl = `${base}data/cerebro.json`;

    fetch(jsonUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar dados:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="main-container">
          <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <span className="brand-cursor"></span> Carregando dados do portfólio...
          </div>
        </main>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <main className="main-container">
          <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
            ⚠️ Erro ao carregar dados. Tente recarregar a página.
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-container">
        <Hero stats={data?.techStats} />

        <Suspense fallback={<div className="loading"><span className="brand-cursor"></span> Carregando experiências...</div>}>
          <ExperienceTimeline linkedinExperiences={data?.linkedin?.experiences} />
        </Suspense>

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
          
          {data?.privateRepos && (
            <div className="private-repos-note" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--text-bright)' }}>🔒 Arquivos Confidenciais:</strong> Além dos projetos acima, a agência mantém mais de <strong>{data.privateRepos.count} repositórios privados</strong>. 
                Estes projetos envolvem {data.privateRepos.summary} operando sob acordos estritos de confidencialidade.
              </p>
            </div>
          )}
        </section>

        <Suspense fallback={<div className="loading"><span className="brand-cursor"></span> Carregando contato...</div>}>
          <Contact />
        </Suspense>

      </main>

      <footer className="site-footer">
        <span>© 2026 devini9. Sistemas operando normalmente.</span>
      </footer>
    </>
  );
}

export default App;
