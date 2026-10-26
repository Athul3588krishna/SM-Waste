import docx
import os
import zipfile
import shutil

src_file = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
extract_dir = r"d:\Smart waste management\scratch\docx_unzipped"

if os.path.exists(extract_dir):
    shutil.rmtree(extract_dir)

with zipfile.ZipFile(src_file, 'r') as zip_ref:
    zip_ref.extractall(extract_dir)

print("Extracted docx archive!")

# Search for "TAILORED" or "FARZIN" in all xml files
matches = []
for root, dirs, files in os.walk(extract_dir):
    for f in files:
        if f.endswith(".xml"):
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8", errors="ignore") as fp:
                content = fp.read()
                if "TAILORED" in content or "FARZIN" in content:
                    matches.append((fpath, "TAILORED" in content, "FARZIN" in content))

for m in matches:
    print(f"File: {os.path.relpath(m[0], extract_dir)} | Has TAILORED: {m[1]} | Has FARZIN: {m[2]}")
