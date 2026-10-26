import xml.etree.ElementTree as ET

rels_path = r"d:\Smart waste management\scratch\docx_unzipped\word\_rels\document.xml.rels"
tree = ET.parse(rels_path)
root = tree.getroot()

for r in root:
    r_id = r.attrib.get('Id')
    r_type = r.attrib.get('Type')
    r_target = r.attrib.get('Target')
    if "image" in r_type:
        print(f"Rel {r_id}: target={r_target}")
