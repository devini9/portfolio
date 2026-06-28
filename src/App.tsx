import { useEffect, useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SectionHeader } from './components/SectionHeader';
import { ProjectCard } from './components/ProjectCard';
import { AgentTerminal } from './components/AgentTerminal';
import { Contact } from './components/Contact';

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
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
        
        <section id="projects" className="section">
          <SectionHeader number="01" title="Projetos em Destaque" />
          <div className="section-lead">
            Repositórios e arquiteturas extraídas da base de operações.
          </div>
          
          <div className="project-grid">
            {data?.projetos ? (
              data.projetos.map((proj: any) => (
                <ProjectCard key={proj.id} project={proj} />
              ))
            ) : (
              <p className="loading"><span className="brand-cursor"></span> Carregando repositórios...</p>
            )}
          </div>
        </section>

        <section id="about" className="section">
          <SectionHeader number="02" title="Arquitetura & Ecossistema" />
          <div className="about-content">
            <p className="about-text">
              Este portfólio não é estático. Ele é um ecossistema vivo alimentado por agentes autônomos.
            </p>
            <ul className="about-list">
              {data?.regras && data.regras.length > 0 ? (
                data.regras.map((item: any, idx: number) => (
                  <li key={idx}><strong>{item.regra}:</strong> {item.descricao}</li>
                ))
              ) : (
                <li><span className="brand-cursor"></span> Sincronizando arquitetura...</li>
              )}
            </ul>
          </div>
        </section>

        <Contact />

      </main>

      <footer className="site-footer">
        <span>© 2026 devini9. Sistemas operando normalmente.</span>
      </footer>

      <AgentTerminal />
    </>
  );
}

export default App;
