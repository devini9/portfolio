#!/usr/bin/env python3
"""
sync-github.py — Sincroniza dados do GitHub com o portfolio.
Puxa repositórios, linguagens, stats e gera cerebro.json.
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_USERNAME = os.environ.get("GITHUB_USERNAME", "devini9")
OUTPUT_PATH = Path(__file__).resolve().parent.parent / "public" / "data" / "cerebro.json"
EXCLUDE_REPOS = ["portfolio", "base-devini9", ".github"]

LANGUAGE_COLORS = {
    "Python": "#3572A5",
    "Dockerfile": "#384d54",
    "Go": "#00ADD8",
    "TypeScript": "#3178c6",
    "JavaScript": "#f1e05a",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "Shell": "#89e051",
    "Jupyter Notebook": "#DA5B0B",
    "PLSQL": "#dad8d8",
    "Rust": "#dea584",
    "Batchfile": "#C1F12E",
    "Makefile": "#8b949e",
    "Ruby": "#701516",
    "Java": "#b07219",
    "C": "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    "PHP": "#4F5D95",
    "Swift": "#F05138",
    "Kotlin": "#A97BFF",
    "Lua": "#000080",
    "R": "#198CE7",
    "Scala": "#c22d40",
    "Dart": "#00B4AB",
    "Zig": "#ec915c",
}


def github_request(url: str) -> dict | list:
    """Faz uma requisição autenticada à API do GitHub."""
    req = urllib.request.Request(url)
    req.add_header("User-Agent", "devini9-portfolio-sync")
    req.add_header("Accept", "application/vnd.github.v3+json")
    if GITHUB_TOKEN:
        req.add_header("Authorization", f"Bearer {GITHUB_TOKEN}")

    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def get_all_repos() -> list:
    """Busca todos os repositórios (públicos e privados) com paginação."""
    all_repos = []
    page = 1
    while True:
        url = f"https://api.github.com/user/repos?sort=updated&per_page=100&page={page}"
        repos = github_request(url)
        if not repos:
            break
        all_repos.extend(repos)
        page += 1
    return all_repos


def get_languages(languages_url: str) -> dict:
    """Busca as linguagens de um repositório."""
    return github_request(languages_url)


def get_user_profile() -> dict:
    """Busca dados públicos do perfil do GitHub."""
    return github_request(f"https://api.github.com/users/{GITHUB_USERNAME}")


def calculate_tech_stats(repos: list) -> list:
    """Calcula estatísticas de linguagens a partir dos repositórios."""
    language_totals = {}

    print(f"🔍 Coletando estatísticas de linguagens...")
    for repo in repos:
        try:
            langs = get_languages(repo["languages_url"])
            for lang, bytes_count in langs.items():
                language_totals[lang] = language_totals.get(lang, 0) + bytes_count
        except urllib.error.HTTPError as e:
            print(f"  ⚠️  Erro ao buscar linguagens de {repo['name']}: {e.code}")

    total_bytes = sum(language_totals.values())
    if total_bytes == 0:
        return []

    tech_stats = []
    for lang, bytes_count in language_totals.items():
        percentage = round((bytes_count / total_bytes) * 100, 1)
        tech_stats.append({
            "language": lang,
            "percentage": percentage,
            "color": LANGUAGE_COLORS.get(lang, "#8b949e"),
        })

    tech_stats.sort(key=lambda x: x["percentage"], reverse=True)
    return tech_stats


def build_project_list(repos: list) -> list:
    """Constrói a lista de projetos para exibição."""
    projetos = []
    for repo in repos:
        if repo.get("private") or repo["name"] in EXCLUDE_REPOS:
            continue
        if repo.get("fork") or repo.get("archived"):
            continue

        tags = [repo.get("language")] if repo.get("language") else []
        if repo.get("topics"):
            tags.extend(repo["topics"][:5])

        projetos.append({
            "id": repo["name"],
            "frontmatter": {
                "title": repo["name"].replace("-", " ").replace("_", " ").title(),
                "tags": tags,
                "url": repo["html_url"],
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "updated": repo.get("updated_at", ""),
            },
            "content": repo.get("description") or "Sem descrição disponível.",
        })

    projetos.sort(key=lambda x: x["frontmatter"].get("stars", 0), reverse=True)
    return projetos


def main():
    if not GITHUB_TOKEN:
        print("❌ GITHUB_TOKEN não encontrado. Defina a variável de ambiente.")
        sys.exit(1)

    print(f"📡 Sincronizando dados do GitHub para @{GITHUB_USERNAME}...")

    # Buscar perfil
    profile = get_user_profile()
    print(f"  👤 Perfil: {profile.get('name', GITHUB_USERNAME)}")

    # Buscar todos os repositórios
    repos = get_all_repos()
    print(f"  📦 {len(repos)} repositórios encontrados")

    # Calcular stats
    tech_stats = calculate_tech_stats(repos)
    print(f"  📊 {len(tech_stats)} linguagens mapeadas")

    # Construir projetos
    projetos = build_project_list(repos)
    print(f"  🗂️  {len(projetos)} projetos públicos para exibição")

    # Contar privados
    private_count = sum(1 for r in repos if r.get("private"))

    # Carregar dados existentes (para preservar campos como LinkedIn)
    cerebro_data = {}
    if OUTPUT_PATH.exists():
        cerebro_data = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))

    # Atualizar estrutura
    cerebro_data["metadata"] = {
        "lastUpdate": datetime.now(timezone.utc).isoformat(),
        "source": "GitHub API",
        "githubUser": GITHUB_USERNAME,
        "githubName": profile.get("name", ""),
        "githubBio": profile.get("bio", ""),
        "githubFollowers": profile.get("followers", 0),
        "githubRepos": profile.get("public_repos", 0),
    }

    cerebro_data["techStats"] = tech_stats
    cerebro_data["projetos"] = projetos
    cerebro_data["privateRepos"] = {
        "count": private_count,
        "summary": "arquitetura de dados avançada, Inteligência Artificial, "
                   "processamento em nuvem e automação corporativa com Python e SQL",
    }

    # Salvar
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(cerebro_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"✅ Arquivo {OUTPUT_PATH} atualizado com sucesso!")


if __name__ == "__main__":
    main()
