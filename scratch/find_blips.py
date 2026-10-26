import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

for i, p in enumerate(doc.paragraphs):
    xml = p._element.xml
    if "w:drawing" in xml:
        # find blip r:embed
        import xml.etree.ElementTree as ET
        root = ET.fromstring(xml)
        blips = root.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
        rids = [b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') for b in blips]
        print(f"P{i:03d} drawing with r:embed={rids}")
