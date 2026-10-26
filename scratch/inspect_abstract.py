import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(doc_path)

print("=== CHECKING ABSTRACT (P85 to P95) ===")
for i in range(84, 94):
    p = doc.paragraphs[i]
    print(f"P{i:03d} [{p.style.name}]: '{p.text}'")
