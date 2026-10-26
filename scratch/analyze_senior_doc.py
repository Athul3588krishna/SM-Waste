import os
import docx
from docx.shared import Inches, Pt

doc_path = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"

if not os.path.exists(doc_path):
    print(f"Error: File not found at {doc_path}")
    exit(1)

doc = docx.Document(doc_path)

print("=== SECTIONS & MARGINS ===")
for i, section in enumerate(doc.sections):
    print(f"Section {i+1}:")
    print(f"  Page Width: {section.page_width.inches if section.page_width else 'default'} in")
    print(f"  Page Height: {section.page_height.inches if section.page_height else 'default'} in")
    print(f"  Orientation: {section.orientation}")
    print(f"  Top Margin: {section.top_margin.inches if section.top_margin else 'default'} in")
    print(f"  Bottom Margin: {section.bottom_margin.inches if section.bottom_margin else 'default'} in")
    print(f"  Left Margin: {section.left_margin.inches if section.left_margin else 'default'} in")
    print(f"  Right Margin: {section.right_margin.inches if section.right_margin else 'default'} in")
    print(f"  Header Distance: {section.header_distance.inches if section.header_distance else 'default'} in")
    print(f"  Footer Distance: {section.footer_distance.inches if section.footer_distance else 'default'} in")
    print(f"  Different First Page: {section.different_first_page_header_footer}")

print("\n=== SAMPLE PARAGRAPHS & STYLES ===")
styles_seen = set()
for p in doc.paragraphs[:50]:
    if p.text.strip():
        runs_info = []
        for r in p.runs[:3]:
            font_name = r.font.name or (p.style.font.name if p.style and p.style.font else "Unknown")
            font_size = r.font.size.pt if r.font.size else (p.style.font.size.pt if p.style and p.style.font and p.style.font.size else "Unknown")
            runs_info.append(f"font={font_name}, size={font_size}, bold={r.bold}, italic={r.italic}")
        
        line_spacing = p.paragraph_format.line_spacing
        space_before = p.paragraph_format.space_before.pt if p.paragraph_format.space_before else 0
        space_after = p.paragraph_format.space_after.pt if p.paragraph_format.space_after else 0
        alignment = p.alignment

        text_snippet = p.text.strip()[:60]
        print(f"[{p.style.name}] (Align: {alignment}, LS: {line_spacing}, SB: {space_before}, SA: {space_after}) -> {text_snippet}")
        if runs_info:
            print(f"   Run: {runs_info[0]}")

print("\n=== DOCUMENT HEADINGS / STRUCTURE ===")
headings = []
for p in doc.paragraphs:
    txt = p.text.strip()
    if not txt:
        continue
    # Check if style is heading or paragraph looks like a heading
    if p.style.name.startswith("Heading") or (len(txt) < 80 and (p.runs and p.runs[0].bold)):
        headings.append((p.style.name, txt))

print(f"Total headings found: {len(headings)}")
for h_style, h_text in headings[:40]:
    print(f"  [{h_style}] {h_text}")

print(f"\nTotal paragraphs: {len(doc.paragraphs)}")
print(f"Total tables: {len(doc.tables)}")
