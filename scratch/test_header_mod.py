import zipfile
import re
import os
import shutil

def update_docx_header(docx_file, old_str1, old_str2, new_str):
    temp_dir = docx_file + "_temp_zip"
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
        
    with zipfile.ZipFile(docx_file, 'r') as zin:
        zin.extractall(temp_dir)
        
    header_path = os.path.join(temp_dir, 'word', 'header1.xml')
    if os.path.exists(header_path):
        with open(header_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace occurrences of TAILORED and ELEGANCE
        # In header1.xml, it had <w:t>TAILORED</w:t> and <w:t>ELEGANCE</w:t>
        content = content.replace(f">{old_str1}<", f">{new_str}<")
        content = content.replace(f">{old_str2}<", f"><")
        
        with open(header_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated header1.xml successfully!")

    # Repack zip
    os.remove(docx_file)
    shutil.make_archive(docx_file.replace('.docx', ''), 'zip', temp_dir)
    shutil.move(docx_file.replace('.docx', '') + '.zip', docx_file)
    shutil.rmtree(temp_dir)
    print("Rebuilt docx archive successfully!")

update_docx_header(r"d:\Smart waste management\scratch\test_copy.docx", "TAILORED", "ELEGANCE", "ECOCLEAN")
