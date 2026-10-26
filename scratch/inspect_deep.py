import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print(f"Total Sections: {len(doc.sections)}")
sec_info = []
for i, s in enumerate(doc.sections):
    h = " ".join([p.text.strip() for p in s.header.paragraphs if p.text.strip()])
    f = " ".join([p.text.strip() for p in s.footer.paragraphs if p.text.strip()])
    if h or f:
        sec_info.append(f"Sec {i+1}: Header='{h}' | Footer='{f}'")

print(f"Sections with headers/footers ({len(sec_info)}):")
for item in sec_info[:15]:
    print("  ", item)

# Let's inspect paragraphs around Table of Contents and Chapters
print("\n=== SAMPLE CHAPTER TITLE & BODY FORMATTING ===")
for i in range(100, 135):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        if p.text.strip():
            font_names = set(r.font.name for r in p.runs if r.font.name)
            font_sizes = set(r.font.size.pt for r in p.runs if r.font.size)
            print(f"P{i:03d} [{p.style.name}] (align={p.alignment}, ls={p.paragraph_format.line_spacing}, sb={p.paragraph_format.space_before}, sa={p.paragraph_format.space_after}) fonts={font_names} sz={font_sizes}: {p.text.strip()[:70]}")

print("\n=== EXAMINE FIRST TABLE ===")
t = doc.tables[0]
print(f"Table 0: {len(t.rows)} rows, {len(t.columns)} cols, style={t.style.name}")
for r in t.rows[:3]:
    cells_text = [c.text.strip() for c in r.cells]
    print("  Row:", cells_text[:5])
    # check first cell run font
    if r.cells[0].paragraphs and r.cells[0].paragraphs[0].runs:
        r0 = r.cells[0].paragraphs[0].runs[0]
        print(f"    Cell font: {r0.font.name}, sz={r0.font.size.pt if r0.font.size else 'None'}, b={r0.bold}")
