import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './Header.css';

export function Header() {
  const [isGenerating, setIsGenerating] = useState(false);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'top') {
      window.scrollTo(0, 0);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadCV = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const cvElement = document.getElementById('cv-template');
    if (!cvElement) return;

    setIsGenerating(true);

    try {
      // Temporarily remove hiding to render canvas properly
      cvElement.style.left = '0';
      cvElement.style.top = '0';
      cvElement.style.zIndex = '-1';

      const canvas = await html2canvas(cvElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Curriculo_Vinicius_Vitorino.pdf');

    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Houve um erro ao gerar o PDF. Tente novamente.");
    } finally {
      // Restore hiding
      cvElement.style.left = '-9999px';
      cvElement.style.top = '0';
      setIsGenerating(false);
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
            href="#" 
            onClick={handleDownloadCV}
            className="cv-btn"
            style={{ pointerEvents: isGenerating ? 'none' : 'auto', opacity: isGenerating ? 0.7 : 1 }}
          >
            {isGenerating ? '[ GERANDO... ]' : '[ BAIXAR CV ]'}
          </a>
        </nav>
      </div>
    </header>
  );
}
