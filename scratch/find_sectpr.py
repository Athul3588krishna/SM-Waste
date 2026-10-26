import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

# Find paragraphs that contain section break properties
sec_p_indices = []
for i, p in enumerate(doc.paragraphs):
    if p._element.xpath('.//w:sectPr'):
        sec_p_indices.append((i, p.text[:30]))

print(f"Paragraphs with sectPr: {len(sec_p_indices)}")
for idx, txt in sec_p_indices[:20]:
    print(f"P{idx:03d}: '{txt}'")
