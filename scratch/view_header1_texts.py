with open(r"d:\Smart waste management\scratch\docx_unzipped\word\header1.xml", "r", encoding="utf-8") as f:
    text = f.read()

import re
matches = re.findall(r"<w:t[^>]*>([^<]+)</w:t>", text)
print("Header1 texts:", matches)
