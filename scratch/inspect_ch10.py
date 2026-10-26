import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

print("=== CHAPTER 10 PARAGRAPHS (P640-P670) ===")
for i in range(640, min(672, len(doc.paragraphs))):
    p = doc.paragraphs[i]
    if p.text.strip():
        print(f"P{i:03d} [{p.style.name}]: '{p.text}'")
