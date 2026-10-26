import docx

doc_path = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(doc_path)

img_path = r"d:\Smart waste management\scratch\collection_placeholders\placeholder_users_collection.png"

# Test on table 2 (User table)
t2 = doc.tables[2]

new_p = doc.add_paragraph()
new_p.alignment = docx.enum.text.WD_ALIGN_PARAGRAPH.CENTER
run = new_p.add_run()
run.add_picture(img_path, width=docx.shared.Inches(5.6))

cap_p = doc.add_paragraph()
cap_p.alignment = docx.enum.text.WD_ALIGN_PARAGRAPH.CENTER
r_cap = cap_p.add_run("Figure 6.2: MongoDB Compass - Users Collection Document Schema View")
r_cap.font.name = "Times New Roman"
r_cap.font.size = docx.shared.Pt(11.0)
r_cap.italic = True
r_cap.bold = True

# Move in XML
t2._element.addnext(cap_p._element)
t2._element.addnext(new_p._element)

doc.save(r"d:\Smart waste management\scratch\test_img_insert.docx")
print("Successfully tested insert image after table!")
