from PIL import Image
import glob
import os

images = glob.glob(r"d:\Smart waste management\scratch\extracted_images\*")
for img_path in sorted(images):
    try:
        with Image.open(img_path) as im:
            print(f"{os.path.basename(img_path)}: format={im.format}, size={im.size}, mode={im.mode}")
    except Exception as e:
        print(f"Error {img_path}: {e}")
