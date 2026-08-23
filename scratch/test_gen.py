import subprocess
import os

html_content = """<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@page { size: A4 portrait; margin: 0; }
*, *:before, *:after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; background: white; font-size: 12pt; }
.page { width: 210mm; height: 296.8mm; padding: 25mm 20mm 25mm 25mm; position: relative; page-break-after: always; break-after: page; overflow: hidden; }
.page:last-child { page-break-after: auto; break-after: auto; }
.header { position: absolute; top: 12mm; left: 25mm; right: 20mm; display: flex; justify-content: space-between; font-size: 11pt; font-style: italic; border-bottom: 1px solid #000; padding-bottom: 3px; }
.footer { position: absolute; bottom: 12mm; left: 25mm; right: 20mm; display: flex; justify-content: space-between; font-size: 11pt; font-style: italic; border-top: 1px solid #000; padding-top: 3px; }
.content { margin-top: 5mm; }
</style></head><body><div class="page"><div class="header"><span>EcoClean System</span><span>1</span></div><div class="content"><h1>Page 1 Content</h1><p>This is a test of page 1.</p></div><div class="footer"><span>Department of Computer Applications</span><span>MEA Engineering College</span></div></div><div class="page"><div class="header"><span>EcoClean System</span><span>2</span></div><div class="content"><h1>Page 2 Content</h1><p>This is a test of page 2.</p></div><div class="footer"><span>Department of Computer Applications</span><span>MEA Engineering College</span></div></div></body></html>"""

os.makedirs('scratch', exist_ok=True)
html_file = os.path.abspath('scratch/test_pages.html')
pdf_file = os.path.abspath('scratch/test_pages.pdf')

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
subprocess.run([edge_path, '--headless', f'--print-to-pdf={pdf_file}', '--no-pdf-header-footer', html_file])

with open(pdf_file, 'rb') as f:
    data = f.read()
    print('Page count estimate:', data.count(b'/Type /Page'))
