import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

for i, p in enumerate(doc.paragraphs):
    # Check if paragraph has drawing or image
    has_drawing = "w:drawing" in p._element.xml or "w:pict" in p._element.xml
    txt = p.text.strip()
    if has_drawing or "Figure" in txt or "Fig" in txt or "Diagram" in txt:
        print(f"P{i:03d} (has_drawing={has_drawing}): '{txt}'")
