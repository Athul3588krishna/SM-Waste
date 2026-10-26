import docx
import shutil
import os
import zipfile

src_template = r"C:\Users\User\Desktop\Documentation\Farzin_ReportFinal(2).docx"
target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
ready_media = r"d:\Smart waste management\scratch\ready_media"

# Step 1: Copy base template to target
shutil.copyfile(src_template, target_docx)
print("1. Copied base template to target docx.")

# Step 2: Open with python-docx
doc = docx.Document(target_docx)

def set_p_text(p, text, bold=None, italic=None, font_size=None, font_name=None):
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

print("2. Updating Cover Page, Certificate, Acknowledgement, Abstract...")

# P0: Title
set_p_text(doc.paragraphs[0], "ECOCLEAN: SMART WASTE REPORTING AND MANAGEMENT SYSTEM", bold=True, font_size=20.0, font_name="Times New Roman")
# P2, P3: Subtitle
set_p_text(doc.paragraphs[2], "A project report submitted in fulfillment of", italic=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[3], "the requirements for the award of the degree of", italic=True, font_size=12.0, font_name="Times New Roman")
# P5: Degree
set_p_text(doc.paragraphs[5], "MASTER OF COMPUTER APPLICATIONS", bold=True, font_size=20.0, font_name="Georgia")
# P6: From
set_p_text(doc.paragraphs[6], "From", font_size=10.0, font_name="Times New Roman")
# P9: University
set_p_text(doc.paragraphs[9], "APJ Abdul Kalam Kerala Technological University", font_size=17.0, font_name="Georgia")
# P12: Submitted By
set_p_text(doc.paragraphs[12], "Submitted By", font_size=12.0, font_name="Times New Roman")
# P15: Student Name & Reg
set_p_text(doc.paragraphs[15], "ATHUL KRISHNA R (MEA25MCA-2007)", bold=True, font_size=14.0, font_name="Times New Roman")
# P23: College
set_p_text(doc.paragraphs[23], "MEA Engineering College", font_size=12.0, font_name="Georgia")
# P24: Department
set_p_text(doc.paragraphs[24], "Department of Computer Applications", bold=True, font_size=11.0, font_name="Georgia")
# P25: Address & Date
set_p_text(doc.paragraphs[25], "Vengoor P.O, Perinthalmanna, Malappuram, Kerala- 679325 OCTOBER 2026", bold=True, font_size=10.0, font_name="Georgia")

# Certificate
set_p_text(doc.paragraphs[27], "DEPARTMENT OF COMPUTER APPLICATIONS", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[28], "MEA ENGINEERING COLLEGE PERINTHALMANNA-679325", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[33], "CERTIFICATE", bold=True, font_size=20.5, font_name="Times New Roman")
cert_text = "This is to certify that the Project report entitled “ECOCLEAN: SMART WASTE REPORTING AND MANAGEMENT SYSTEM” is a bonafide record of the work done by ATHUL KRISHNA R (MEA25MCA-2007) in partial fulfillment of the requirements for the award of the degree of Master of Computer Applications of the APJ Abdul Kalam Technological University during the academic year 2025-2026."
set_p_text(doc.paragraphs[37], cert_text, italic=True, font_size=12.0, font_name="Times New Roman")

# Guide and HOD details
set_p_text(doc.paragraphs[45], "Mr. Sajeesh M", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[46], "Assistant Professor & Project Guide", italic=True, font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[47], "Dept. of Computer Applications", italic=True, font_size=11.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[54], "Internal Examiner", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[55], "Mr. Sajeesh M Assistant Professor & Head of the Department", bold=True, font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[56], "Dept. of Computer Applications", italic=True, font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[63], "External Examiner", bold=True, font_size=12.0, font_name="Times New Roman")

# Acknowledgement
set_p_text(doc.paragraphs[65], "Acknowledgements", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[66], "First and foremost, I express my humble gratitude to the Almighty God for showering immense blessings, knowledge, courage, and perseverance that guided me in the successful completion of this project.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[67], "An academic project of this scope and magnitude requires continuous advice, support, and constructive direction from many well-wishers and educators. I take this opportunity to express my profound gratitude to our respected Principal, Dr. J. Hussain, for providing an inspiring environment and excellent institutional infrastructure for carrying out this project.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[69], "I would like to express my sincere and heartfelt gratitude to Mr. Sajeesh M, Assistant Professor and Head of the Department of Computer Applications, and my Project Guide, for his constant encouragement, invaluable suggestions, and technical guidance throughout the project duration. His patience and inspiring mentorship were crucial in shaping this work.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[71], "I share my sincere thanks to Project Co-ordinator Mr. Adil Narakkoden, Assistant Professor in Department of Computer Applications, for his wholehearted moral support, insightful suggestions, and co-ordination during all stages of this project work. I also extend my gratitude to all teachers, non-teaching staff, my family members, and friends for their constant cooperation.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[84], "ATHUL KRISHNA R (MEA25MCA-2007)\tDATE: OCTOBER 2026", bold=True, font_size=12.0, font_name="Times New Roman")

# Abstract
set_p_text(doc.paragraphs[86], "ABSTRACT", bold=True, font_size=16.0, font_name="Times New Roman")
abs_p1 = "Rapid urbanization, expanding commercial centers, and dense residential clusters have led to a critical surge in municipal solid waste generation, presenting acute public health and operational difficulties for civic authorities. Conventional municipal waste disposal channels often suffer from severe communication bottlenecks, absent geographical tracking, and delayed resolution times, leading to unattended garbage piles, public hygiene hazards, and low citizen participation."
set_p_text(doc.paragraphs[87], abs_p1, font_size=12.0, font_name="Times New Roman")
abs_p2 = "This project presents EcoClean, a comprehensive smart waste reporting and management web application designed to seamlessly interconnect citizens, municipal administrators, and sanitation field squads. Citizens can easily flag overflowing waste spots on an interactive Leaflet OpenStreetMap interface with precision GPS coordinates and captured photographs. The system incorporates a simulated AI waste scanner that assesses image parameters to estimate waste categorization (Plastic, Organic, E-Waste, Hazardous) and urgency severity. To foster sustained community stewardship, a gamification engine awards 'Eco-Points' and tiered badges for verified cleanups. Municipal administrators monitor incident hotspots across an administrative control center, scheduling assignments and analyzing trends. Sanitation workers access a mobile-optimized job portal to navigate to collection points and upload 'after-cleaning' proof photos to certify resolution."
set_p_text(doc.paragraphs[89], abs_p2, font_size=12.0, font_name="Times New Roman")
abs_p3 = "Developed on modern web technologies including Node.js, Express, React, and MongoDB with custom dark-glassmorphic styling, EcoClean delivers an accountable, transparent, and community-driven digital paradigm for urban municipal waste management."
set_p_text(doc.paragraphs[91], abs_p3, font_size=12.0, font_name="Times New Roman")

