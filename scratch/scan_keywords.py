import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

keywords = ["tailored", "elegance", "farzin", "django", "mysql", "bootstrap", "scikit"]
found = []
for i, p in enumerate(doc.paragraphs):
    txt_lower = p.text.lower()
    for kw in keywords:
        if kw in txt_lower:
            found.append((i, p.style.name, kw, p.text.strip()))
            break

print(f"Total keyword occurrences found: {len(found)}")
for item in found:
    print(f"P{item[0]:03d} [{item[1]}] ('{item[2]}'): {item[3][:90]}")
