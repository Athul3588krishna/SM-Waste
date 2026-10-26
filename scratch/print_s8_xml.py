import docx
from xml.etree import ElementTree as ET

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

s8 = doc.sections[7]
print("=== Section 8 Header XML snippet ===")
print(s8.header._element.xml[:1500])

print("\n=== Section 8 Footer XML snippet ===")
print(s8.footer._element.xml[:1500])
