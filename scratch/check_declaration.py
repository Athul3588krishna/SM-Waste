import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print("Checking paragraphs 30 to 70 for DECLARATION:")
for i in range(30, 70):
    p = doc.paragraphs[i]
    if "DECLAR" in p.text.upper():
        print(f"Found DECLARATION at P{i:03d}: {p.text}")