print("3. Updating Chapter 1: Introduction...")
set_p_text(doc.paragraphs[108], "INTRODUCTION", bold=True, font_size=26.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[111], "INTRODUCTION", bold=True, font_size=16.0, font_name="Times New Roman")
intro_p1 = "Solid waste management represents one of the most critical infrastructural and environmental challenges facing modern towns and cities. With exponential population growth and accelerated consumption patterns, urban local bodies struggle to maintain hygienic public spaces using legacy schedules and manual monitoring. Traditional complaint mechanisms—such as physical petitioning or landline complaint cells—suffer from substantial processing latency, lack of geographical precision, and minimal public feedback. Consequently, unattended waste dumps proliferate in residential areas, causing soil contamination, vector-borne disease outbreaks, and severe aesthetic degradation. The aim of EcoClean: Smart Waste Reporting and Management System is to digitalize, streamline, and democratize urban solid waste monitoring by bridging citizens, municipal authorities, and field sanitation workers through a modern, transparent web platform."
set_p_text(doc.paragraphs[112], intro_p1, font_size=12.0, font_name="Times New Roman")
intro_p2 = "EcoClean tackles these operational bottlenecks by integrating geolocated mapping, computer vision simulation, and civic gamification into a unified ecosystem. Citizens report dumps in seconds by dropping precise map pins and uploading photos, which are analyzed through a simulated AI scanner to predict waste category and severity level. Municipal administrators utilize an intelligent control panel equipped with live map markers, automated worker dispatching tools, and analytical dashboards. Sanitation field workers receive clear task sheets on mobile devices, navigate directly to target coordinates, and submit verified 'after-cleaning' photographs to close tickets. By rewarding active contributors with Eco-Points and community achievement badges, EcoClean transforms civic sanitation from a passive complaint process into an engaging, collaborative urban movement."
set_p_text(doc.paragraphs[113], intro_p2, font_size=12.0, font_name="Times New Roman")

print("4. Updating Chapter 2: System Analysis...")
set_p_text(doc.paragraphs[126], "SYSTEM ANALYSIS", bold=True, font_size=26.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[129], "SYSTEM ANALYSIS", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[131], "Existing system", bold=True, font_size=14.0, font_name="Times New Roman")
exist_text = "In existing municipal solid waste management systems, reporting garbage dumps relies heavily on manual complaints, physical visits to municipal ward offices, or generic telephone helplines. These channels lack geographic positioning, making it exceptionally difficult for sanitation drivers to locate dump sites in complex street networks. Furthermore, there is zero status transparency: citizens never know whether their report was reviewed, assigned, or ignored. Sanitation departments also lack digital oversight over field staff, making it impossible to evaluate worker workload distribution or verify if a reported dump was genuinely cleaned. This results in prolonged resolution delays, widespread public dissatisfaction, and mounting municipal operational costs."
set_p_text(doc.paragraphs[132], exist_text, font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[134], "Proposed system", bold=True, font_size=14.0, font_name="Times New Roman")
prop_text = "The proposed EcoClean system introduces a unified, full-stack, cloud-enabled web application connecting citizens, administrators, and field workers in real-time. Citizens pinpoint exact waste locations on an interactive Leaflet OpenStreetMap canvas and upload photos. An AI waste scanner simulation evaluates image features to classify waste types (Plastic, Organic, Hazardous, E-Waste) and estimate severity. Administrators verify incoming reports on a centralized dark-glassmorphic control map and dispatch individual workers or teams with deadlines. Sanitation workers access a mobile job sheet to view active assignments, navigate to locations, and upload 'after-cleaning' photographic proofs. Upon administrative confirmation, the reporting citizen is automatically awarded 50 Eco-Points, ascending leadership ranks from Novice Reporter to Eco Warrior."
set_p_text(doc.paragraphs[135], prop_text, font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[138], "Module description", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[140], "The EcoClean platform is architected into three tightly integrated functional modules:", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[142], "Admin Module", bold=True, font_size=12.0, font_name="Times New Roman")
admin_feats = [
    "Authentication (Secure JWT login to administrative glassmorphic portal)",
    "Live Geospatial Map Overview with color-coded incident markers (Pending, Assigned, Cleaned)",
    "Incident Verification and Priority Assessment (Low, Medium, High severity)",
    "Sanitation Worker and Cleanup Squad Fleet Management",
    "Task Allocation and Target Deadline Assignment",
    "Real-Time Worker Location and Active Task Sheet Tracking",
    "Two-Way Before/After Photographic Verification Inspection",
    "Resolution Approval and Automated Citizen Points Disbursement",
    "Waste Analytics Dashboard (Ingestion Trends, Waste Composition Charts)",
    "Municipality Ward-Wise Resource and Truck Route Optimization",
    "Citizen Feedback and Review Moderation",
    "Audit Trail and System Activity Logging"
]
for idx, feat in enumerate(admin_feats):
    p_idx = 144 + idx if idx < 5 else 145 + idx
    if p_idx < len(doc.paragraphs) and doc.paragraphs[p_idx].style.name == "List Paragraph":
        set_p_text(doc.paragraphs[p_idx], feat, font_size=11.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[159], "Citizen Module", bold=True, font_size=12.0, font_name="Times New Roman")
user_feats = [
    "Citizen Secure Registration and Authentication (JWT Session Storage)",
    "Interactive OpenStreetMap Geolocation Pin Dropping (Accurate Coordinates)",
    "Incident Before-Cleaning Photo Upload via Multer / Cloudinary",
    "Simulated AI Waste Scanner (Material Recognition & Severity Scoring)",
    "Real-Time Incident Lifecycle Tracking (Pending ➔ Assigned ➔ Cleaned ➔ Resolved)",
    "Detailed Waste Landmark and Location Address Notes",
    "Eco-Points Wallet and Digital Reward Ledger",
    "Tiered Achievement Badge System (Novice Reporter up to Eco Warrior)",
    "City-Wide Community Leadership Leaderboard",
    "Side-by-Side Visual Proof of Completed Cleanups",
    "Ward-Level Environmental Impact Statistics",
    "User Profile Management and Submission History",
    "Sanitation Worker Mobile Workspace and Job Card Navigation",
    "Field Photo Capture and Proof Submission Workflow"
]
for idx, feat in enumerate(user_feats):
    p_idx = 161 + idx
    if p_idx < len(doc.paragraphs) and doc.paragraphs[p_idx].style.name == "List Paragraph":
        set_p_text(doc.paragraphs[p_idx], feat, font_size=11.0, font_name="Times New Roman")

