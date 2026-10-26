import docx

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

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

print("=== CHECKING PARAGRAPHS ===")
flagged_paras = []
for i, p in enumerate(doc.paragraphs):
    txt_lower = p.text.lower()
    for kw in domain_keywords + tech_mismatches:
        if kw in txt_lower:
            flagged_paras.append((i, p.style.name, kw, p.text.strip()))
            break

print(f"Total flagged paragraphs: {len(flagged_paras)}")
for idx, style, kw, txt in flagged_paras:
    print(f"P{idx:03d} [{style}] ({kw}): {txt[:100]}")

print("\n=== CHECKING TABLES ===")
flagged_table_cells = []
for t_idx, t in enumerate(doc.tables):
    for r_idx, r in enumerate(t.rows):
        for c_idx, c in enumerate(r.cells):
            c_lower = c.text.lower()
            for kw in domain_keywords + tech_mismatches:
                if kw in c_lower:
                    flagged_table_cells.append((t_idx, r_idx, c_idx, kw, c.text.strip().replace('\n', ' ')))
                    break

print(f"Total flagged table cells: {len(flagged_table_cells)}")
for t_idx, r_idx, c_idx, kw, txt in flagged_table_cells[:30]:
    print(f"Table {t_idx} [R{r_idx}C{c_idx}] ({kw}): {txt[:80]}")
