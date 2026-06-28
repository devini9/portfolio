import './Hero.css';

export function Hero() {
  return (
    <section className="hero reveal">
      <div className="hero-glow"></div>
      <div className="hero-content">
        <h1 className="hero-title">Cientista de Dados & Especialista em IA.</h1>
        <p className="hero-tagline">
          Consultor de Banco de Dados | LLMs | Agentes de IA | Python | SQL.
          <br /><br />
          E aí, tudo certo? Meu nome é Vinícius Vitorino e esse portfólio não é um site comum. Ele é um ecossistema vivo que meus próprios agentes de IA atualizam pra mim enquanto eu me preocupo em sempre aprender e evoluir.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary">Ver Projetos</a>
          <a href="https://github.com/devini9" target="_blank" rel="noreferrer" className="text-link">GitHub</a>
        </div>
      </div>
    </section>
  );
}
