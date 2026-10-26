import docx

test_docx = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(test_docx)

domain_keywords = [
    "cloth", "apparel", "wear", "shirt", "tailor", "fashion", "shopping",
    "stylist", "skin tone", "skintone", "menswear", "boutique", "cart",
    "product", "inventory", "variant", "size recommendation", "elegance",
    "jazzmin", "stripe", "coupon", "dress", "garment", "fabric"
]

tech_mismatches = [
    "mysql", "django", "sqlite", "postgresql", "oracle", "python",
    "php", "laravel", "foreign key", "primary key", "rdbms"
]

flagged = []
for i, p in enumerate(doc.paragraphs):
    txt_lower = p.text.lower()
    for kw in domain_keywords + tech_mismatches:
        if kw in txt_lower:
            flagged.append((i, p.style.name, kw, p.text.strip()))
            break

print(f"Total flagged paragraphs remaining: {len(flagged)}")
for item in flagged:
    print(f"  P{item[0]:03d} [{item[1]}] ({item[2]}): {item[3][:90]}")

print("\nChecking Tables for Primary Key / Foreign Key SQL terms:")
flagged_cells = []
for t_idx, t in enumerate(doc.tables):
    for r_idx, r in enumerate(t.rows):
        for c_idx, c in enumerate(r.cells):
            c_txt = c.text.strip().replace('\n', ' ')
            if "PRIMARY KEY" in c_txt or "FOREIGN KEY" in c_txt:
                flagged_cells.append((t_idx, r_idx, c_idx, c_txt))

print(f"Tables with PRIMARY KEY or FOREIGN KEY remaining: {len(flagged_cells)}")
for fc in flagged_cells[:10]:
    print(f"  T{fc[0]} R{fc[1]} C{fc[2]}: {fc[3]}")

print("\nChecking Screenshot Placeholders in Document:")
placeholders = []
for i, p in enumerate(doc.paragraphs):
    if "Figure 6." in p.text:
        placeholders.append((i, p.text.strip()))

print(f"Total Figure 6 captions found: {len(placeholders)}")
for p_idx, cap in placeholders:
    print(f"  P{p_idx:03d}: {cap}")
