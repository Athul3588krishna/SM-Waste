import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

chapters = [
    ("Title Page", 0, 25),
    ("Certificate", 26, 64),
    ("Acknowledgement", 65, 85),
    ("Abstract", 86, 92),
    ("Contents", 93, 107),
    ("Chapter 1: Introduction", 108, 125),
    ("Chapter 2: System Analysis", 126, 197),
    ("Chapter 3: Feasibility Study", 198, 236),
    ("Chapter 4: Software Eng Paradigm", 237, 257),
    ("Chapter 5: SRS", 258, 297),
    ("Chapter 6: System Design", 298, 500),
    ("Chapter 7: System Development", 501, 554),
    ("Chapter 8: Testing & Implementation", 555, 614),
    ("Chapter 9: System Maintenance", 615, 638),
    ("Chapter 10: Future Enhancement", 639, 672),
    ("Chapter 11: Conclusion", 673, 692),
    ("Chapter 12: Appendix", 693, 754),
    ("Chapter 13: Bibliography", 755, len(doc.paragraphs))
]

for name, start, end in chapters:
    p_non_empty = [p.text.strip() for p in doc.paragraphs[start:end] if p.text.strip()]
    print(f"{name} (P{start:03d}-P{end:03d}): {len(p_non_empty)} non-empty paragraphs")
    for sample in p_non_empty[:3]:
        print(f"    - {sample[:80]}")
