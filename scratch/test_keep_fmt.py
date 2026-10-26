import docx

doc_path = r"d:\Smart waste management\scratch\test_copy.docx"
doc = docx.Document(doc_path)

def set_p_text_keep_formatting(p, text, bold=None, italic=None, font_size=None, font_name=None):
    if not p.runs:
        r = p.add_run(text)
    else:
        p.runs[0].text = text
        for r in p.runs[1:]:
            r.text = ""
        r = p.runs[0]
        
    if bold is not None:
        r.bold = bold
    if italic is not None:
        r.italic = italic
    if font_size is not None:
        r.font.size = docx.shared.Pt(font_size)
    if font_name is not None:
        r.font.name = font_name

p = doc.paragraphs[112] # Body text of intro
print("Before:", p.text[:50], "Style:", p.style.name, "Align:", p.alignment)
set_p_text_keep_formatting(p, "Solid waste management represents a critical environmental challenge...")
print("After:", p.text[:50], "Style:", p.style.name, "Align:", p.alignment)
print("Run font:", p.runs[0].font.name, "Run size:", p.runs[0].font.size.pt if p.runs[0].font.size else "inherited")
