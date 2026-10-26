import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)
s8 = doc.sections[7]

import xml.etree.ElementTree as ET

root_h = ET.fromstring(s8.header._element.xml)
print("Header texts:")
for elem in root_h.iter():
    if elem.text and elem.text.strip():
        print(f"  <{elem.tag}>: {elem.text.strip()}")

root_f = ET.fromstring(s8.footer._element.xml)
print("\nFooter texts:")
for elem in root_f.iter():
    if elem.text and elem.text.strip():
        print(f"  <{elem.tag}>: {elem.text.strip()}")
