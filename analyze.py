import json

with open('data/cerebro.json') as f:
    d = json.load(f)

print("=== cerebro.json structure ===")
print("Keys:", list(d.keys()))
for k, v in d.items():
    if isinstance(v, list):
        print(f"  {k}: [{len(v)} items]")
        if v and k in ('projetos', 'artigos', 'techStats'):
            print(f"    first item keys: {list(v[0].keys()) if isinstance(v[0], dict) else type(v[0])}")
    elif isinstance(v, dict):
        print(f"  {k}: dict keys={list(v.keys())}")
    else:
        print(f"  {k}: {v}")

print("\n=== regras ===")
for r in d.get('regras', []):
    print(f"  {r['regra']}: {r['descricao'][:80]}...")

print("\n=== projetos (if any) ===")
for p in d.get('projetos', []):
    print(f"  {json.dumps(p, indent=2)[:200]}")

print("\n=== artigos (if any) ===")
for a in d.get('artigos', []):
    print(f"  {json.dumps(a, indent=2)[:200]}")

print("\n=== techStats (if any) ===")
for t in d.get('techStats', []):
    print(f"  {json.dumps(t, indent=2)[:200]}")
