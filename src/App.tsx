import { useEffect, useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SectionHeader } from './components/SectionHeader';
import { ProjectCard } from './components/ProjectCard';
import { AgentTerminal } from './components/AgentTerminal';
import { Contact } from './components/Contact';
import { SkillsMarquee } from './components/SkillsMarquee';
import { LanguageChart } from './components/LanguageChart';

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);

    fetch(`${import.meta.env.BASE_URL}data/cerebro.json`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <>
      <Header />
      <main className="main-container">
        <Hero />
        <SkillsMarquee />
        <AgentTerminal lastUpdate={data?.metadata?.lastUpdate} />
        
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
              <p className="loading"><span className="brand-cursor"></span> Carregando repositórios...</p>
            )}
          </div>
          
          {/* Private Repos Note will go here */}
          {data?.privateRepos && (
            <div className="private-repos-note" style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--card-bg)' }}>
              <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--text-bright)' }}>🔒 Arquivos Confidenciais:</strong> Além dos projetos acima, a agência mantém mais de <strong>{data.privateRepos.count} repositórios privados</strong>. 
                Estes projetos envolvem {data.privateRepos.summary} operando sob acordos estritos de confidencialidade.
              </p>
            </div>
          )}
        </section>

        <section id="tech-stack" className="section">
          <SectionHeader title="Tecnologias utilizadas por Vinícius" />
          <div className="about-content">
            <p className="about-text" style={{ marginBottom: '2rem' }}>
              Uma visão analítica das linguagens e tecnologias reais utilizadas em todos os repositórios (públicos e privados).
            </p>
            <LanguageChart stats={data?.techStats} />
          </div>
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