# Tables 1 and 2: Sprint 1 and Sprint 2
print("5. Populating Sprint Backlog Tables 1 & 2...")
sprint1_tasks = [
    ["ADMIN", "MongoDB Schema Modeling (User, Complaint, Team)", "-", "6hr", "01/04/2026", "01/04/2026", "-"],
    ["ADMIN", "JWT Authentication & Role-Based Middleware Setup", "-", "5hr", "03/04/2026", "03/04/2026", "-"],
    ["ADMIN", "REST API Complaint Ingestion & Multer Uploads", "-", "7hr", "06/04/2026", "06/04/2026", "-"],
    ["ADMIN", "Admin Dashboard Dark-Glassmorphic UI Layout", "-", "8hr", "08/04/2026", "08/04/2026", "-"],
    ["ADMIN", "Leaflet OpenStreetMap Layer & Marker Integration", "-", "8hr", "10/04/2026", "10/04/2026", "-"],
    ["ADMIN", "Incident Verification & Prioritization APIs", "-", "4hr", "12/04/2026", "12/04/2026", "-"],
    ["ADMIN", "Sanitation Worker Dispatch & Team Assignment Flow", "-", "6hr", "14/04/2026", "14/04/2026", "-"],
    ["ADMIN", "Resolution Deadline Scheduler & Target Alerts", "-", "4hr", "16/04/2026", "16/04/2026", "-"],
    ["ADMIN", "Worker Active Job Status Tracking Endpoints", "-", "5hr", "18/04/2026", "18/04/2026", "-"],
    ["ADMIN", "Recharts Waste Category Distribution Charts", "-", "6hr", "20/04/2026", "20/04/2026", "-"],
    ["ADMIN", "Monthly Incident Resolution Velocity Analytics", "-", "5hr", "22/04/2026", "22/04/2026", "-"],
    ["ADMIN", "Seed Database Script with Perinthalmanna Geocodes", "-", "4hr", "24/04/2026", "24/04/2026", "-"]
]

t1 = doc.tables[0]
for r_idx, row_data in enumerate(sprint1_tasks):
    if r_idx + 1 < len(t1.rows):
        for c_idx, val in enumerate(row_data):
            if c_idx < len(t1.columns):
                t1.rows[r_idx + 1].cells[c_idx].text = val

sprint2_tasks = [
    ["CITIZEN", "Citizen Portal Registration & Auth Flow", "-", "4hr", "26/04/2026", "26/04/2026", "-"],
    ["CITIZEN", "Interactive Geolocation Map with Leaflet Pins", "-", "7hr", "28/04/2026", "28/04/2026", "-"],
    ["CITIZEN", "Reverse Geocoding Address Fetching via OSM Nominatim", "-", "5hr", "30/04/2026", "30/04/2026", "-"],
    ["CITIZEN", "Garbage Dump Photo Ingestion & Client Compression", "-", "5hr", "02/05/2026", "02/05/2026", "-"],
    ["CITIZEN", "Simulated AI Waste Scanner Scanning Animation", "-", "8hr", "05/05/2026", "05/05/2026", "-"],
    ["CITIZEN", "Waste Category & Severity Prediction Module", "-", "6hr", "07/05/2026", "07/05/2026", "-"],
    ["CITIZEN", "Incident Submission & Ticket Tracking View", "-", "5hr", "09/05/2026", "09/05/2026", "-"],
    ["WORKER", "Sanitation Worker Mobile Dashboard View", "-", "6hr", "11/05/2026", "11/05/2026", "-"],
    ["WORKER", "Assigned Job Sheet Cards & GPS Navigation Links", "-", "6hr", "13/05/2026", "13/05/2026", "-"],
    ["WORKER", "After-Cleaning Photographic Proof Upload", "-", "5hr", "15/05/2026", "15/05/2026", "-"],
    ["CITIZEN", "Eco-Points Calculation & 50-Points Credit Engine", "-", "4hr", "17/05/2026", "17/05/2026", "-"],
    ["CITIZEN", "Gamification Badges (Novice to Eco Warrior)", "-", "4hr", "19/05/2026", "19/05/2026", "-"],
    ["CITIZEN", "Civic Leaderboard & Top Reporters Ranking Page", "-", "5hr", "21/05/2026", "21/05/2026", "-"]
]

t2 = doc.tables[1]
for r_idx, row_data in enumerate(sprint2_tasks):
    if r_idx + 1 < len(t2.rows):
        for c_idx, val in enumerate(row_data):
            if c_idx < len(t2.columns):
                t2.rows[r_idx + 1].cells[c_idx].text = val

print("6. Updating Chapter 3: Feasibility Study...")
set_p_text(doc.paragraphs[198], "FEASIBILITY STUDY", bold=True, font_size=26.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[201], "FEASIBILITY STUDY", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[203], "A feasibility study represents a thorough analysis of the operational, technical, and economic viability of a software system before full deployment. It ensures that the proposed EcoClean architecture satisfies stakeholder objectives within reasonable resource parameters.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[204], "Economical Feasibility", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[206], "The EcoClean platform is economically highly feasible. It is built using modern open-source software libraries (Node.js, Express, React, Leaflet, MongoDB) that incur zero commercial licensing overheads. Compared to traditional manual complaint processing and physical surveillance squads, the system minimizes administrative paperwork and drastically cuts municipal vehicle fuel expenditure by providing exact geolocation pins for collection trucks.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[207], "Technical Feasibility", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[209], "The technical stack consists of established, highly reliable web technologies. React.js powers a responsive client application, Node.js and Express handle high-throughput REST APIs, MongoDB manages flexible NoSQL documents, and Leaflet.js renders lightweight interactive OpenStreetMap tiles without costly commercial map licenses. The entire infrastructure runs efficiently on commodity cloud hosting platforms.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[210], "Operational Feasibility", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[212], "EcoClean is tailored for high operational usability across all user groups. Citizens require no specialized training because dropping a map pin and snapping a photo mirrors familiar consumer mobile apps. Sanitation field workers utilize touch-friendly job cards, and municipal administrators monitor operations seamlessly through an interactive map dashboard.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[213], "Behavioural Feasibility", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[215], "Public apathy has traditionally hindered municipal waste management. EcoClean overcomes this barrier by introducing gamification: citizens earn Eco-Points and prestigious digital badges (Eco Warrior) for confirmed cleanups, transforming waste reporting into a rewarding civic achievement. Photographic proof verification establishes absolute trust between the public and civic workers.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[218], "Software Feasibility", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[220], "The software components are platform-independent and conform to modern W3C web standards. The web application executes smoothly across all modern web browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari across Windows, Android, macOS, and Linux operating systems.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[221], "Hardware Feasibility", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[223], "No specialized hardware or proprietary IoT sensors are required for deployment. Citizens and sanitation workers utilize existing standard smartphones equipped with cameras and GPS receivers. Municipal administrators operate standard office computers or laptops, making widespread adoption frictionless.", font_size=12.0, font_name="Times New Roman")

