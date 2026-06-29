import './LanguageChart.css';

interface TechStat {
  language: string;
  percentage: number;
  color: string;
}

interface LanguageChartProps {
  stats: TechStat[];
}

export function LanguageChart({ stats }: LanguageChartProps) {
  if (!stats || stats.length === 0) {
    return <p className="loading"><span className="brand-cursor"></span> Analisando repositórios...</p>;
  }

  return (
    <div className="language-chart-container">
      <div className="language-chart-header">
        <h3 className="language-chart-title">Linguagens & Tecnologias</h3>
        <span className="language-chart-subtitle">Análise baseada em repositórios do GitHub</span>
      </div>
      
      <div className="language-progress-bar">
        {stats.map((stat) => (
          <div 
            key={stat.language}
            className="language-segment" 
            style={{ 
              width: `${stat.percentage}%`, 
              backgroundColor: stat.color 
            }}
            title={`${stat.language} ${stat.percentage}%`}
          ></div>
        ))}
      </div>
      
      <div className="language-legend">
        {stats.map((stat) => (
          <div key={stat.language} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: stat.color }}></span>
            <span className="legend-name">{stat.language}</span>
            <span className="legend-percent">{stat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
