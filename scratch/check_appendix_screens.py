import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(doc_path)

print("=== APPENDIX PARAGRAPHS (P703-P764) ===")
for i in range(703, min(765, len(doc.paragraphs))):
    p = doc.paragraphs[i]
    has_draw = "w:drawing" in p._element.xml
    txt = p.text.strip()
    if txt or has_draw:
        print(f"P{i:03d} (draw={has_draw}): '{txt}'")
