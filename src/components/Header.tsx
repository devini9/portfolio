import { useEffect, useState } from 'react';
import './Header.css';

type Theme = 'light' | 'dark';

export function Header() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored as Theme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/" onClick={(e) => scrollTo(e, 'top')} className="brand">
          <span className="brand-prompt">&gt;_</span>
          <span className="brand-name">Vinícius Mugnes Ferrira Vitorino</span>
          <span className="brand-cursor"></span>
        </a>

        <nav className="header-nav">
          <a href="#experience" onClick={(e) => scrollTo(e, 'experience')}>Sobre</a>
          <a href="#projects" onClick={(e) => scrollTo(e, 'projects')}>Projetos</a>
          <a href="#contato" onClick={(e) => scrollTo(e, 'contato')}>Contato</a>
          <a 
            href="/portfolio/data/curriculo.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="cv-btn"
          >
            [ BAIXAR CV ]
          </a>
          
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label="Alternar Tema"
            title="Alternar Tema"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
