import './Header.css';

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/" className="brand">
          <span className="brand-prompt">&gt;_</span>
          <span className="brand-name">Vinícius Vitorino</span>
          <span className="brand-cursor"></span>
        </a>

        <nav className="header-nav">
          <a href="#projects">Projetos</a>
          <a href="#about">Arquitetura</a>
          <a href="#contact">Contato</a>
          <a href="/portfolio/data/curriculo.pdf" target="_blank" rel="noopener noreferrer" className="cv-btn">
            [ BAIXAR CV ]
          </a>
        </nav>
      </div>
    </header>
  );
}
