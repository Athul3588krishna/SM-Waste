import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

print("=== CHAPTER 2 LIST PARAGRAPHS (P140-P176) ===")
for i in range(140, 177):
    p = doc.paragraphs[i]
    if p.text.strip():
        print(f"P{i:03d} [{p.style.name}]: '{p.text}'")
