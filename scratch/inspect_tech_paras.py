import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(doc_path)

print("P270 (SRS Libraries):", doc.paragraphs[270].text)
print("\nChapter 7 Libraries (P523-P545):")
for i in range(523, 546):
    p = doc.paragraphs[i]
    if p.text.strip():
        print(f"P{i:03d} [{p.style.name}]: {p.text[:70]}")
