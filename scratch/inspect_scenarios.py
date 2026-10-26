import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

for i in range(410, 454):
    p = doc.paragraphs[i]
    if p.text.strip():
        txt = p.text.encode('ascii', errors='replace').decode('ascii')
        print(f"P{i:03d} [{p.style.name}]: '{txt}'")
