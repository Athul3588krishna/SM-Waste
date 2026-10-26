import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

print("Checking paragraphs 340 to 405:")
for i in range(340, min(405, len(doc.paragraphs))):
    p = doc.paragraphs[i]
    if p.text.strip():
        txt = p.text.encode('ascii', errors='replace').decode('ascii')
        print(f"P{i:03d} [{p.style.name}]: '{txt}'")
