import docx
import os

doc_path = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(doc_path)

print(f"Total Paragraphs: {len(doc.paragraphs)}")
print(f"Total Tables: {len(doc.tables)}")
print(f"Total Sections: {len(doc.sections)}")

# 1. Check all Figures and Captions in Document
figures = []
for i, p in enumerate(doc.paragraphs):
    has_drawing = "w:drawing" in p._element.xml
    txt = p.text.strip()
    if has_drawing or "Figure" in txt or "Fig" in txt or "PLACEHOLDER" in txt.upper():
        figures.append((i, has_drawing, txt))

print(f"\n=== ALL FIGURES & PLACEHOLDERS ({len(figures)}) ===")
for p_idx, has_draw, txt in figures:
    print(f"P{p_idx:03d} (drawing={has_draw}): '{txt}'")

# 2. Check all Chapters Headings
print("\n=== CHAPTER HEADINGS CHECK ===")
for i, p in enumerate(doc.paragraphs):
    if p.style.name in ["Heading 1", "Heading 2", "Heading 3", "Heading 4"]:
        txt = p.text.strip()
        if txt:
            print(f"P{i:03d} [{p.style.name}]: {txt}")

# 3. Check for any Non-MERN / Legacy terms
prohibited_words = [
    "django", "mysql", "sqlite", "postgresql", "oracle", "php", "laravel",
    "tailored", "elegance", "farzin", "menswear", "boutique", "apparel",
    "clothing", "virtual try-on", "avatar", "fake review", "product variant",
    "primary key", "foreign key", "1nf", "2nf", "3nf", "bcnf", "4nf"
]

violations = []
for i, p in enumerate(doc.paragraphs):
    txt_lower = p.text.lower()
    for w in prohibited_words:
        if w in txt_lower:
            # Check context: if it's "unlike conventional relational databases (such as MySQL...)"
            if w == "mysql" and "unlike" in txt_lower:
                continue
            violations.append((i, w, p.text.strip()[:80]))

print(f"\n=== PROHIBITED / MISMATHCED TERMS IN PARAGRAPHS ({len(violations)}) ===")
for v in violations:
    print(f"P{v[0]:03d} [{v[1]}]: {v[2]}")

# 4. Check Tables for Prohibited Terms
table_violations = []
for t_idx, t in enumerate(doc.tables):
    for r_idx, r in enumerate(t.rows):
        for c_idx, c in enumerate(r.cells):
            c_lower = c.text.lower()
            for w in prohibited_words:
                if w in c_lower:
                    table_violations.append((t_idx, r_idx, c_idx, w, c.text.strip()[:50]))

print(f"\n=== PROHIBITED TERMS IN TABLES ({len(table_violations)}) ===")
for tv in table_violations:
    print(f"Table {tv[0]} R{tv[1]} C{tv[2]} [{tv[3]}]: {tv[4]}")
