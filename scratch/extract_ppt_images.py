import pptx
import os

ppt_path = r"d:\Smart waste management\EcoClean_Evaluation1_Presentation_Final.pptx"
prs = pptx.Presentation(ppt_path)

output_dir = r"d:\Smart waste management\scratch\ppt_images"
os.makedirs(output_dir, exist_ok=True)

img_count = 0
for slide in prs.slides:
    for shape in slide.shapes:
        if shape.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.PICTURE:
            img = shape.image
            save_path = os.path.join(output_dir, f"ppt_img_{img_count}.{img.ext}")
            with open(save_path, "wb") as f:
                f.write(img.blob)
            print(f"Extracted PPT image: {save_path} ({len(img.blob)} bytes)")
            img_count += 1

print(f"Total PPT images: {img_count}")
