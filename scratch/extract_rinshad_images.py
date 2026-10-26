import docx
import os

doc_path = r"d:\Smart waste management\EcoClean_Project_Report_Final.docx"
doc = docx.Document(doc_path)

output_dir = r"d:\Smart waste management\scratch\rinshad_extracted_images"
os.makedirs(output_dir, exist_ok=True)

img_count = 0
for rel in doc.part.rels.values():
    if "image" in rel.target_ref:
        img_part = rel.target_part
        img_filename = os.path.basename(rel.target_ref)
        save_path = os.path.join(output_dir, f"ecoclean_img_{img_count}_{img_filename}")
        with open(save_path, "wb") as f:
            f.write(img_part.blob)
        print(f"Extracted: {save_path} ({len(img_part.blob)} bytes)")
        img_count += 1

print(f"Total extracted EcoClean images: {img_count}")
