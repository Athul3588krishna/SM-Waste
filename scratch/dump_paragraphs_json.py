import docx
import json

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

data = []
for i, p in enumerate(doc.paragraphs):
    has_drawing = "w:drawing" in p._element.xml
    has_sectpr = bool(p._element.xpath('.//w:sectPr'))
    runs_data = []
    for r in p.runs:
        runs_data.append({
            "text": r.text,
            "font": r.font.name,
            "size": r.font.size.pt if r.font.size else None,
            "bold": r.bold,
            "italic": r.italic
        })
    data.append({
        "index": i,
        "style": p.style.name,
        "text": p.text,
        "align": str(p.alignment),
        "has_drawing": has_drawing,
        "has_sectpr": has_sectpr,
        "runs": runs_data
    })

with open(r"d:\Smart waste management\scratch\farzin_paragraphs.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print(f"Dumped {len(data)} paragraphs to farzin_paragraphs.json")
