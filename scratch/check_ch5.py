import json

with open(r"d:\Smart waste management\scratch\farzin_paragraphs.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for p in data[258:298]:
    if p["text"].strip() or p["has_drawing"] or p["has_sectpr"]:
        print(f"P{p['index']:03d} [{p['style']}] (align={p['align']}, sect={p['has_sectpr']}): {p['text'].strip()[:80]}")
