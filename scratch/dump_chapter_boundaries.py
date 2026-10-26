import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

print(f"Total Paragraphs: {len(doc.paragraphs)}")
print(f"Total Tables: {len(doc.tables)}")

current_chapter = "FRONT MATTER"
for i, p in enumerate(doc.paragraphs):
    txt = p.text.strip()
    if p.style.name in ["Heading 1", "Heading 2", "Heading 3", "Heading 4"]:
        if any(w in txt.upper() for w in ["INTRODUCTION", "ANALYSIS", "FEASIBILITY", "PARADIGM", "REQUIREMENT", "DESIGN", "DEVELOPMENT", "TESTING", "MAINTENANCE", "FUTURE", "CONCLUSION", "APPENDIX", "BIBLIOGRAPHY", "CONTENTS", "ABSTRACT"]):
            print(f"P{i:03d} [{p.style.name}]: {txt}")
