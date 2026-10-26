import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

for t_idx in range(2, len(doc.tables)):
    tbl = doc.tables[t_idx]
    prev_txt = doc.paragraphs[346 + (t_idx - 2)*3].text if 346 + (t_idx - 2)*3 < len(doc.paragraphs) else ""
    print(f"\n--- TABLE {t_idx} (Heading: {prev_txt}) ---")
    for r_idx, r in enumerate(tbl.rows):
        row_txt = [c.text.strip().replace('\n', ' ') for c in r.cells]
        print(f"  R{r_idx}: {row_txt}")
