import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

for idx in [306, 518, 519, 522, 531, 534, 768, 770, 773]:
    p = doc.paragraphs[idx]
    print(f"P{idx:03d} runs count={len(p.runs)} text: '{p.text}'")
    for r_i, r in enumerate(p.runs):
        print(f"   r{r_i}: '{r.text}'")
