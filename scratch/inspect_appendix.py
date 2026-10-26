import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print("=== APPENDIX PARAGRAPHS (P693-P755) ===")
for i in range(693, min(755, len(doc.paragraphs))):
    p = doc.paragraphs[i]
    txt = p.text.strip()
    if txt or "w:drawing" in p._element.xml:
        has_draw = "w:drawing" in p._element.xml
        print(f"P{i:03d} [{p.style.name}] (draw={has_draw}): '{txt}'")
