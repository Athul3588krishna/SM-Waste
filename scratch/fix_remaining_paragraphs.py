import docx
import zipfile
import os
import shutil

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
doc = docx.Document(target_docx)

def set_p_clean(p, text, bold=None, italic=None, font_size=None, font_name="Times New Roman"):
    if not p.runs:
        r = p.add_run(text)
    else:
        p.runs[0].text = text
        for r in p.runs[1:]:
            r.text = ""
        r = p.runs[0]
    if bold is not None:
        r.bold = bold
    if italic is not None:
        r.italic = italic
    if font_size is not None:
        r.font.size = docx.shared.Pt(font_size)
    if font_name is not None:
        r.font.name = font_name

# Fix P212
p212_text = "EcoClean is engineered for high operational usability across all user groups. Citizens require no specialized training because dropping a map pin and snapping a photo mirrors familiar consumer mobile apps. Sanitation field workers utilize touch-friendly job cards, and municipal administrators monitor operations seamlessly through an interactive map dashboard."
set_p_clean(doc.paragraphs[212], p212_text, font_size=12.0)

# Fix P306 (Database Design intro)
p306_text = "Database design is the systematic process of organizing and structuring data to ensure integrity, consistency, and rapid spatial query performance. In the EcoClean project, the database plays a pivotal role in managing core entities such as users, municipal wards, waste dump complaints, sanitation teams, and before/after verification logs. The architecture utilizes MongoDB, a robust document-oriented NoSQL database system, paired with Mongoose ODM in Node.js. Mongoose provides schema validation, type constraints, and virtual population hooks instead of raw manual queries. Core collections—including User, Complaint, Team, WorkerTask, WasteAssessment, and VerificationLog—maintain referential integrity through ObjectId references. This NoSQL architecture supports rapid ingestion of geospatial coordinates, image URI payloads, and dynamic status transitions, enabling real-time administrative oversight and instant gamified reward disbursements."
set_p_clean(doc.paragraphs[306], p306_text, font_size=12.0)

# Fix P518 (Node.js & JavaScript Runtime)
p518_text = "JavaScript is a versatile, high-level, multi-paradigm programming language that powers modern interactive web applications. Coupled with the Node.js runtime engine, built on Google Chrome's V8 JavaScript engine, it enables event-driven, non-blocking asynchronous I/O execution on the server side. This architecture allows EcoClean to handle concurrent client requests, continuous geolocation telemetry, and real-time report status polling with high throughput and low resource utilization."
set_p_clean(doc.paragraphs[518], p518_text, font_size=12.0)

# Fix P519 (Web Frameworks & REST APIs)
p519_text = "In modern full-stack web engineering, Node.js combined with the Express.js framework provides robust middleware pipelines, modular RESTful API routing, and streamlined JSON request/response serializations. Furthermore, asynchronous helper libraries such as Axios, Bcrypt, and Multer facilitate secure password hashing, token verification, and seamless multipart image ingestion."
set_p_clean(doc.paragraphs[519], p519_text, font_size=12.0)

# Fix P522 (EcoClean Backend Execution)
p522_text = "In the EcoClean project, Node.js and Express act as the core backend engine, managing application business logic, coordinate geofencing, role-based JWT authentication, and database transactions. Its non-blocking architecture ensures that administrative dashboards, worker job cards, and citizen reporting portals receive instantaneous updates across municipal operations."
set_p_clean(doc.paragraphs[522], p522_text, font_size=12.0)

# Fix P531 (Tailwind & Glassmorphic UI)
p531_text = "Tailwind CSS and modern dark-glassmorphism styling constitute the front-end presentation layer of EcoClean. Utilizing a utility-first methodology, Tailwind enables responsive, mobile-first layouts, custom frosted-glass navigation bars, and glowing status indicators. This ensures that the user interface remains intuitive, highly aesthetic, and fully responsive across smartphones, tablets, and desktop workstations without requiring bulky UI frameworks."
set_p_clean(doc.paragraphs[531], p531_text, font_size=12.0)

# Fix P534 (AI Scanner & Feature Extraction)
p534_text = "The AI Waste Scanner simulation incorporates computer vision feature extraction principles to analyze uploaded garbage dump imagery. By evaluating pixel color distributions, contour densities, and material texture patterns, the algorithm estimates waste classifications (such as Plastic Polymers, Biodegradable Organic Matter, or Toxic E-Waste) and assigns an appropriate severity score to prioritize sanitation dispatch."
set_p_clean(doc.paragraphs[534], p534_text, font_size=12.0)

# Fix P768, P770, P773 (Bibliography URLs)
set_p_clean(doc.paragraphs[768], "https://expressjs.com/ - Express Web Application Framework for Node.js", font_size=11.0)
set_p_clean(doc.paragraphs[770], "https://react.dev/ - React Official Documentation and Reference", font_size=11.0)
set_p_clean(doc.paragraphs[773], "https://leafletjs.com/reference.html - Leaflet An Open-Source JavaScript Library for Mobile-Friendly Interactive Maps", font_size=11.0)

doc.save(target_docx)
print("Updated paragraphs saved to target docx!")

# Re-inject header text and media just in case
temp_extract = r"d:\Smart waste management\scratch\final_docx_patch"
if os.path.exists(temp_extract):
    shutil.rmtree(temp_extract)

with zipfile.ZipFile(target_docx, 'r') as zin:
    zin.extractall(temp_extract)

hdr_path = os.path.join(temp_extract, "word", "header1.xml")
if os.path.exists(hdr_path):
    with open(hdr_path, "r", encoding="utf-8") as f:
        hdr_txt = f.read()
    hdr_txt = hdr_txt.replace(">TAILORED<", ">ECOCLEAN<")
    hdr_txt = hdr_txt.replace(">ELEGANCE<", "><")
    with open(hdr_path, "w", encoding="utf-8") as f:
        f.write(hdr_txt)

ready_media = r"d:\Smart waste management\scratch\ready_media"
media_dest = os.path.join(temp_extract, "word", "media")
for m_file in os.listdir(ready_media):
    shutil.copyfile(os.path.join(ready_media, m_file), os.path.join(media_dest, m_file))

os.remove(target_docx)
shutil.make_archive(target_docx.replace('.docx', ''), 'zip', temp_extract)
shutil.move(target_docx.replace('.docx', '') + '.zip', target_docx)
shutil.rmtree(temp_extract)

desktop_target = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
shutil.copyfile(target_docx, desktop_target)
print("Updated report rebuilt and copied to Desktop!")
