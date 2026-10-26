import docx
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def test_script():
    doc = docx.Document(r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx")
    print("Original paragraph count:", len(doc.paragraphs))
    print("Original table count:", len(doc.tables))
    
    # 1. Test locating Certificate and Acknowledgements
    ack_idx = None
    for i, p in enumerate(doc.paragraphs):
        if "ACKNOWLEDGEMENT" in p.text.upper():
            ack_idx = i
            break
    print(f"Acknowledgements found at paragraph {ack_idx}: {doc.paragraphs[ack_idx].text}")

    # 2. Test locating CONTENTS
    toc_idx = None
    for i, p in enumerate(doc.paragraphs):
        if p.text.strip() == "CONTENTS":
            toc_idx = i
            break
    print(f"CONTENTS found at paragraph {toc_idx}")

    # 3. Test locating INTRODUCTION
    intro_indices = [i for i, p in enumerate(doc.paragraphs) if p.text.strip() == "INTRODUCTION"]
    print(f"INTRODUCTION found at paragraphs: {intro_indices}")

    # 4. Test locating TESTING
    test_idx = None
    for i, p in enumerate(doc.paragraphs):
        if "SYSTEM TESTING AND IMPLEMENTATION" in p.text:
            test_idx = i
            break
    print(f"Testing found at paragraph {test_idx}")

test_script()
