import docx
import shutil

desktop_docx = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
latest_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Latest.docx"

doc = docx.Document(desktop_docx)

# 1. Polish P309
p309_clean = "In the MERN stack architecture, the EcoClean system utilizes MongoDB, a modern distributed NoSQL document-oriented database. Unlike conventional relational database management systems that mandate rigid tabular structures and multi-table relationships to organize entities, MongoDB stores data as flexible, self-contained JSON/BSON documents. This document paradigm allows related data—such as geographic coordinates, incident timestamps, and verification image payloads—to be co-located within the same document, eliminating expensive multi-table JOIN operations and dramatically accelerating read/write query performance."
doc.paragraphs[309].text = p309_clean

# 2. Polish Table 2 and Table 11
doc.tables[2].rows[1].cells[1].text = "ObjectId (Unique Document ID, Index)"
doc.tables[11].rows[1].cells[1].text = "ObjectId (Unique Document ID, Index)"

doc.save(desktop_docx)
shutil.copyfile(desktop_docx, latest_docx)
print("Saved final polished files to Desktop and Latest!")
