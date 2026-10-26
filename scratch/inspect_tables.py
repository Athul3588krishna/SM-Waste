import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

for idx, t in enumerate(doc.tables):
    # find preceding paragraph to see table name/caption
    tbl_elem = t._element
    prev = tbl_elem.getprevious()
    prev_txt = ""
    while prev is not None and prev.tag.endswith('p'):
        p_obj = docx.text.paragraph.Paragraph(prev, doc)
        if p_obj.text.strip():
            prev_txt = p_obj.text.strip()
            break
        prev = prev.getprevious()
    
    headers = [c.text.strip() for c in t.rows[0].cells]
    print(f"Table {idx+1}: Prev Text='{prev_txt}' | Rows={len(t.rows)}, Cols={len(t.columns)} | Headers={headers[:4]}")
