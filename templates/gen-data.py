# Regenerates templates-data.js from the authoritative Website Factory
# catalog dataset (docs/budget-website-catalog-data.json in the Website
# Project repo). Run again whenever that dataset changes.
import json, re, io, sys, os
sys.stdout.reconfigure(encoding='utf-8')

SRC = r'C:/Users/kasar/Documents/Website Project/docs/budget-website-catalog-data.json'
data = json.load(io.open(SRC, encoding='utf-8'))

# Absolute output path: this must not depend on the caller's cwd. Running
# this script as `python3 templates/gen-data.py` from the repo root (an
# easy, natural way to invoke it) resolves a relative 'templates-data.js'
# against the repo root, silently writing a stray file there instead of
# into templates/ -- exactly what happened once already. Anchor it.
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates-data.js')

DASH = r'[–—]'
def sweep(t):
    if not isinstance(t, str): return t
    t = re.sub(r'(₹[\d,]+\+?)\s*' + DASH + r'\s*(₹[\d,]+\+?)', r'\1 to \2', t)
    t = re.sub(r'(\d)\s*' + DASH + r'\s*(\d)', r'\1-\2', t)
    for _ in range(3):
        t = re.sub(r'([^\s])\s*' + DASH + r'\s*([^\s])', r'\1, \2', t)
    return re.sub(DASH, '-', t)

def clean_pitch(p):
    p = sweep(p).strip()
    if p.startswith('"') and p.endswith('"'):
        p = p[1:-1]
    return p

# Site ladder per Lekhraj's stated pricing (dataset says Rs 10,000 for
# Tier 1; flagged, override stands until he says otherwise).
PRICE = {1: '₹8,000', 2: '₹15,000', 3: '₹25,000', 4: '₹50,000+'}

out = []
for e in data:
    n = int(e['num'])
    built = e['tiersBuilt']
    tiers_by_no = {t['tier']: t for t in e['tiers']}
    tiers = []
    # Rows rendered = built tiers only (handoff rule: a 3-tier trade shows
    # 3 rows, no greyed-out 4th). Tier specs exist for unbuilt tier 4 on
    # trades 19-34; those stay out of the accordion by design.
    for k in built:
        td = tiers_by_no.get(k)
        tiers.append({
            'no': k,
            'price': PRICE[k],
            'pitch': clean_pitch(td['pitch']) if td else 'Full inclusions for this trade are being written up. The ladder matches every other template. Ask us for specifics.',
            'bullets': [sweep(b) for b in td['keyFeatures']] if td else [],
        })
    out.append({
        'n': n,
        'slug': e['slug'],
        'name': sweep(e['name']),
        'blurb': sweep(e['blurb']),
        'accent': e['designSystem']['primaryColor'],
        # Deployed 2026-07-19 to the existing website-project Vercel
        # project (tiers 1-3 for all 34 trades, 445 files). Tier 4 apps
        # are not part of this static deploy (separate Next.js runtime).
        'linkable': True,
        'tiers': tiers,
    })

js = '/* Generated from the Website Factory catalog dataset\n'
js += '   (Website Project/docs/budget-website-catalog-data.json) by gen-data.py.\n'
js += '   Do not hand-edit; re-run the generator instead (python3 gen-data.py,\n'
js += '   from any directory -- the output path is absolute). Tier 1 shown as\n'
js += '   Rs 8,000 per the site ladder (dataset says Rs 10,000; flagged).\n'
js += '   linkable:true for tiers 1-3, all 34 trades, deployed 2026-07-19 to\n'
js += '   website-project-liart.vercel.app; glimpses are real screenshots of\n'
js += '   those same local builds pre-deploy. */\n'
js += 'var LEDGER = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n'
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(js)
assert not re.search(DASH, js)
print('wrote', OUT)
print('entries:', len(out), '| rows:', sum(len(x["tiers"]) for x in out), '| no dashes: ok')
