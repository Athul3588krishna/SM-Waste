import docx

doc_path = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(doc_path)

print("=== PARAGRAPHS 304 to 348 ===")
for i in range(304, 348):
    p = doc.paragraphs[i]
    if p.text.strip():
        print(f"P{i:03d} [{p.style.name}]: {p.text[:80]}")
