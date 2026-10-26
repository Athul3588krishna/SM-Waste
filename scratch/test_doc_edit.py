import docx
import shutil

src = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
dst = r"d:\Smart waste management\scratch\test_copy.docx"
shutil.copyfile(src, dst)

doc = docx.Document(dst)
print("Original paragraphs count:", len(doc.paragraphs))
print("P0 text before:", doc.paragraphs[0].text)

# Replace P0 text
p0 = doc.paragraphs[0]
for r in p0.runs:
    r.text = ""
p0.runs[0].text = "ECOCLEAN: SMART WASTE REPORTING AND MANAGEMENT SYSTEM"

doc.save(dst)

# Re-open and verify
doc2 = docx.Document(dst)
print("P0 text after:", doc2.paragraphs[0].text)
