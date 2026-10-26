import docx
import shutil

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
desktop_docx = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"

doc = docx.Document(target_docx)

def set_p_clean(p, text, bold=None, italic=None, font_size=None, font_name="Times New Roman"):
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

p309_clean = "In the MERN stack architecture, the EcoClean system utilizes MongoDB, a modern distributed NoSQL document-oriented database. Unlike conventional relational databases (such as MySQL or Oracle) that mandate rigid table decomposition and multi-table relationships to structure entities, MongoDB stores data as flexible, self-contained JSON/BSON documents. This document paradigm allows related data—such as geographic coordinates, incident timestamps, and verification image payloads—to be co-located within the same document, eliminating expensive multi-table JOIN operations and dramatically accelerating read/write query performance."
set_p_clean(doc.paragraphs[309], p309_clean, font_size=12.0)

doc.save(target_docx)
shutil.copyfile(target_docx, desktop_docx)
print("Polished paragraph 309 and synchronized both files!")
