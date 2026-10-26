import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

for i in [0, 1, 5, 6, 7, 8, 9, 10, 20]:
    if i < len(doc.sections):
        s = doc.sections[i]
        f_xml = s.footer._element.xml
        h_xml = s.header._element.xml
        print(f"--- Section {i+1} Footer XML length: {len(f_xml)}, Header XML length: {len(h_xml)} ---")
        if "w:fldSimple" in f_xml or "w:instrText" in f_xml or "PAGE" in f_xml:
            print(f"  Page number found in section {i+1} footer!")
            print(f_xml[:500])
