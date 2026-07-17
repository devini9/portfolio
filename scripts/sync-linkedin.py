#!/usr/bin/env python3
"""
sync-linkedin.py — Parseia o data export do LinkedIn e atualiza cerebro.json.

Como usar:
  1. Acesse https://www.linkedin.com/mypreferences/d/download-my-data
  2. Selecione todos os dados → Baixe o arquivo ZIP
  3. Rode: python sync-linkedin.py caminho/para/linkedin.zip
"""

import csv
import io
import json
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "public" / "data" / "cerebro.json"


def parse_positions(zip_file: zipfile.ZipFile) -> list:
    """Extrai experiências profissionais do CSV Positions.csv."""
    experiences = []
    filename = _find_file(zip_file, "Positions.csv")
    if not filename:
        return experiences

    content = zip_file.read(filename).decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))

    for row in reader:
        exp = {
            "company": row.get("Company Name", "").strip(),
            "role": row.get("Title", "").strip(),
            "location": row.get("Location", "").strip(),
            "start": _format_linkedin_date(row.get("Started On", "")),
            "end": _format_linkedin_date(row.get("Ended On", "")) or "Presente",
            "description": row.get("Description", "").strip(),
        }
        if exp["company"] and exp["role"]:
            experiences.append(exp)

    return experiences


def parse_education(zip_file: zipfile.ZipFile) -> list:
    """Extrai formação acadêmica do CSV Education.csv."""
    education = []
    filename = _find_file(zip_file, "Education.csv")
    if not filename:
        return education

    content = zip_file.read(filename).decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))

    for row in reader:
        edu = {
            "school": row.get("School Name", "").strip(),
            "degree": row.get("Degree Name", "").strip(),
            "field": row.get("Field Of Study", "").strip(),
            "start": _format_linkedin_date(row.get("Start Date", "")),
            "end": _format_linkedin_date(row.get("End Date", "")),
        }
        if edu["school"]:
            education.append(edu)

    return education


def parse_skills(zip_file: zipfile.ZipFile) -> list:
    """Extrai habilidades do CSV Skills.csv."""
    skills = []
    filename = _find_file(zip_file, "Skills.csv")
    if not filename:
        return skills

    content = zip_file.read(filename).decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))

    for row in reader:
        skill = row.get("Name", "").strip()
        if skill:
            skills.append(skill)

    return skills


def parse_certifications(zip_file: zipfile.ZipFile) -> list:
    """Extrai certificações do CSV Certifications.csv."""
    certs = []
    filename = _find_file(zip_file, "Certifications.csv")
    if not filename:
        return certs

    content = zip_file.read(filename).decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))

    for row in reader:
        cert = {
            "name": row.get("Name", "").strip(),
            "issuer": row.get("Authority", "").strip(),
            "date": _format_linkedin_date(row.get("Date", "")),
        }
        if cert["name"]:
            certs.append(cert)

    return certs


def parse_profile(zip_file: zipfile.ZipFile) -> dict:
    """Extrai dados básicos do perfil do Basic Profile.csv."""
    filename = _find_file(zip_file, "Basic Profile.csv")
    if not filename:
        return {}

    content = zip_file.read(filename).decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))

    for row in reader:
        return {
            "name": row.get("First Name", "").strip() + " " + row.get("Last Name", "").strip(),
            "headline": row.get("Headline", "").strip(),
            "location": row.get("Location", "").strip(),
            "summary": row.get("Summary", "").strip(),
        }

    return {}


def _find_file(zip_file: zipfile.ZipFile, target: str) -> str | None:
    """Busca um arquivo no ZIP independente do path completo."""
    for name in zip_file.namelist():
        if name.endswith(target):
            return name
        # LinkedIn exporta como "Profile/Positions.csv" ou "Positions.csv"
        if name.split("/")[-1] == target:
            return name
    return None


def _format_linkedin_date(date_str: str) -> str:
    """Converte 'Jan 2024' para formato legível."""
    if not date_str or date_str.strip() == "":
        return ""

    months_pt = {
        "Jan": "Janeiro", "Feb": "Fevereiro", "Mar": "Março",
        "Apr": "Abril", "May": "Maio", "Jun": "Junho",
        "Jul": "Julho", "Aug": "Agosto", "Sep": "Setembro",
        "Oct": "Outubro", "Nov": "Novembro", "Dec": "Dezembro",
    }

    parts = date_str.strip().split()
    if len(parts) == 2:
        month_en = parts[0][:3]
        year = parts[1]
        month_pt = months_pt.get(month_en, month_en)
        return f"{month_pt} de {year}"

    return date_str.strip()


def main():
    if len(sys.argv) < 2:
        print("Uso: python sync-linkedin.py caminho/para/linkedin.zip")
        print()
        print("Para baixar seus dados do LinkedIn:")
        print("  1. Acesse https://www.linkedin.com/mypreferences/d/download-my-data")
        print("  2. Selecione todos os dados")
        print("  3. Clique em 'Baizar arquivo'")
        print("  4. Aguarde o email com o download")
        sys.exit(1)

    zip_path = Path(sys.argv[1])
    if not zip_path.exists():
        print(f"❌ Arquivo não encontrado: {zip_path}")
        sys.exit(1)

    print(f"📥 Parseando arquivo LinkedIn: {zip_path.name}")

    with zipfile.ZipFile(zip_path, "r") as zf:
        profile = parse_profile(zf)
        experiences = parse_positions(zf)
        education = parse_education(zf)
        skills = parse_skills(zf)
        certifications = parse_certifications(zf)

    print(f"  👤 Perfil: {profile.get('name', 'N/A')}")
    print(f"  💼 {len(experiences)} experiências profissionais")
    print(f"  🎓 {len(education)} formações acadêmicas")
    print(f"  🛠️  {len(skills)} habilidades")
    print(f"  📜 {len(certifications)} certificações")

    # Carregar dados existentes
    cerebro_data = {}
    if OUTPUT_PATH.exists():
        cerebro_data = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))

    # Atualizar/atualizar seção LinkedIn
    cerebro_data["linkedin"] = {
        "profile": profile,
        "experiences": experiences,
        "education": education,
        "skills": skills,
        "certifications": certifications,
        "syncedAt": datetime.now(timezone.utc).isoformat(),
    }

    # Atualizar metadata
    if "metadata" not in cerebro_data:
        cerebro_data["metadata"] = {}
    cerebro_data["metadata"]["lastUpdate"] = datetime.now(timezone.utc).isoformat()
    cerebro_data["metadata"]["linkedinSynced"] = True

    # Salvar
    OUTPUT_PATH.write_text(json.dumps(cerebro_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"✅ Dados do LinkedIn salvos em {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
