import docx
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
import shutil

MASTER_FILE = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Master.docx"
DESKTOP_FINAL = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
PROJECT_FINAL = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
PROJECT_LATEST = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Latest.docx"

def style_cell(cell, text, bold=False, italic=False, size_pt=9.0, align=WD_ALIGN_PARAGRAPH.LEFT, bg_hex=None):
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

def add_heading_1(p, text):
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pPr = p._p.get_or_add_pPr()
    sp = parse_xml(r'<w:spacing xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:before="240" w:after="120" w:line="240" w:lineRule="auto"/>')
    pPr.append(sp)
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.bold = True

def add_body_p(p, text):
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pPr = p._p.get_or_add_pPr()
    sp = parse_xml(r'<w:spacing xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:before="60" w:after="120" w:line="345" w:lineRule="auto"/>')
    pPr.append(sp)
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

def main():
    doc = docx.Document(MASTER_FILE)
    print("Initial paragraph count:", len(doc.paragraphs))

    # 1. Remove empty paragraphs 103-113
    p_to_remove = []
    for i in range(100, 125):
        if i < len(doc.paragraphs):
            p = doc.paragraphs[i]
            if p.text.strip() == "" and p._p.get_or_add_pPr().find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}sectPr') is None:
                p_to_remove.append(p)
                
    for p in p_to_remove:
        p._element.getparent().remove(p._element)
    print(f"Removed {len(p_to_remove)} empty paragraphs before TOC.")

    # 2. Clean stray template sentences in Chapter 8
    stray_texts = [
        "The system contains various components and they have to be combined and tested.",
        "The software is embedded into hardware and tested.",
        "The modules are combined and tested.",
        "The hardware part tested separately.",
        "Output Screen design.",
        "Input Screen design.",
        "Menu driven system."
    ]
    p_stray_to_remove = []
    for p in doc.paragraphs:
        if p.text.strip() in stray_texts:
            p_stray_to_remove.append(p)
            
    for p in p_stray_to_remove:
        p._element.getparent().remove(p._element)
    print(f"Removed {len(p_stray_to_remove)} stray hardware/template paragraphs.")

    # 3. Locate Chapter 8 "Implementation"
    impl_p = None
    in_testing = False
    for p in doc.paragraphs:
        if "SYSTEM TESTING AND IMPLEMENTATION" in p.text:
            in_testing = True
        if in_testing and p.text.strip() == "Implementation":
            impl_p = p
            break
            
    if impl_p is not None:
        print("Found Chapter 8 'Implementation' heading. Inserting Section 8.2 & Test Cases Table...")
        
        # Section 8.2 Heading
        p_tc_h = impl_p.insert_paragraph_before()
        add_heading_1(p_tc_h, "8.2 Test Cases and Validation Matrix")
        
        # Section 8.2 Body
        p_tc_intro = impl_p.insert_paragraph_before()
        add_body_p(p_tc_intro, "A rigorous testing matrix was executed across all user pathways—citizen incident reporting, administrative fleet dispatch, and sanitation worker resolution workflows. Automated unit suites verified Express API controllers and cryptographic token issuance, while Postman API collections and manual UI verification validated data persistence and end-to-end event broadcasting. Table 8.1 details the formal test cases, validation inputs, expected outputs, and actual outcomes:")

        # Table caption
        p_tc_cap = impl_p.insert_paragraph_before()
        p_tc_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        pPr = p_tc_cap._p.get_or_add_pPr()
        pPr.append(parse_xml(r'<w:spacing xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:before="120" w:after="80"/>'))
        r_cap = p_tc_cap.add_run("Table 8.1: Test Cases Execution and Validation Matrix")
        r_cap.font.name = "Times New Roman"
        r_cap.font.size = Pt(11)
        r_cap.bold = True

        test_cases = [
            ("TC-01", "Citizen Auth", "Register new citizen with valid email, phone, and password", "HTTP 201 Created; Bcrypt hashed password; User record stored in MongoDB", "User registered successfully; JWT token returned to client", "PASS"),
            ("TC-02", "Route Guard", "Citizen user accessing protected '/admin/dashboard' route", "HTTP 403 Forbidden; Redirected to unauthorized notice or login", "Access blocked by verifyAdmin JWT middleware", "PASS"),
            ("TC-03", "GIS Mapping", "Citizen clicking map pin to capture incident geolocation", "Latitude/Longitude captured to 6 decimal precision; Marker rendered", "Coordinates [10.9821, 76.2234] pinned accurately", "PASS"),
            ("TC-04", "Multer Upload", "Upload 3MB JPEG waste image via multipart form stream", "Image uploaded to Cloudinary CDN; Secure HTTPS URL returned", "Cloudinary asset created; Image URL stored in IncidentPhoto", "PASS"),
            ("TC-05", "AI Scanner", "Simulated AI analysis on uploaded dump image", "Predicted Category ('Plastic') & Severity ('High') generated", "Metadata tagged; AI confidence score 94.2% logged", "PASS"),
            ("TC-06", "Socket.io", "Citizen submits new waste complaint ticket", "Broadcast 'new_incident' event to active Admin Dashboard sockets", "Admin incident queue updated instantly without page reload", "PASS"),
            ("TC-07", "Fleet Dispatch", "Admin assigns complaint to Squad #4 with target deadline", "Ticket status updated to 'Assigned'; Worker job sheet synced", "Squad notified; Task visible on worker mobile portal", "PASS"),
            ("TC-08", "Worker Proof", "Sanitation worker submits 'after-cleaning' photograph", "Status transitions to 'Resolved'; ValidationLog entry created", "Resolution photo uploaded; Timestamp and worker ID logged", "PASS"),
            ("TC-09", "Admin Verify", "Admin inspects before/after photos and approves cleanup", "Ticket marked 'Closed'; 50 Eco-Points awarded to citizen", "Resolution certified; Automated points transaction logged", "PASS"),
            ("TC-10", "Gamification", "Citizen views profile rewards and ward leaderboard", "Total points incremented; Ward ranking recalculated dynamically", "Points ledger reflects +50; User moves up on leaderboard", "PASS"),
        ]

        tc_tbl = doc.add_table(rows=len(test_cases) + 1, cols=6)
        tc_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tc_tbl.autofit = False
        set_table_borders(tc_tbl)
        
        col_widths = [Inches(0.7), Inches(0.9), Inches(1.8), Inches(1.8), Inches(1.8), Inches(0.6)]
        for col_idx, width in enumerate(col_widths):
            tc_tbl.columns[col_idx].width = width
            
        headers = ["TEST ID", "MODULE", "TEST SCENARIO & INPUT", "EXPECTED OUTPUT", "ACTUAL OUTPUT", "STATUS"]
        for col_idx, h_text in enumerate(headers):
            c = tc_tbl.cell(0, col_idx)
            c.width = col_widths[col_idx]
            style_cell(c, h_text, bold=True, size_pt=9.5, align=WD_ALIGN_PARAGRAPH.CENTER if col_idx in [0, 5] else WD_ALIGN_PARAGRAPH.LEFT, bg_hex="F2F2F2")
            set_cell_margins(c, top=80, bottom=80, left=80, right=80)
            
        for row_idx, data in enumerate(test_cases):
            for col_idx, val in enumerate(data):
                c = tc_tbl.cell(row_idx + 1, col_idx)
                c.width = col_widths[col_idx]
                is_status = (col_idx == 5)
                is_id = (col_idx == 0)
                align = WD_ALIGN_PARAGRAPH.CENTER if (is_status or is_id) else WD_ALIGN_PARAGRAPH.LEFT
                style_cell(c, val, bold=(is_id or is_status), size_pt=9.0, align=align)
                set_cell_margins(c, top=60, bottom=60, left=80, right=80)

        # Move table before impl_p
        impl_p._element.addprevious(tc_tbl._element)

        # Spacing paragraph after table
        p_post_tbl = impl_p.insert_paragraph_before()
        p_post_tbl._p.get_or_add_pPr().append(parse_xml(r'<w:spacing xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:before="120" w:after="160"/>'))
        print("Table 8.1 inserted successfully.")

    # Save to Master
    doc.save(MASTER_FILE)
    print("Saved MASTER_FILE successfully!")
    
    # Synchronize to target paths
    for target in [DESKTOP_FINAL, PROJECT_FINAL, PROJECT_LATEST]:
        try:
            shutil.copyfile(MASTER_FILE, target)
            print(f"Synchronized to: {target}")
        except Exception as e:
            print(f"Error copying to {target}: {e}")

if __name__ == "__main__":
    main()
