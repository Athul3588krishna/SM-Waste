import docx
from docx.oxml import parse_xml

doc = docx.Document()
p = doc.add_paragraph()
pPr = p._element.get_or_add_pPr()
pPr.append(parse_xml('<w:tabs xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:tab w:val="right" w:leader="dot" w:pos="9700"/></w:tabs>'))
r1 = p.add_run('1. INTRODUCTION')
r2 = p.add_run()
r2._element.append(parse_xml('<w:tab xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
r3 = p.add_run('1')
print(p._element.xml)
doc.save('scratch/test_tab.docx')
print('Saved test_tab.docx successfully!')
