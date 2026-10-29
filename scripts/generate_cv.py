#!/usr/bin/python3
import json
import os
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
CEREBRO_JSON = DATA_DIR / "cerebro.json"
OUTPUT_PDF = DATA_DIR / "curriculo.pdf"


def load_cerebro():
    with open(CEREBRO_JSON, "r", encoding="utf-8") as f:
        return json.load(f)


def draw_cv():
    cerebro = load_cerebro()
    curriculo = cerebro.get("curriculo", {})
    
    nome = curriculo.get("nome", "")
    headline = curriculo.get("headline", "")
    email = curriculo.get("email", "viniciusfv.9@gmail.com")
    localizacao = curriculo.get("localizacao", "")
    links = curriculo.get("links", {})
    linkedin = links.get("linkedin", "")
    github = links.get("github", "")
    portfolio = links.get("portfolio", "")
    
    resumo_profissional = curriculo.get("resumoProfissional", "")
    
    cargo_atual = curriculo.get("cargoAtual", {})
    
    formacao_academica = curriculo.get("formacaoAcademica", [])
    certificacoes_qualificacao = curriculo.get("certificacoesQualificacao", [])
    certificacoes_adicionais = curriculo.get("certificacoesAdicionais", [])
    
    idiomas = curriculo.get("idiomas", {})
    
    tech_stats = cerebro.get("techStats", [])
    projetos = cerebro.get("projetos", [])
    
    # Page setup - A4, ~1.5cm margins
    pagesize = A4
    width, height = pagesize
    margin = 1.5 * cm
    usable_width = width - 2 * margin
    
    # Try different font sizes to fit on 1 page
    for font_size in [9.5, 9, 8.5, 8]:
        c = canvas.Canvas(str(OUTPUT_PDF), pagesize=pagesize)
        try:
            # Use Helvetica (standard)
            c.setFont("Helvetica", font_size)
            y = height - margin
            
            # Header
            c.setFont("Helvetica-Bold", font_size + 4)
            c.drawString(margin, y, nome)
            y -= (font_size + 8)
            
            c.setFont("Helvetica", font_size + 1)
            # Draw headline
            headline_lines = simpleSplit(headline, "Helvetica", font_size + 1, usable_width)
            for hline in headline_lines:
                c.drawString(margin, y, hline)
                y -= (font_size + 4)
            y -= font_size * 0.5
            
            # Contact
            c.setFont("Helvetica", font_size)
            contato_parts = []
            if localizacao:
                contato_parts.append(localizacao)
            if email:
                contato_parts.append(email)
            if linkedin:
                # Extract just the path if full URL
                if "linkedin.com" in linkedin:
                    contato_parts.append("linkedin.com/in/devini9")
                else:
                    contato_parts.append(linkedin)
            if github:
                if "github.com" in github:
                    contato_parts.append("github.com/devini9")
                else:
                    contato_parts.append(github)
            contato_str = " • ".join(contato_parts)
            contato_lines = simpleSplit(contato_str, "Helvetica", font_size, usable_width)
            for cline in contato_lines:
                c.drawString(margin, y, cline)
                y -= (font_size + 2)
            y -= font_size * 0.8
            
            # Helper functions
            def draw_section_title(title):
                nonlocal y
                if y < margin + 50:  # not enough space
                    raise Exception("Not enough space")
                c.setFont("Helvetica-Bold", font_size + 1)
                c.drawString(margin, y, title.upper())
                y -= (font_size + 4)
                c.setFont("Helvetica", font_size)
            
            def draw_paragraph(text):
                nonlocal y
                if not text:
                    return
                # Replace newlines with spaces and normalize
                text_clean = ' '.join(text.replace('\n', ' ').split())
                lines = simpleSplit(text_clean, "Helvetica", font_size, usable_width)
                for line in lines:
                    if y < margin + 20:
                        raise Exception("Not enough space")
                    c.drawString(margin, y, line)
                    y -= (font_size + 2)
                y -= font_size * 0.3
            
            def draw_bullet_list(items):
                nonlocal y
                for item in items:
                    if not item:
                        continue
                    if y < margin + 20:
                        raise Exception("Not enough space")
                    # Clean item
                    item_clean = ' '.join(str(item).replace('\n', ' ').split())
                    # Bullet point
                    bullet_text = "• " + item_clean
                    lines = simpleSplit(bullet_text, "Helvetica", font_size, usable_width)
                    for idx, line in enumerate(lines):
                        if y < margin + 20:
                            raise Exception("Not enough space")
                        if idx == 0:
                            c.drawString(margin, y, line)
                        else:
                            c.drawString(margin + font_size * 0.3, y, line)  # indent continuation
                        y -= (font_size + 2)
                    y -= font_size * 0.2
            
            # RESUMO PROFISSIONAL
            draw_section_title("RESUMO PROFISSIONAL")
            draw_paragraph(resumo_profissional)
            y -= font_size * 0.4
            
            # EXPERIÊNCIA PROFISSIONAL
            draw_section_title("EXPERIÊNCIA PROFISSIONAL")
            # Current role
            if cargo_atual:
                if y < margin + 30:
                    raise Exception("Not enough space")
                c.setFont("Helvetica-Bold", font_size)
                cargo_line = f"{cargo_atual.get('cargo', '')} | {cargo_atual.get('empresa', '')}"
                c.drawString(margin, y, cargo_line)
                y -= (font_size + 2)
                c.setFont("Helvetica", font_size)
                periodo_local = f"{cargo_atual.get('periodo', '')} | {cargo_atual.get('local', '')}"
                c.drawString(margin, y, periodo_local)
                y -= (font_size + 2)
                y -= font_size * 0.2
                # Draw resumo cargo atual
                resumo_cargo = cargo_atual.get('resumo') or curriculo.get('resumoCargoAtual', '')
                if resumo_cargo:
                    draw_bullet_list([r.strip() for r in resumo_cargo.split('\n') if r.strip()])
                y -= font_size * 0.3
            
            # FORMAÇÃO
            draw_section_title("FORMAÇÃO")
            if formacao_academica:
                for form in formacao_academica:
                    if y < margin + 20:
                        raise Exception("Not enough space")
                    c.setFont("Helvetica-Bold", font_size)
                    curso = form.get('curso', '')
                    c.drawString(margin, y, curso)
                    y -= (font_size + 2)
                    c.setFont("Helvetica", font_size)
                    inst_periodo = f"{form.get('instituicao', '')} | {form.get('periodo', '')}"
                    if form.get('status'):
                        inst_periodo += f" ({form.get('status')})"
                    c.drawString(margin, y, inst_periodo)
                    y -= (font_size + 2)
                    y -= font_size * 0.2
            y -= font_size * 0.2
            
            # CERTIFICAÇÕES
            draw_section_title("CERTIFICAÇÕES")
            all_certs = []
            all_certs.extend(certificacoes_qualificacao)
            all_certs.extend(certificacoes_adicionais)
            draw_bullet_list(all_certs)
            y -= font_size * 0.4
            
            # COMPETÊNCIAS
            draw_section_title("COMPETÊNCIAS")
            if tech_stats:
                comp_items = []
                for ts in tech_stats:
                    comp_items.append(f"{ts.get('language', '')} ({ts.get('percentage', '')}%)")
                # Group them nicely
                comp_str = " • ".join(comp_items)
                comp_lines = simpleSplit(comp_str, "Helvetica", font_size, usable_width)
                for cline in comp_lines:
                    if y < margin + 20:
                        raise Exception("Not enough space")
                    c.drawString(margin, y, cline)
                    y -= (font_size + 2)
                y -= font_size * 0.3
            y -= font_size * 0.2
            
            # PROJETOS
            draw_section_title("PROJETOS")
            if projetos:
                for proj in projetos:
                    frontmatter = proj.get('frontmatter', {})
                    title = frontmatter.get('title', '')
                    content = proj.get('content', '')
                    if y < margin + 30:
                        raise Exception("Not enough space")
                    c.setFont("Helvetica-Bold", font_size)
                    # Special handling for projeto_vento-international
                    proj_id = proj.get('id', '')
                    if proj_id == 'projeto_vento-international':
                        proj_title = "[Projeto Confidencial] Infraestrutura de banco de dados e integração para logística internacional"
                    else:
                        proj_title = title
                    # Clean title of emojis if too long, but keep as specified
                    proj_title_lines = simpleSplit(proj_title, "Helvetica-Bold", font_size, usable_width)
                    for ptline in proj_title_lines:
                        if y < margin + 20:
                            raise Exception("Not enough space")
                        c.drawString(margin, y, ptline)
                        y -= (font_size + 2)
                    c.setFont("Helvetica", font_size)
                    if proj_id == 'projeto_vento-international':
                        # Use exact truncated form as specified
                        proj_desc = "[Projeto Confidencial] Infraestrutura de banco de dados e integração para logística internacional. SQL Server, pipelines de dados, dashboards BI e auditoria."
                        # Truncate to ~150 chars as specified
                        if len(proj_desc) > 150:
                            proj_desc = proj_desc[:147] + "..."
                    else:
                        proj_desc = content
                    proj_desc_clean = ' '.join(str(proj_desc).replace('\n', ' ').split())
                    # Take first line ~150 chars
                    if len(proj_desc_clean) > 150:
                        proj_desc_clean = proj_desc_clean[:147] + "..."
                    desc_lines = simpleSplit(proj_desc_clean, "Helvetica", font_size, usable_width)
                    for dline in desc_lines:
                        if y < margin + 20:
                            raise Exception("Not enough space")
                        c.drawString(margin, y, dline)
                        y -= (font_size + 2)
                    y -= font_size * 0.2
            y -= font_size * 0.2
            
            # IDIOMAS
            draw_section_title("IDIOMAS")
            if idiomas:
                idioma_items = []
                for lang, level in idiomas.items():
                    idioma_items.append(f"{lang}: {level}")
                idioma_str = " • ".join(idioma_items)
                idioma_lines = simpleSplit(idioma_str, "Helvetica", font_size, usable_width)
                for iline in idioma_lines:
                    if y < margin + 20:
                        raise Exception("Not enough space")
                    c.drawString(margin, y, iline)
                    y -= (font_size + 2)
                y -= font_size * 0.3
            
            # CONTATO
            draw_section_title("CONTATO")
            contato_final_parts = []
            if email:
                contato_final_parts.append(email)
            if linkedin and "linkedin.com" in linkedin:
                contato_final_parts.append("linkedin.com/in/devini9")
            if github and "github.com" in github:
                contato_final_parts.append("github.com/devini9")
            if portfolio:
                contato_final_parts.append(portfolio)
            contato_final_str = " • ".join(contato_final_parts)
            contato_final_lines = simpleSplit(contato_final_str, "Helvetica", font_size, usable_width)
            for cfl in contato_final_lines:
                if y < margin + 10:
                    raise Exception("Not enough space")
                c.drawString(margin, y, cfl)
                y -= (font_size + 2)
            
            c.save()
            # Verify it fits on 1 page by checking if we completed
            return True
        except Exception as e:
            c.save()
            continue  # try smaller font
    return False


def main():
    try:
        draw_cv()
        print(f"Generated {OUTPUT_PDF}")
        return 0
    except Exception as e:
        print(f"Error: {e}", file=__import__('sys').stderr)
        import traceback
        traceback.print_exc(file=__import__('sys').stderr)
        return 1


if __name__ == "__main__":
    exit(main())
