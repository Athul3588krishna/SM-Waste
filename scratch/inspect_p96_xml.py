import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print("P096 XML length:", len(doc.paragraphs[96]._element.xml))
print("P096 XML snippet:\n", doc.paragraphs[96]._element.xml[:1000])
