import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

for idx in [766, 768, 770, 771, 773]:
    p = doc.paragraphs[idx]
    print(f"P{idx:03d} XML:\n", p._element.xml[:600])
