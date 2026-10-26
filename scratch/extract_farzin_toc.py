import docx
import xml.etree.ElementTree as ET

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

# Let's inspect P093 to P108 in Farzin's docx
for i in range(93, 108):
    p = doc.paragraphs[i]
    xml = p._element.xml
    # find all w:t
    root = ET.fromstring(xml)
    texts = [e.text for e in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if e.text]
    print(f"P{i:03d} [{p.style.name}]: {' '.join(texts)}")
