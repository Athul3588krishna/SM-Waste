import docx

def doc_stats(path):
    d = docx.Document(path)
    word_count = sum(len(p.text.split()) for p in d.paragraphs)
    for t in d.tables:
        for r in t.rows:
            for c in r.cells:
                word_count += len(c.text.split())
    paras = len(d.paragraphs)
    tables = len(d.tables)
    sections = len(d.sections)
    return word_count, paras, tables, sections

f_words, f_paras, f_tables, f_secs = doc_stats(r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx")
a_words, a_paras, a_tables, a_secs = doc_stats(r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx")

print(f"Farzin Doc: {f_words} words, {f_paras} paragraphs, {f_tables} tables, {f_secs} sections")
print(f"Athul Doc:  {a_words} words, {a_paras} paragraphs, {a_tables} tables, {a_secs} sections")
