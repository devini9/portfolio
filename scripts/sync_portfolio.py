#!/usr/bin/env python3
import json
import subprocess
import sys
import os
from datetime import datetime, timezone
from pathlib import Path
import tempfile

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
CEREBRO_JSON = DATA_DIR / "cerebro.json"
GENERATE_CV = REPO_ROOT / "scripts" / "generate_cv.py"


def run_cmd(cmd, check=False):
    try:
        result = subprocess.run(cmd, cwd=str(REPO_ROOT), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return -1, "", str(e)


def get_current_branch():
    rc, out, err = run_cmd(["git", "rev-parse", "--abbrev-ref", "HEAD"])
    if rc != 0:
        raise RuntimeError(f"Failed to get current branch: {err}")
    return out.strip()


def atomic_write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(prefix=path.name + ".tmp.", dir=str(path.parent))
    try:
        os.close(fd)
        content = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
        with open(tmp_path, "w", encoding="utf-8") as f:
            f.write(content)
        os.replace(tmp_path, path)
    finally:
        try:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        except Exception:
            pass


def load_cerebro():
    with open(CEREBRO_JSON, "r", encoding="utf-8") as f:
        return json.load(f)


def get_github_data():
    # gh api user
    rc, out, err = run_cmd(["gh", "api", "user"])
    if rc != 0:
        raise RuntimeError(f"gh api user failed: {err}")
    user = json.loads(out)
    
    # gh repo list
    rc, out, err = run_cmd(["gh", "repo", "list", "devini9", "--json", "name,isPrivate", "--limit", "1000"])
    if rc != 0:
        raise RuntimeError(f"gh repo list failed: {err}")
    repos = json.loads(out)
    
    public_repos = sum(1 for r in repos if not r.get("isPrivate"))
    private_repos = sum(1 for r in repos if r.get("isPrivate"))
    total_repos = len(repos)
    
    # Get languages for each repo
    lang_totals = {}
    for repo in repos:
        name = repo["name"]
        rc, out, err = run_cmd(["gh", "api", f"repos/devini9/{name}/languages"])
        if rc != 0:
            continue  # skip on error
        try:
            langs = json.loads(out)
            for lang, bytes_count in langs.items():
                lang_totals[lang] = lang_totals.get(lang, 0) + bytes_count
        except Exception:
            continue
    
    return {
        "followers": user.get("followers", 0),
        "public_repos": public_repos,
        "private_repos": private_repos,
        "total_repos": total_repos,
        "lang_totals": lang_totals
    }


def calculate_techstats(lang_totals, existing_techstats):
    if not lang_totals:
        return existing_techstats
    
    total_bytes = sum(lang_totals.values())
    if total_bytes == 0:
        return existing_techstats
    
    # Build color map from existing
    color_map = {ts["language"]: ts.get("color") for ts in existing_techstats}
    
    result = []
    for lang, bytes_count in sorted(lang_totals.items(), key=lambda x: x[1], reverse=True):
        percentage = round((bytes_count / total_bytes) * 100, 1)
        result.append({
            "language": lang,
            "percentage": percentage,
            "color": color_map.get(lang, "#cccccc")
        })
    
    return result


def main():
    args = sys.argv[1:]
    dry_run = "--dry-run" in args
    no_push = "--no-push" in args
    
    branch = None
    if "--branch" in args:
        idx = args.index("--branch")
        if idx + 1 < len(args):
            branch = args[idx + 1]
    
    try:
        if not CEREBRO_JSON.exists():
            raise RuntimeError(f"Missing {CEREBRO_JSON}")
        
        cerebro = load_cerebro()
        old_cerebro = json.dumps(cerebro, sort_keys=True)
        
        github_data = get_github_data()
        
        # Update only allowlist
        if "metadata" not in cerebro:
            cerebro["metadata"] = {}
        
        cerebro["metadata"]["lastUpdate"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "+00:00"
        cerebro["metadata"]["githubFollowers"] = github_data["followers"]
        cerebro["metadata"]["githubPublicRepos"] = github_data["public_repos"]
        cerebro["metadata"]["githubPrivateRepos"] = github_data["private_repos"]
        cerebro["metadata"]["githubTotalRepos"] = github_data["total_repos"]
        
        if "techStats" in cerebro:
            cerebro["techStats"] = calculate_techstats(github_data["lang_totals"], cerebro["techStats"])
        else:
            cerebro["techStats"] = calculate_techstats(github_data["lang_totals"], [])
        
        if "privateRepos" in cerebro:
            cerebro["privateRepos"]["count"] = github_data["private_repos"]
        
        new_cerebro = json.dumps(cerebro, sort_keys=True)
        has_diff = old_cerebro != new_cerebro
        
        if dry_run:
            print("Delta planned:")
            print(f"  metadata.githubFollowers: {github_data['followers']}")
            print(f"  metadata.githubPublicRepos: {github_data['public_repos']}")
            print(f"  metadata.githubPrivateRepos: {github_data['private_repos']}")
            print(f"  metadata.githubTotalRepos: {github_data['total_repos']}")
            print(f"  privateRepos.count: {github_data['private_repos']}")
            if cerebro.get("techStats"):
                for ts in cerebro["techStats"]:
                    print(f"  techStats[{ts['language']}]: {ts['percentage']}%")
            print(f"Has diff: {has_diff}")
            return 0
        
        if not has_diff:
            print("No diff in data/ → exit 0")
            return 0
        
        # Write atomically
        atomic_write_json(CEREBRO_JSON, cerebro)
        
        # Try to generate CV if exists
        if GENERATE_CV.exists():
            rc, out, err = run_cmd([sys.executable, str(GENERATE_CV)])
            if rc != 0:
                print(f"Warning: generate_cv.py failed: {err}", file=sys.stderr)
        else:
            print("Warning: scripts/generate_cv.py not found, skipping", file=sys.stderr)
        
        # Git operations
        if branch is None:
            branch = get_current_branch()
        
        # git add only specific files
        files_to_add = []
        if CEREBRO_JSON.exists():
            files_to_add.append(str(CEREBRO_JSON))
        curriculo_pdf = DATA_DIR / "curriculo.pdf"
        if curriculo_pdf.exists():
            files_to_add.append(str(curriculo_pdf))
        
        if not files_to_add:
            print("No files to add", file=sys.stderr)
            return 1
        
        rc, out, err = run_cmd(["git", "add"] + files_to_add)
        if rc != 0:
            raise RuntimeError(f"git add failed: {err}")
        
        # Check if there are staged changes
        rc, out, err = run_cmd(["git", "diff", "--cached", "--name-only"])
        if rc != 0 or not out.strip():
            print("No staged changes")
            return 0
        
        commit_msg = f"data: sync GitHub ({datetime.now().strftime('%Y-%m-%d')})"
        rc, out, err = run_cmd(["git", "commit", "-m", commit_msg])
        if rc != 0:
            raise RuntimeError(f"git commit failed: {err}")
        
        print(out)
        
        if not no_push:
            rc, out, err = run_cmd(["git", "push", "origin", branch])
            if rc != 0:
                raise RuntimeError(f"git push failed: {err}")
            print(out)
        else:
            print("Push skipped (--no-push)")
        
        return 0
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
