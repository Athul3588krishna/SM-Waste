import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print("=== PARAGRAPHS 0 to 115 ===")
for i in range(115):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        text = p.text.strip()
        print(f"P{i:03d} [{p.style.name}] (align={p.alignment}): {text}")
