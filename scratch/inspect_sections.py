import docx

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

# Why are there 57 sections?
# In Word, section breaks (Continuous or Next Page) create sections.
print(f"Total sections: {len(doc.sections)}")
for i, s in enumerate(doc.sections[:10]):
    print(f"Section {i+1}: start_type={s.start_type}, orientation={s.orientation}, top={s.top_margin.inches:.2f}, left={s.left_margin.inches:.2f}, right={s.right_margin.inches:.2f}, bottom={s.bottom_margin.inches:.2f}")
