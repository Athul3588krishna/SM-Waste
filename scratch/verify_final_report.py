import docx
import zipfile

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

print(f"Total Paragraphs: {len(doc.paragraphs)}")
print(f"Total Tables: {len(doc.tables)}")

# Check for residual old strings
with zipfile.ZipFile(target_docx, 'r') as z:
    for fname in ["word/document.xml", "word/header1.xml", "word/footer1.xml"]:
        if fname in z.namelist():
            content = z.read(fname).decode('utf-8', errors='ignore')
            has_farzin = "FARZIN" in content.upper()
            has_tailored = "TAILORED" in content.upper()
            has_elegance = "ELEGANCE" in content.upper()
            print(f"File {fname}: has FARZIN={has_farzin}, has TAILORED={has_tailored}, has ELEGANCE={has_elegance}")

print("\nSample checks from document:")
print("P0:", doc.paragraphs[0].text)
print("P15:", doc.paragraphs[15].text)
print("P25:", doc.paragraphs[25].text)
print("P37:", doc.paragraphs[37].text[:90])
print("P45:", doc.paragraphs[45].text)
print("P55:", doc.paragraphs[55].text)
print("P84:", doc.paragraphs[84].text)
print("P112:", doc.paragraphs[112].text[:90])

print("\nTable 0 (Sprint 1) Sample Row 1:", [c.text.strip().replace('\n', ' ') for c in doc.tables[0].rows[1].cells])
print("Table 1 (Sprint 2) Sample Row 1:", [c.text.strip().replace('\n', ' ') for c in doc.tables[1].rows[1].cells])
print("Table 2 (User) Sample Row 1:", [c.text.strip().replace('\n', ' ') for c in doc.tables[2].rows[1].cells])
