import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print("=== TABLE OF CONTENTS / HEADINGS HIERARCHY ===")
for i, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if not text:
        continue
    # If heading or uppercase short line or bold
    is_bold = any(r.bold for r in p.runs if r.text.strip())
    if p.style.name.startswith("Heading") or (len(text) < 60 and is_bold and text.isupper()):
        print(f"P{i:03d} [{p.style.name}] (Align: {p.alignment}): {text}")

print("\n=== HEADERS AND FOOTERS ===")
for i, section in enumerate(doc.sections[:5]):
    h = section.header
    f = section.footer
    h_text = " | ".join([p.text.strip() for p in h.paragraphs if p.text.strip()])
    f_text = " | ".join([p.text.strip() for p in f.paragraphs if p.text.strip()])
    print(f"Section {i+1}: Header='{h_text}' | Footer='{f_text}'")

print("\n=== SAMPLE TABLES ===")
for t_idx, table in enumerate(doc.tables[:4]):
    print(f"Table {t_idx+1}: {len(table.rows)} rows, {len(table.columns)} cols")
    for r_idx, row in enumerate(table.rows[:3]):
        row_cells = [c.text.strip().replace('\n', ' ') for c in row.cells]
        print(f"  Row {r_idx}: {row_cells[:4]}")