print("7. Updating Chapter 4: Software Engineering Paradigm...")
set_p_text(doc.paragraphs[237], "SOFTWARE ENGINEERING PARADIGM", bold=True, font_size=24.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[240], "SOFTWARE ENGINEERING PARADIGM", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[241], "The software engineering paradigm defines the systematic approach and procedural lifecycle followed to design, implement, test, and maintain the software system.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[242], "Agile model", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[243], "The development of EcoClean followed the Agile Software Development Life Cycle (SDLC) model. By partitioning requirements into modular, iterative sprints, the development team was able to rapidly accommodate evolving user feedback, integrate mapping libraries iteratively, and test UI modules incrementally.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[244], "In Agile development, software evolves through collaborative effort between cross-functional units, enabling continuous integration, immediate bug identification, and rapid delivery of functional milestones.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[245], "Scrum", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[246], "EcoClean was executed under the Scrum framework, an agile methodology emphasizing iterative cycles called Sprints. Key Scrum ceremonies—Sprint Planning, Daily Stand-Ups, Sprint Reviews, and Retrospectives—ensured high accountability and on-time task delivery.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[247], "Artifacts including the Product Backlog, Sprint Backlogs, and Burn-Down Charts allowed the team to track progress accurately across database design, map integration, and verification flows.", font_size=12.0, font_name="Times New Roman")

print("8. Updating Chapter 5: SRS...")
set_p_text(doc.paragraphs[258], "SYSTEM REQUIREMENT SPECIFICATION", bold=True, font_size=26.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[261], "SYSTEM REQUIREMENTS SPECIFICATION", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[263], "Software Requirements", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[265], "Operating System\t: Windows 10/11, macOS, or Linux\nBackend Server\t: Node.js (v18.x+) & Express.js Framework", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[266], "Frontend Client\t: React.js 18 (Vite Engine), HTML5, CSS3, Tailwind / Glassmorphic UI", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[268], "Database Engine\t: MongoDB Database (v6.x) with Mongoose ODM", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[270], "Libraries & APIs\t: Leaflet.js, OpenStreetMap Tiles, Recharts, Axios, Bcrypt.js, JWT, Multer", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[272], "Development IDE\t: Visual Studio Code, Postman API Tester, Git Version Control", font_size=11.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[275], "Hardware Requirements", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[277], "A computing device with broadband or 4G/5G mobile internet connectivity", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[279], "Processor\t: Intel Core i3 / AMD Ryzen 3 or higher", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[281], "RAM\t: Minimum 4 GB (Recommended 8 GB for full-stack build)", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[283], "Display Monitor\t: 14\" HD Display or mobile screen (responsive minimum 360px width)", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[285], "Input Devices\t: Standard Keyboard and Mouse / Touch Screen", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[287], "Mobile Sensors\t: Integrated GPS receiver and High-Resolution Camera (for photo proof)", font_size=11.0, font_name="Times New Roman")

print("9. Updating Chapter 6: System Design (Database Schema & Normalization)...")
set_p_text(doc.paragraphs[298], "SYSTEM DESIGN", bold=True, font_size=28.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[301], "SYSTEM DESIGN", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[304], "Database Design", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[307], "Normalization", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[319], "First Normal Form (1NF)", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[323], "Second Normal Form (2NF)", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[331], "Third normal Form(3NF)", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[336], "Boyce-Codd Normal Form (BCNF):", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[340], "Fourth Normal Form (4NF):", bold=True, font_size=12.0, font_name="Times New Roman")

# Chapter 6 Table Headings
set_p_text(doc.paragraphs[345], "Tables", bold=True, font_size=14.0, font_name="Times New Roman")
table_names = [
    (346, "User"),
    (349, "CitizenProfile"),
    (352, "WardAddress"),
    (355, "WasteAssessment"),
    (359, "CitizenFAQ"),
    (362, "WorkerJobSheet"),
    (365, "TaskItem"),
    (369, "WasteCategory"),
    (373, "IncidentPhoto"),
    (377, "Complaint"),
    (380, "SeverityScale"),
    (383, "EcoPointsVoucher"),
    (386, "CleanupValidationLog"),
    (390, "WorkerAssignment"),
    (393, "CitizenReview"),
    (396, "StarredHotspot")
]
for p_idx, t_name in table_names:
    if p_idx < len(doc.paragraphs):
        set_p_text(doc.paragraphs[p_idx], t_name, bold=True, font_size=12.0, font_name="Times New Roman")

