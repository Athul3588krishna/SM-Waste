import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

t0 = doc.tables[0]
print("Table 0 style:", t0.style.name)
print("Table 0 alignment:", t0.alignment)
print("Table 0 rows count:", len(t0.rows))

# Inspect first cell formatting
c0 = t0.rows[0].cells[0]
print("Cell 0,0 text:", c0.text)
if c0.paragraphs:
    p = c0.paragraphs[0]
    print(f"P style: {p.style.name}, align: {p.alignment}")
    if p.runs:
        r = p.runs[0]
        print(f"Run font: {r.font.name}, sz: {r.font.size.pt if r.font.size else None}, bold: {r.bold}")

# Inspect second row first cell formatting
c1 = t0.rows[1].cells[0]
print("Cell 1,0 text:", c1.text)
if c1.paragraphs:
    p = c1.paragraphs[0]
    print(f"P style: {p.style.name}, align: {p.alignment}")
    if p.runs:
        r = p.runs[0]
        print(f"Run font: {r.font.name}, sz: {r.font.size.pt if r.font.size else None}, bold: {r.bold}")
