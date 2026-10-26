import docx
import os

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
doc = docx.Document(doc_path)

output_dir = r"d:\Smart waste management\scratch\extracted_images"
os.makedirs(output_dir, exist_ok=True)

img_count = 0
for rel in doc.part.rels.values():
    if "image" in rel.target_ref:
        img_part = rel.target_part
        img_filename = os.path.basename(rel.target_ref)
        save_path = os.path.join(output_dir, f"img_{img_count}_{img_filename}")
        with open(save_path, "wb") as f:
            f.write(img_part.blob)
        print(f"Extracted: {save_path} ({len(img_part.blob)} bytes)")
        img_count += 1

print(f"Total extracted images: {img_count}")