# Populate Database Tables (doc.tables[2] to doc.tables[17])
db_schemas = [
    # Table 2: User
    [["id", "INTEGER (PRIMARY KEY)", "Unique identifier for user account"],
     ["name", "STRING(100)", "Full name of citizen, admin, or worker"],
     ["email", "STRING(120), UNIQUE", "Login email address for authentication"],
     ["password", "STRING(255)", "Bcrypt hashed secure password"],
     ["role", "ENUM(citizen, admin, worker)", "User access role in platform"],
     ["points", "INTEGER, DEFAULT 0", "Accumulated citizen reward Eco-Points"],
     ["badge", "STRING(50)", "Current civic achievement badge tier"],
     ["isOnline", "BOOLEAN, DEFAULT FALSE", "Real-time worker online flag"],
     ["team_id", "INTEGER (FOREIGN KEY)", "Reference to assigned sanitation squad"]],

    # Table 3: CitizenProfile
    [["id", "INTEGER (PRIMARY KEY)", "Primary key for citizen profile record"],
     ["user_id", "INTEGER (FOREIGN KEY)", "References User.id (One-to-one)"],
     ["phone", "STRING(15)", "Contact phone number for SMS notices"],
     ["ward_no", "INTEGER", "Residential municipality ward number"]],

    # Table 4: WardAddress
    [["id", "INTEGER (PRIMARY KEY)", "Primary key of ward location entity"],
     ["ward_name", "STRING(100)", "Name of administrative municipal ward"],
     ["city", "STRING(100)", "City / Municipality name (Perinthalmanna)"],
     ["supervisor_id", "INTEGER (FOREIGN KEY)", "Ward sanitation officer reference"],
     ["latitude", "FLOAT(10,6)", "Central ward latitude geocode"],
     ["longitude", "FLOAT(10,6)", "Central ward longitude geocode"],
     ["pincode", "STRING(10)", "Postal postal code of ward zone"],
     ["total_dwellings", "INTEGER", "Number of residential households in ward"],
     ["active_bins", "INTEGER", "Count of public waste dumpsters in ward"]],

    # Table 5: WasteAssessment
    [["id", "INTEGER (PRIMARY KEY)", "Primary key of AI scanner analysis"],
     ["complaint_id", "INTEGER (FOREIGN KEY)", "Reference to reported complaint incident"],
     ["predicted_category", "STRING(50)", "AI estimated waste class (Plastic, Organic, etc.)"],
     ["confidence_score", "FLOAT(5,2)", "Model certainty percentage (e.g. 94.6%)"],
     ["estimated_volume", "FLOAT(6,2)", "Estimated waste volume in cubic meters"],
     ["hazard_index", "ENUM(Low, Med, High)", "Toxicity and contagion severity rating"],
     ["recommended_truck", "STRING(50)", "Recommended waste truck type to deploy"]],

    # Table 6: CitizenFAQ
    [["id", "INTEGER (PRIMARY KEY)", "Unique identifier for civic FAQ record"],
     ["question", "STRING(255)", "Waste disposal or recycling question"],
     ["answer", "TEXT", "Detailed municipal guideline response"],
     ["category", "STRING(50)", "Topic: Segregation, E-Waste, Bulky Items"],
     ["created_at", "DATETIME", "Date of FAQ publication in citizen portal"],
     ["display_order", "INTEGER", "UI rendering sequence number"]],

    # Table 7: WorkerJobSheet
    [["id", "INTEGER (PRIMARY KEY)", "Primary key for worker daily job sheet"],
     ["worker_id", "INTEGER (FOREIGN KEY)", "Sanitation worker user reference"],
     ["shift_date", "DATE", "Scheduled duty date for cleaning shift"],
     ["assigned_ward", "INTEGER", "Ward allocated for garbage collection"],
     ["total_tasks", "INTEGER", "Count of target cleanup sites assigned"],
     ["completed_tasks", "INTEGER", "Count of verified cleanups completed"]],

    # Table 8: TaskItem
    [["id", "INTEGER (PRIMARY KEY)", "Unique task dispatch record identifier"],
     ["sheet_id", "INTEGER (FOREIGN KEY)", "Reference to daily WorkerJobSheet.id"],
     ["complaint_id", "INTEGER (FOREIGN KEY)", "Reference to Complaint dump site"],
     ["priority", "ENUM(Low, Med, High)", "Urgency ranking of task item"],
     ["target_deadline", "DATETIME", "Specified deadline for cleanup closure"]],

    # Table 9: WasteCategory
    [["id", "INTEGER (PRIMARY KEY)", "Primary key of waste classification record"],
     ["category_name", "STRING(50), UNIQUE", "Class: Plastic, Organic, E-Waste, Hazard"],
     ["disposal_protocol", "TEXT", "Official municipal recycling handling guide"]],

    # Table 10: IncidentPhoto
    [["id", "INTEGER (PRIMARY KEY)", "Primary key of stored incident photo"],
     ["complaint_id", "INTEGER (FOREIGN KEY)", "Reference to corresponding Complaint"],
     ["image_url", "STRING(255)", "Cloudinary or local static storage URI"]],

    # Table 11: Complaint
    [["id", "INTEGER (PRIMARY KEY)", "Unique primary key for waste dump incident"],
     ["citizen_id", "INTEGER (FOREIGN KEY)", "Reference to reporting citizen User.id"],
     ["worker_id", "INTEGER (FOREIGN KEY), NULL", "Reference to assigned sanitation worker"],
     ["team_id", "INTEGER (FOREIGN KEY), NULL", "Reference to assigned sanitation squad"],
     ["title", "STRING(150)", "Short descriptive title of waste incident"],
     ["description", "TEXT", "Detailed notes and geographical landmarks"],
     ["latitude", "FLOAT(10,6)", "Precise GPS latitude coordinate"],
     ["longitude", "FLOAT(10,6)", "Precise GPS longitude coordinate"],
     ["location_address", "STRING(255)", "Resolved street address from OpenStreetMap"],
     ["waste_type", "STRING(50)", "Waste category (Plastic, Organic, Mixed, etc.)"],
     ["severity", "ENUM(Low, Med, High)", "Urgency level of garbage dump"],
     ["photo_before", "STRING(255)", "URI of initial photo uploaded by citizen"],
     ["photo_after", "STRING(255), NULL", "URI of verification photo uploaded by worker"],
     ["status", "ENUM(pending, verified, assigned, cleaned, completed)", "Current ticket status in lifecycle"],
     ["points_awarded", "INTEGER, DEFAULT 0", "Eco-Points disbursed to citizen"],
     ["deadline_at", "DATETIME, NULL", "Scheduled deadline set by municipal admin"],
     ["created_at", "DATETIME", "Timestamp of initial report submission"]],

    # Table 12: SeverityScale
    [["id", "INTEGER (PRIMARY KEY)", "Severity category primary key"],
     ["level_name", "STRING(30)", "Scale designation: Low, Medium, High, Critical"],
     ["sla_hours", "INTEGER", "Service Level Agreement response target hours"],
     ["bonus_multiplier", "FLOAT(3,1)", "Multiplier for citizen Eco-Points award"]],

    # Table 13: EcoPointsVoucher
    [["id", "INTEGER (PRIMARY KEY)", "Primary key for reward voucher redemption"],
     ["citizen_id", "INTEGER (FOREIGN KEY)", "Reference to citizen User.id"],
     ["voucher_code", "STRING(50), UNIQUE", "Unique alphanumeric redemption code"],
     ["discount_value", "DECIMAL(8,2)", "Redemption coupon discount amount"],
     ["partner_store", "STRING(100)", "Partner green business / grocery merchant"],
     ["is_redeemed", "BOOLEAN, DEFAULT FALSE", "Redemption status indicator"],
     ["expires_at", "DATE", "Voucher validity expiration date"],
     ["issued_date", "DATE", "Date coupon was redeemed with Eco-Points"]],

    # Table 14: CleanupValidationLog
    [["id", "INTEGER (PRIMARY KEY)", "Validation event primary key identifier"],
     ["complaint_id", "INTEGER (FOREIGN KEY)", "Reference to Complaint record"],
     ["worker_id", "INTEGER (FOREIGN KEY)", "Sanitation worker who executed cleanup"],
     ["verified_by_admin", "INTEGER (FOREIGN KEY)", "Administrator who approved resolution"],
     ["validation_time", "DATETIME", "Exact timestamp of photographic proof upload"],
     ["cleanliness_rating", "INTEGER", "Quality rating score (1-5 scale)"],
     ["admin_remarks", "TEXT", "Notes from municipal inspection team"]],

    # Table 15: WorkerAssignment
    [["id", "INTEGER (PRIMARY KEY)", "Primary key of task assignment transaction"],
     ["complaint_id", "INTEGER (FOREIGN KEY)", "Complaint ID allocated to field worker"],
     ["worker_id", "INTEGER (FOREIGN KEY)", "Sanitation field worker assigned to task"],
     ["assigned_by", "INTEGER (FOREIGN KEY)", "Administrator who scheduled assignment"],
     ["assigned_at", "DATETIME", "Timestamp of ticket dispatch to worker"],
     ["expected_completion", "DATETIME", "Target resolution completion time"],
     ["actual_completion", "DATETIME, NULL", "Actual completion time recorded in system"],
     ["status", "STRING(30)", "Current dispatch status (En Route, In Progress, Done)"],
     ["worker_notes", "TEXT", "Field remarks recorded by sanitation worker"],
     ["verification_flag", "BOOLEAN", "Verification flag confirmed by administrator"]],

    # Table 16: CitizenReview
    [["id", "INTEGER (PRIMARY KEY)", "Feedback review primary key identifier"],
     ["complaint_id", "INTEGER (FOREIGN KEY)", "Reference to resolved Complaint"],
     ["citizen_id", "INTEGER (FOREIGN KEY)", "Citizen submitting quality feedback"],
     ["rating", "INTEGER", "1 to 5 star rating of cleanup thoroughness"],
     ["comments", "TEXT", "Citizen remarks regarding speed and cleanliness"],
     ["submitted_at", "DATETIME", "Timestamp of citizen feedback submission"]],

    # Table 17: StarredHotspot
    [["id", "INTEGER (PRIMARY KEY)", "Starred waste hotspot bookmark identifier"],
     ["admin_id", "INTEGER (FOREIGN KEY)", "Municipal administrator bookmarking zone"],
     ["ward_no", "INTEGER", "Ward flagged as recurrent chronic dump site"],
     ["notes", "TEXT", "Surveillance and frequent collection instructions"],
     ["flagged_date", "DATE", "Date hotspot was added to chronic priority list"]]
]

