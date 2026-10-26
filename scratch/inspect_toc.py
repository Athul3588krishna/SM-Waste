import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print("=== CONTENTS PARAGRAPHS (P93-P110) ===")
for i in range(92, 110):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        print(f"P{i:03d} [{p.style.name}]: '{p.text}'")

print("=== CHECK TABLES IN P93-P110 RANGE ===")
# Sometimes TOC is a table! Let's check table positions in the document
for idx, tbl in enumerate(doc.tables):
    # check first cell text
    t0 = tbl.rows[0].cells[0].text.strip() if tbl.rows and tbl.rows[0].cells else ""
    print(f"Table {idx}: rows={len(tbl.rows)}, cols={len(tbl.columns)}, first_cell='{t0}'")
