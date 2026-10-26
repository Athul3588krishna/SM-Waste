import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

for i, p in enumerate(doc.paragraphs):
    if "TAILORED" in p.text.upper() or "ELEGANCE" in p.text.upper():
        print(f"P{i:03d}: {p.text[:90]}")
