import docx
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def create_toc_line(p, title, page_str, is_main=False, indent_twips=0):
    pPr = p._p.get_or_add_pPr()
    tabs = parse_xml(r'<w:tabs xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:tab w:val="right" w:leader="dot" w:pos="9700"/></w:tabs>')
    pPr.append(tabs)
    
    # spacing
    sp = parse_xml(f'<w:spacing xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:before="{"80" if is_main else "30"}" w:after="{"40" if is_main else "20"}" w:line="280" w:lineRule="auto"/>')
    pPr.append(sp)
    
    if indent_twips > 0:
        ind = parse_xml(f'<w:ind xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:left="{indent_twips}"/>')
        pPr.append(ind)
        
    r1 = p.add_run(title)
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(11.5 if is_main else 10.5)
    if is_main:
        r1.bold = True
        
    r2 = p.add_run()
    r2._element.append(parse_xml(r'<w:tab xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
    
    r3 = p.add_run(str(page_str))
    r3.font.name = "Times New Roman"
    r3.font.size = Pt(11.5 if is_main else 10.5)
    if is_main:
        r3.bold = True

def add_page_break(p):
    r = p.add_run()
    r._element.append(parse_xml(r'<w:br xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:type="page"/>'))

def style_cell(cell, text, bold=False, italic=False, size_pt=10, align=WD_ALIGN_PARAGRAPH.LEFT, bg_hex=None):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = align
    pPr = p._p.get_or_add_pPr()
    sp = parse_xml(r'<w:spacing xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:before="60" w:after="60" w:line="240" w:lineRule="auto"/>')
    pPr.append(sp)
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(size_pt)
    r.bold = bold
    r.italic = italic
    if bg_hex:
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:val="clear" w:color="auto" w:fill="{bg_hex}"/>')
        tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table):
    tblPr = table._tbl.tblPr
    borders = parse_xml(r'''
        <w:tblBorders xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:top w:val="single" w:sz="6" w:space="0" w:color="333333"/>
            <w:bottom w:val="single" w:sz="6" w:space="0" w:color="333333"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
            <w:insideV w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

print("Helper functions compiled successfully.")
