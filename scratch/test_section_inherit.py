import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print("Section 8 header text elements:")
print(doc.sections[7].header._element.xml[:300])

# If we add a paragraph in doc, does it work?
p = doc.add_paragraph("Test Paragraph at end", style="Body Text")
print("Added paragraph style:", p.style.name)
