import docx
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print("=== STYLES DEFINED ===")
for s in doc.styles:
    if s.type == docx.enum.style.WD_STYLE_TYPE.PARAGRAPH:
        f = s.font
        print(f"Style: '{s.name}' -> font={f.name}, size={f.size.pt if f.size else None}, bold={f.bold}")

print("\n=== FIRST 25 PARAGRAPHS DETAILS ===")
for i, p in enumerate(doc.paragraphs[:30]):
    if not p.text.strip():
        continue
    runs_desc = []
    for r in p.runs:
        runs_desc.append(f"'{r.text}'(font={r.font.name}, sz={r.font.size.pt if r.font.size else None}, b={r.bold}, i={r.italic})")
    print(f"P{i:02d} [{p.style.name}] (align={p.alignment}, sb={p.paragraph_format.space_before}, sa={p.paragraph_format.space_after}, ls={p.paragraph_format.line_spacing}):")
    print("   " + " ".join(runs_desc))
