import { LanguageChart } from './LanguageChart';
import './Hero.css';

interface HeroProps {
  stats: any[];
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="hero reveal">
      <div className="hero-glow"></div>
      <div className="hero-content">
        <h1 className="hero-title">Cientista de Dados & Especialista em IA.</h1>
        <p className="hero-tagline">
          Consultor de Banco de Dados | LLMs | Agentes de IA | Python | SQL.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <LanguageChart stats={stats} />
        </div>
      </div>
    </section>
  );
}
