import './Header.css';

export function Header() {
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
          <span className="brand-name">Vinícius Vitorino</span>
          <span className="brand-cursor"></span>
        </a>

        <nav className="header-nav">
          <a href="#projects" onClick={(e) => scrollTo(e, 'projects')}>Projetos</a>
          <a href="#about" onClick={(e) => scrollTo(e, 'about')}>Arquitetura</a>
          <a href="#contato" onClick={(e) => scrollTo(e, 'contato')}>Contato</a>
          <a 
            href="/portfolio/data/curriculo.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="cv-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('USER_ACTION', { detail: 'CV_DOWNLOAD' }))}
          >
            [ BAIXAR CV ]
          </a>
        </nav>
      </div>
    </header>
  );
}