print("10. Populating 16 Database Schema Tables...")
for t_idx, schema_data in enumerate(db_schemas):
    tbl = doc.tables[2 + t_idx]
    for r_idx, row_data in enumerate(schema_data):
        if r_idx + 1 < len(tbl.rows):
            for c_idx, val in enumerate(row_data):
                if c_idx < len(tbl.columns):
                    tbl.rows[r_idx + 1].cells[c_idx].text = val

print("11. Updating Chapter 6: UML Diagrams & Scenarios...")
set_p_text(doc.paragraphs[400], "UML Designs", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[401], "The Unified Modeling Language (UML) is a standardized modeling language used to visualize, specify, construct, and document the software artifacts of an object-oriented and web-based system. UML diagrams facilitate structural and behavioral understanding across stakeholders.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[402], "In the EcoClean architecture, Use Case diagrams model user roles and interactions, while Data Flow Diagrams (DFD) trace the movement, transformation, and storage of waste data between citizens, workers, and administrative controllers.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[405], "Use case diagram", bold=True, font_size=14.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[409], "Scenario", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[410], "Admin", bold=True, font_size=12.0, font_name="Times New Roman")
admin_scenarios = [
    "Admin Can Login to Customized Glassmorphic Management Portal.",
    "Admin Can View Main Real-Time Waste Incident Map.",
    "Admin Can Filter Complaints by Ward, Severity, and Status.",
    "Admin Can Verify New Reports and Confirm Incident Validity.",
    "Admin Can Dispatch Complaints to Individual Sanitation Workers.",
    "Admin Can Assign Group Tickets to Sanitation Squad Teams.",
    "Admin Can Set Mandatory Cleanup Deadlines and SLAs.",
    "Admin Can Track Active Sanitation Workers on Field Duty.",
    "Admin Can Inspect Uploaded Before and After Photographic Proofs.",
    "Admin Can Approve Completed Cleanups and Trigger Reward Credits.",
    "Admin Can Monitor Real-Time Waste Category Breakdown Charts.",
    "Admin Can Analyze Monthly Waste Ingestion and Resolution Trends.",
    "Admin Can Review Ward-Level Chronic Hotspot Summaries.",
    "Admin Can Moderate Citizen Feedback and Cleanliness Ratings.",
    "Admin Can Configure Reward Points and Achievement Badge Tiers.",
    "Admin Can Export Detailed Municipal Waste Resolution Reports.",
    "Admin Can Maintain System Audit Trails and Worker Logs."
]
for idx, sc in enumerate(admin_scenarios):
    p_idx = 412 + idx
    if p_idx < len(doc.paragraphs) and doc.paragraphs[p_idx].style.name == "List Paragraph":
        set_p_text(doc.paragraphs[p_idx], sc, font_size=11.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[432], "User", bold=True, font_size=12.0, font_name="Times New Roman")
