import docx
import zipfile
import shutil
import os

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

def clean_paragraph_xml(p, text, font_size=11.0, bold=False):
    # Keep only pPr
    p_elem = p._element
    pPr = p_elem.pPr
    for child in list(p_elem):
        if child != pPr:
            p_elem.remove(child)
    # Add clean run
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = docx.shared.Pt(font_size)
    r.bold = bold

clean_paragraph_xml(doc.paragraphs[766], "https://nodejs.org/en/docs/ - Official Node.js Documentation")
clean_paragraph_xml(doc.paragraphs[768], "https://expressjs.com/ - Express Web Application Framework for Node.js")
clean_paragraph_xml(doc.paragraphs[770], "https://react.dev/ - React Official Documentation and Reference")
clean_paragraph_xml(doc.paragraphs[771], "https://www.mongodb.com/docs/ - MongoDB Database Reference and Mongoose ODM")
clean_paragraph_xml(doc.paragraphs[773], "https://leafletjs.com/reference.html - Leaflet JavaScript Library for Interactive Maps")

doc.save(target_docx)
print("Cleaned hyperlink XML and updated docx!")

# Copy to Desktop
desktop_target = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
shutil.copyfile(target_docx, desktop_target)
print("Copied to Desktop successfully!")
