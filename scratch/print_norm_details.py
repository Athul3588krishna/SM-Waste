import docx

doc_path = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(doc_path)

for idx in [307, 309, 312, 313, 315, 317, 319, 321, 323, 325, 326, 327, 328, 331, 333, 336, 338, 340, 342, 345]:
    p = doc.paragraphs[idx]
    print(f"P{idx:03d} [{p.style.name}] (align={p.alignment}): '{p.text}'")