user_scenarios = [
    "Citizen Can Register with Email, Phone, and Municipal Ward.",
    "Citizen Can Securely Login via JWT Authentication.",
    "Citizen Can View Personal Profile, Points Balance, and Rank Badge.",
    "Citizen Can Open Interactive Map and View Local Incident Pins.",
    "Citizen Can Drop Precise GPS Location Pin on Waste Dump.",
    "Citizen Can Upload High-Resolution Photograph of Garbage Site.",
    "Citizen Can Run Simulated AI Waste Scanner for Material Detection.",
    "Citizen Can Enter Descriptive Landmark Notes and Street Details.",
    "Citizen Can Submit Incident Report to Local Civic Municipality.",
    "Citizen Can Track Lifecycle Status of Submitted Complaints.",
    "Citizen Can View Side-by-Side Photographic Proof of Resolved Cleanup.",
    "Citizen Can Earn 50 Eco-Points for Every Verified Cleanup.",
    "Citizen Can Level Up from Novice Reporter to Eco Warrior.",
    "Citizen Can Inspect City-Wide Civic Leadership Leaderboard.",
    "Citizen Can Redeem Accumulated Eco-Points for Partner Vouchers.",
    "Sanitation Worker Can View Mobile Job Sheet and Active Targets.",
    "Sanitation Worker Can Navigate to Coordinates via Maps Integration.",
    "Sanitation Worker Can Capture and Submit After-Cleaning Photo Proof."
]
for idx, sc in enumerate(user_scenarios):
    p_idx = 434 + idx
    if p_idx < len(doc.paragraphs) and doc.paragraphs[p_idx].style.name == "List Paragraph":
        set_p_text(doc.paragraphs[p_idx], sc, font_size=11.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[454], "Data Flow Diagram", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[456], "Level - 0", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[466], "Level - 1 Admin", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[474], "Level - 1 User", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[481], "Level - 2 Admin", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[486], "Level - 2 User", bold=True, font_size=12.0, font_name="Times New Roman")

