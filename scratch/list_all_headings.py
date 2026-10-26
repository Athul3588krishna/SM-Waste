import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print("=== ALL HEADINGS & THEIR PARAGRAPH INDEXES ===")
for i, p in enumerate(doc.paragraphs):
    txt = p.text.strip()
    if not txt:
        continue
    if p.style.name.startswith("Heading"):
        print(f"P{i:03d} [{p.style.name}] (Align: {p.alignment}): {txt}")
