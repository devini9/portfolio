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
              <li><strong>Agent Hermes:</strong> Coleta e sincroniza dados do GitHub para o Obsidian Vault local via automação invisível.</li>
              <li><strong>Agent Aegis:</strong> Rotinas de cron em Node.js que realizam auditoria, backup semanal e garantem a integridade da base.</li>
              <li><strong>Agent Pixel:</strong> A interface visual (onde você está navegando) que consome o JSON do Obsidian e renderiza tudo estaticamente via React e Vite.</li>
            </ul>
          </div>
        </section>

        <Contact />

      </main>

      <footer className="site-footer">
        <span>© 2026 devini9. Sistemas operando normalmente.</span>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5599999999999?text=Ol%C3%A1%20Vin%C3%ADcius%21%20Vim%20pelo%20seu%20portf%C3%B3lio%20Ag%C3%AAncia%20Devini9." 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.688.063-1.092-.067-.252-.081-.71-.24-1.485-.606-1.64-7.76-2.023-8.213-2.023-8.213-.014-.017-.482-.641-.482-1.54 0-.898.466-1.341.63-1.517.165-.178.355-.221.474-.221.118 0 .236.004.343.009.112.005.263-.043.407.304.148.358.503 1.231.548 1.321.045.091.074.197.015.318-.059.121-.089.197-.178.303-.089.106-.188.225-.267.311-.089.091-.182.193-.074.381.108.188.484.801 1.037 1.297.712.639 1.311.838 1.498.929.188.091.297.074.407-.043.112-.119.484-.564.615-.758.134-.193.267-.16.44-.096.173.064 1.1.519 1.288.613.188.094.313.141.358.22.045.079.045.46-.099.865z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.761.458 3.405 1.252 4.823L2 22l5.347-1.217C8.718 21.558 10.312 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm.031 17.653c-1.391 0-2.736-.36-3.921-1.043l-.28-.163-2.915.663.676-2.846-.179-.283c-.748-1.186-1.144-2.569-1.143-3.987.002-4.148 3.385-7.531 7.534-7.531 4.146.001 7.528 3.386 7.529 7.532.001 4.146-3.382 7.529-7.53 7.53l.029.128z"/>
        </svg>
      </a>

      <AgentTerminal />
    </>
  );
}

export default App;
