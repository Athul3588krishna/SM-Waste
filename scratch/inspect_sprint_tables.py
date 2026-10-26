import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

t1 = doc.tables[0]
print("T1 rows:", len(t1.rows), "cols:", len(t1.columns))
print("T1 headers:", [c.text.strip().replace('\n', ' ') for c in t1.rows[0].cells])
print("T1 row 1:", [c.text.strip().replace('\n', ' ') for c in t1.rows[1].cells])

t2 = doc.tables[1]
print("T2 rows:", len(t2.rows), "cols:", len(t2.columns))
print("T2 headers:", [c.text.strip().replace('\n', ' ') for c in t2.rows[0].cells])
print("T2 row 1:", [c.text.strip().replace('\n', ' ') for c in t2.rows[1].cells])