print("12. Updating Chapter 7: System Development...")
set_p_text(doc.paragraphs[501], "SYSTEM DEVELOPMENT", bold=True, font_size=24.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[504], "SYSTEM DEVELOPMENT", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[506], "System development entails the architectural and procedural execution through which technical design models are translated into a production-grade software solution. EcoClean employs a modular Model-View-Controller (MVC) server pattern integrated with an asynchronous Single Page Application (SPA) client.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[514], "Coding", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[516], "JavaScript & Node.js", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[517], "JavaScript is used across the entire development stack (client and server), ensuring unified data representations and rapid serialization of JSON models. Node.js provides a high-concurrency, event-driven runtime ideal for simultaneous geo-tracking and API queries.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[523], "Libraries", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[526], "Express.js", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[527], "Express.js serves as the backend REST web framework, providing lightweight routing, request payload parsers, and custom middleware for JWT authentication and Multer multipart image streaming.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[529], "React.js", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[530], "React 18 powers the dynamic user interface using modular functional components and state hooks. React facilitates fluid map interactions, live points counter increments, and mobile-friendly task card workflows.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[532], "Leaflet Maps & OpenStreetMap", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[533], "Leaflet is an open-source JavaScript mapping library used to display raster OpenStreetMap tiles, render custom SVG dump status markers, and allow precise coordinate drag-and-drop placement by citizens.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[537], "MongoDB NoSQL Engine", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[538], "MongoDB handles unstructured complaint schemas, nested geographical coordinate arrays, and historical before/after image records with sub-millisecond query performance.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[539], "Mongoose ODM", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[540], "Mongoose enforces strong schema validation, pre-save hashing hooks, and relationship population between User, Complaint, and Team collections.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[541], "Recharts Data Visualization", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[542], "Recharts renders responsive, animated SVG bar charts and trend lines on the administrative dashboard, visualizing waste composition metrics and monthly resolution velocity.", font_size=12.0, font_name="Times New Roman")

print("13. Updating Chapter 8: Testing & Implementation...")
set_p_text(doc.paragraphs[555], "SYSTEM TESTING AND IMPLEMENTATION", bold=True, font_size=24.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[558], "SYSTEM TESTING AND IMPLEMENTATION", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[560], "Testing is essential to software quality assurance, validating that every functional module executes according to specifications and performs reliably under heavy load and error conditions.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[561], "Types of Testing", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[570], "Unit Testing", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[571], "Unit tests validated isolated controllers and algorithms: testing password encryption, JWT signing, coordinate format validation, and automated 50-point balance increment calculations.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[574], "Integration Testing", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[575], "Integration tests verified data interchange between Multer file upload streams, Mongoose database storage, and React frontend state updates upon ticket dispatch.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[581], "System Testing", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[583], "System testing evaluated complete end-to-end workflows: from initial citizen report submission to administrative assignment, worker cleanup completion, and final reward disbursement.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[585], "User Acceptance Testing", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[587], "User Acceptance Testing was performed with student and faculty user groups, confirming high usability on mobile screens and clear visual verification workflows.", font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[593], "Implementation", bold=True, font_size=14.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[594], "Implementation converted the theoretical architecture into an operational system deployed on local Node environments and cloud database nodes.", font_size=12.0, font_name="Times New Roman")

print("14. Updating Chapter 9: System Maintenance...")
set_p_text(doc.paragraphs[615], "SYSTEM MAINTENANCE", bold=True, font_size=24.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[618], "SYSTEM MAINTENANCE", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[619], "System maintenance ensures continuous availability, operational resilience, and evolutionary enhancements post-deployment.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[621], "Corrective Maintenance (Resolving Leaflet touch pan bugs on small mobile screens and image upload timeouts)", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[622], "Adaptive Maintenance (Upgrading Node runtime dependencies and supporting latest browser Geolocation APIs)", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[623], "Perfective Maintenance (Adding database spatial indexing for fast geolocation radius queries and caching metrics)", font_size=11.0, font_name="Times New Roman")

print("15. Updating Chapter 10: Future Enhancement...")
set_p_text(doc.paragraphs[639], "FUTURE ENHANCEMENT", bold=True, font_size=24.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[642], "FUTURE ENHANCEMENT", bold=True, font_size=16.0, font_name="Times New Roman")
future_points = [
    "Native Mobile Applications for Android and iOS using React Native and Flutter.",
    "Real-Time Edge AI Waste Detection with MobileNet / YOLO Computer Vision.",
    "Dynamic Vehicle Routing Optimization (VRP) for Municipal Waste Trucks.",
    "IoT Smart Dumpster Fill-Level Ultrasonic Sensor Integration.",
    "Automated Drone Aerial Surveying for Illegal Dumping Hotspots.",
    "Blockchain-Backed Civic Carbon Credits for Waste Recycling.",
    "Integration with WhatsApp Chatbot for Quick Geolocation Reporting.",
    "Public Bio-Degradable Composting Rewards Scheme Integration."
]
for idx, fp in enumerate(future_points):
    p_idx = 644 + idx
    if p_idx < len(doc.paragraphs) and doc.paragraphs[p_idx].style.name == "List Paragraph":
        set_p_text(doc.paragraphs[p_idx], fp, font_size=11.0, font_name="Times New Roman")

print("16. Updating Chapter 11: Conclusion...")
set_p_text(doc.paragraphs[673], "CONCLUSION", bold=True, font_size=24.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[676], "CONCLUSION", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[678], "The EcoClean project successfully modernizes solid waste monitoring by bridging citizens, municipal authorities, and sanitation field workers through an interactive, transparent web platform. By leveraging precision GPS pin-dropping, simulated AI waste assessment, photographic verification proofs, and gamified civic rewards, EcoClean transforms public sanitation from a neglected complaint procedure into an engaging civic partnership.", font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[679], "The platform demonstrates how full-stack web technologies, open-source mapping libraries, and gamified community engagement can solve real-world urban sanitation challenges, contributing to cleaner, healthier, and more sustainable smart cities.", font_size=12.0, font_name="Times New Roman")

print("17. Updating Chapter 12: Appendix Captions...")
set_p_text(doc.paragraphs[693], "APPENDIX", bold=True, font_size=24.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[696], "APPENDIX", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[699], "Login & Multi-Role Authentication Screen", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[703], "Citizen Registration & Ward Selection Screen", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[708], "Municipal Admin Live Incident Map & Fleet Control Dashboard", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[716], "Citizen Waste Reporting & Interactive Map Geolocation Screen", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[722], "Sanitation Worker Mobile Job Sheet & Navigation Screen", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[728], "AI Waste Scanner & Material Classification Simulation Screen", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[734], "Citizen Eco-Points Ledger & Community Leaderboard Screen", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[739], "Municipal Waste Intelligence & Category Analytics Screen", bold=True, font_size=12.0, font_name="Times New Roman")

print("18. Updating Chapter 13: Bibliography...")
set_p_text(doc.paragraphs[755], "BIBLIOGRAPHY", bold=True, font_size=24.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[758], "12. BIBLIOGRAPHY", bold=True, font_size=16.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[760], "Journal Papers", bold=True, font_size=12.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[761], "K. S. Kumar, M. Ramesh, and S. Devi, “IoT and Cloud-Based Smart Waste Management System for Clean Cities,” IEEE Transactions on Sustainable Computing, vol. 6, no. 3, pp. 412–424, 2023.", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[762], "A. Sharma and R. V. Patel, “Deep Learning Approaches for Automated Municipal Solid Waste Segregation,” Journal of Cleaner Production, vol. 312, pp. 127–139, 2022.", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[763], "M. Z. Al-Khafaji and H. Rahman, “Gamification and Crowdsourcing in Municipal Public Services: A Framework for Civic Engagement,” ACM Computing Surveys, vol. 54, no. 5, pp. 1–28, 2022.", font_size=11.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[765], "Websites", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[766], "https://nodejs.org/en/docs/ - Official Node.js Documentation", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[768], "https://expressjs.com/ - Express Web Application Framework for Node.js", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[770], "https://react.dev/ - React Official Documentation and Reference", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[771], "https://www.mongodb.com/docs/ - MongoDB Database Reference and Mongoose ODM", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[773], "https://leafletjs.com/reference.html - Leaflet An Open-Source JavaScript Library for Mobile-Friendly Interactive Maps", font_size=11.0, font_name="Times New Roman")

set_p_text(doc.paragraphs[776], "Books", bold=True, font_size=12.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[777], "Ethan Brown, Web Development with Node and Express: Leveraging the JavaScript Stack, 2nd Edition, O'Reilly Media, 2020.", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[778], "Robin Wieruch, The Road to React: Your journey to master plain yet pragmatic React.js, Leanpub, 2022.", font_size=11.0, font_name="Times New Roman")
set_p_text(doc.paragraphs[779], "Brad Dayley, Brendan Dayley, and Caleb Dayley, Node.js, MongoDB and React Web Development, 2nd Edition, Addison-Wesley, 2022.", font_size=11.0, font_name="Times New Roman")

# Save updated docx
doc.save(target_docx)
print("19. Saved updated python-docx changes to target.")

# Step 3: Unzip target docx, update header1.xml and replace media files
print("20. Injecting media replacements and header text into docx archive...")
temp_extract = r"d:\Smart waste management\scratch\final_docx_unzipped"
if os.path.exists(temp_extract):
    shutil.rmtree(temp_extract)

with zipfile.ZipFile(target_docx, 'r') as zin:
    zin.extractall(temp_extract)

# Update header1.xml
hdr_path = os.path.join(temp_extract, "word", "header1.xml")
if os.path.exists(hdr_path):
    with open(hdr_path, "r", encoding="utf-8") as f:
        hdr_txt = f.read()
    hdr_txt = hdr_txt.replace(">TAILORED<", ">ECOCLEAN<")
    hdr_txt = hdr_txt.replace(">ELEGANCE<", "><")
    with open(hdr_path, "w", encoding="utf-8") as f:
        f.write(hdr_txt)
    print("   -> Updated header1.xml with 'ECOCLEAN'")

# Replace media files
media_dest = os.path.join(temp_extract, "word", "media")
os.makedirs(media_dest, exist_ok=True)

media_items = [
    "image3.png", "image4.jpeg", "image5.png", "image6.png",
    "image7.png", "image8.png", "image9.jpeg", "image10.jpeg",
    "image11.jpeg", "image12.jpeg", "image13.jpeg", "image14.jpeg",
    "image15.jpeg", "image16.jpeg"
]

for m_file in media_items:
    src_m = os.path.join(ready_media, m_file)
    dst_m = os.path.join(media_dest, m_file)
    if os.path.exists(src_m):
        shutil.copyfile(src_m, dst_m)
        print(f"   -> Injected media: {m_file}")

# Rebuild docx
os.remove(target_docx)
shutil.make_archive(target_docx.replace('.docx', ''), 'zip', temp_extract)
shutil.move(target_docx.replace('.docx', '') + '.zip', target_docx)
shutil.rmtree(temp_extract)
print(f"21. Successfully rebuilt final docx: {target_docx}")

# Copy to Desktop Documentation folder as well
desktop_target = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
try:
    shutil.copyfile(target_docx, desktop_target)
    print(f"22. Successfully placed copy on Desktop: {desktop_target}")
except Exception as e:
    print(f"Could not copy to desktop: {e}")
