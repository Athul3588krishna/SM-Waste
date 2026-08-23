import os
import subprocess

# Define SVG Logos
ktu_logo_svg = '''<svg width="80" height="90" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10 H90 V70 C90 90 50 105 50 105 C50 105 10 90 10 70 Z" fill="#ffffff" stroke="#004080" stroke-width="3"/>
  <path d="M14 14 H86 V68 C86 85 50 99 50 99 C50 99 14 85 14 68 Z" fill="#e6f0fa" stroke="#004080" stroke-width="1.5"/>
  <rect x="20" y="20" width="60" height="12" fill="#004080" rx="2"/>
  <text x="50" y="28" font-family="Times New Roman, serif" font-size="6" font-weight="bold" fill="#ffffff" text-anchor="middle">APJ ABDUL KALAM</text>
  <text x="50" y="34" font-family="Times New Roman, serif" font-size="4.5" fill="#004080" text-anchor="middle" font-weight="bold">TECHNOLOGICAL UNIVERSITY</text>
  <circle cx="50" cy="54" r="14" fill="#d97706" stroke="#b45309" stroke-width="1"/>
  <circle cx="50" cy="54" r="9" fill="#ffffff"/>
  <path d="M42 56 Q50 51 50 56 Q50 51 58 56 V49 Q50 45 42 49 Z" fill="#004080"/>
  <text x="50" y="76" font-family="Times New Roman, serif" font-size="14" font-weight="900" fill="#004080" text-anchor="middle">KTU</text>
  <rect x="38" y="80" width="24" height="8" fill="#d97706" rx="2"/>
  <text x="50" y="86" font-family="Times New Roman, serif" font-size="6" font-weight="bold" fill="#ffffff" text-anchor="middle">2014</text>
</svg>'''

mea_logo_svg = '''<svg width="85" height="85" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="50" r="36" fill="none" stroke="#1e293b" stroke-width="4"/>
  <g stroke="#1e293b" stroke-width="4" stroke-linecap="round">
    <line x1="60" y1="10" x2="60" y2="18"/>
    <line x1="60" y1="82" x2="60" y2="90"/>
    <line x1="20" y1="50" x2="28" y2="50"/>
    <line x1="92" y1="50" x2="100" y2="50"/>
    <line x1="32" y1="22" x2="38" y2="28"/>
    <line x1="82" y1="72" x2="88" y2="78"/>
    <line x1="32" y1="78" x2="38" y2="72"/>
    <line x1="82" y1="28" x2="88" y2="22"/>
  </g>
  <circle cx="60" cy="50" r="30" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
  <path d="M46 44 Q60 38 60 44 Q60 38 74 44 V34 Q60 30 46 34 Z" fill="#0284c7"/>
  <path d="M40 68 L50 36 L60 52 L70 36 L80 68" fill="none" stroke="#0f172a" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M20 90 L30 84 H90 L100 90 L95 102 L90 98 H30 L25 102 Z" fill="#0f172a"/>
  <text x="60" y="93" font-family="Times New Roman, serif" font-size="5.5" font-weight="bold" fill="#ffffff" text-anchor="middle">MEA ENGINEERING COLLEGE</text>
  <text x="60" y="106" font-family="Times New Roman, serif" font-size="4.5" font-style="italic" fill="#0f172a" text-anchor="middle">KNOWLEDGE IS POWER</text>
</svg>'''

def make_header(page_num):
    return f'<div class="header"><span>EcoClean: Smart Waste Management System</span><span>{page_num}</span></div>'

def make_footer():
    return '<div class="footer"><span>Department of Computer Applications</span><span>MEA Engineering College</span></div>'

# HTML Head & Styles
html_head = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@page {{
    size: A4 portrait;
    margin: 0;
}}
*, *:before, *:after {{
    box-sizing: border-box;
}}
html, body {{
    margin: 0;
    padding: 0;
    font-family: 'Times New Roman', Times, serif;
    background: #ffffff;
    color: #000000;
    font-size: 11.5pt;
    line-height: 1.5;
}}
.page {{
    width: 210mm;
    height: 296.8mm;
    padding: 22mm 20mm 22mm 25mm;
    position: relative;
    page-break-after: always;
    break-after: page;
    overflow: hidden;
    background: #ffffff;
}}
.page:last-child {{
    page-break-after: auto;
    break-after: auto;
}}
.header {{
    position: absolute;
    top: 12mm;
    left: 25mm;
    right: 20mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5pt;
    font-style: italic;
    border-bottom: 1px solid #000;
    padding-bottom: 3px;
}}
.footer {{
    position: absolute;
    bottom: 12mm;
    left: 25mm;
    right: 20mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5pt;
    font-style: italic;
    border-top: 1px solid #000;
    padding-top: 3px;
}}
.content {{
    margin-top: 6mm;
}}
h1.doc-title {{
    font-size: 20pt;
    font-weight: bold;
    text-align: center;
    margin-top: 5mm;
    margin-bottom: 4mm;
    text-transform: uppercase;
    line-height: 1.3;
}}
h1.section-cover-title {{
    font-size: 24pt;
    font-weight: bold;
    text-align: center;
    margin-top: 95mm;
    text-transform: uppercase;
    letter-spacing: 1px;
}}
h2.chapter-title {{
    font-size: 15pt;
    font-weight: bold;
    margin-top: 3mm;
    margin-bottom: 4mm;
    text-transform: uppercase;
}}
h3.sec-title {{
    font-size: 12.5pt;
    font-weight: bold;
    margin-top: 4mm;
    margin-bottom: 2mm;
}}
h4.subsec-title {{
    font-size: 11.5pt;
    font-weight: bold;
    margin-top: 3mm;
    margin-bottom: 2mm;
}}
p {{
    text-align: justify;
    margin-top: 0;
    margin-bottom: 3mm;
}}
ul, ol {{
    margin-top: 0;
    margin-bottom: 3mm;
    padding-left: 6mm;
}}
li {{
    margin-bottom: 1.5mm;
    text-align: justify;
}}
table.report-table {{
    width: 100%;
    border-collapse: collapse;
    margin-top: 3mm;
    margin-bottom: 4mm;
    font-size: 9.5pt;
}}
table.report-table th, table.report-table td {{
    border: 1px solid #000;
    padding: 1.5mm 2mm;
    text-align: left;
    vertical-align: top;
}}
table.report-table th {{
    background-color: #f8fafc;
    font-weight: bold;
}}
.center {{ text-align: center; }}
.bold {{ font-weight: bold; }}
.italic {{ font-style: italic; }}

.toc-row {{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2.2mm;
    font-size: 11pt;
}}
.toc-dots {{
    flex-grow: 1;
    border-bottom: 1px dotted #444;
    margin: 0 5px 4px 5px;
}}

/* Phone Frame Mockups */
.phone-container {{
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 15px;
    margin-top: 6mm;
}}
.phone-frame {{
    width: 215px;
    height: 430px;
    border: 7px solid #1e293b;
    border-radius: 26px;
    background: #0f172a;
    color: #ffffff;
    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}}
.phone-notch {{
    width: 75px;
    height: 12px;
    background: #1e293b;
    margin: 0 auto;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
}}
.phone-header {{
    padding: 5px 10px;
    font-size: 7.5pt;
    font-weight: bold;
    background: #1e293b;
    color: #38bdf8;
    text-align: center;
}}
.phone-body {{
    padding: 8px;
    flex-grow: 1;
    font-size: 7pt;
    font-family: Arial, sans-serif;
    color: #e2e8f0;
}}
.phone-btn {{
    background: #0284c7;
    color: white;
    padding: 4px 6px;
    border-radius: 4px;
    text-align: center;
    font-weight: bold;
    margin-top: 5px;
    font-size: 6.5pt;
}}
.phone-card {{
    background: #1e293b;
    border-radius: 5px;
    padding: 6px;
    margin-bottom: 5px;
    border: 1px solid #334155;
}}
</style>
</head>
<body>
'''

pages = []

# PAGE 1: COVER PAGE
p1 = f'''<div class="page">
    <div style="height: 10mm;"></div>
    <h1 class="doc-title">ECOCLEAN: SMART WASTE REPORTING AND MANAGEMENT SYSTEM</h1>
    <div class="center italic" style="font-size: 11pt; margin-top: 8mm; margin-bottom: 8mm; line-height: 1.6;">
        A project report<br>
        submitted in fulfillment of<br>
        the requirements for the award of the degree of
    </div>
    <div class="center bold" style="font-size: 16pt; margin-bottom: 6mm;">MASTER OF COMPUTER APPLICATIONS</div>
    <div class="center" style="font-size: 11pt; margin-bottom: 2mm;">From</div>
    <div class="center bold" style="font-size: 14pt; margin-bottom: 4mm;">APJ Abdul Kalam Kerala Technological<br>University</div>
    <div class="center" style="margin-bottom: 6mm;">
        {ktu_logo_svg}
    </div>
    <div class="center" style="font-size: 11pt; margin-bottom: 2mm;">Submitted By</div>
    <div class="center bold" style="font-size: 13pt; margin-bottom: 6mm;">ATHUL KRISHNA R (MEA24MCA-2001)</div>
    <div class="center" style="margin-bottom: 6mm;">
        {mea_logo_svg}
    </div>
    <div class="center bold" style="font-size: 13pt; margin-bottom: 1mm;">MEA Engineering College</div>
    <div class="center bold" style="font-size: 12pt; margin-bottom: 1mm;">Department of Computer Applications</div>
    <div class="center" style="font-size: 10.5pt; margin-bottom: 4mm;">Vengoor P.O, Perinthalmanna, Malappuram, Kerala-679325</div>
    <div class="center bold" style="font-size: 12pt; text-transform: uppercase;">OCTOBER 2025</div>
</div>'''
pages.append(p1)

# PAGE 2: CERTIFICATE PAGE
p2 = f'''<div class="page">
    <div class="center bold" style="font-size: 14pt; margin-top: 5mm; margin-bottom: 1mm;">DEPARTMENT OF COMPUTER APPLICATIONS</div>
    <div class="center bold" style="font-size: 13pt; margin-bottom: 1mm;">MEA ENGINEERING COLLEGE</div>
    <div class="center bold" style="font-size: 12pt; margin-bottom: 6mm;">PERINTHALMANNA-679325</div>
    <div class="center" style="margin-bottom: 8mm;">
        {mea_logo_svg}
    </div>
    <div class="center bold" style="font-size: 18pt; letter-spacing: 2px; margin-bottom: 12mm;">CERTIFICATE</div>
    <p class="italic" style="font-size: 11.5pt; line-height: 1.8; margin-bottom: 20mm;">
        This is to certify that the Project report entitled <b>“EcoClean: Smart Waste Reporting and Management System”</b> is a bonafide record of the work done by <b>ATHUL KRISHNA R (MEA24MCA-2001)</b> under our supervision and guidance. The report has been submitted in fulfillment of the requirement for award of the Degree of <b>Master of Computer Applications</b> from the <i>APJ Abdul Kalam Kerala Technological University</i> for the year 2025.
    </p>
    <hr style="border: 0; border-top: 1px solid #000; margin-bottom: 15mm;">
    <div style="display: flex; justify-content: space-between; font-size: 11pt; line-height: 1.4;">
        <div>
            <b>Mr. Sajeesh M</b><br>
            <span class="italic">Assistant Professor</span><br>
            <span class="italic">Project Guide</span><br>
            <span class="italic">Dept. of Computer Applications</span>
        </div>
        <div>
            <b>Mr. Sajeesh M</b><br>
            <span class="italic">Assistant Professor</span><br>
            <span class="italic">Head of the Department</span><br>
            <span class="italic">Dept. of Computer Applications</span>
        </div>
    </div>
</div>'''
pages.append(p2)

# PAGE 3: ACKNOWLEDGEMENTS
p3 = f'''<div class="page">
    <div class="center italic" style="font-size: 22pt; margin-top: 10mm; margin-bottom: 12mm;">Acknowledgements</div>
    <p style="line-height: 1.7; margin-bottom: 5mm;">
        First and foremost, We would like to thank the Almighty God for giving us the knowledge and strength which helped us in the successful completion of this project.
    </p>
    <p style="line-height: 1.7; margin-bottom: 5mm;">
        An endeavor over a long period may be successful only with advice and guidance of many well wishers. We take this opportunity to express our gratitude to all who encouraged us to complete this project. We would like to express our deep sense of gratitude to our respected Principal <b>Dr. J. Hussain</b> for his inspiration and for creating an atmosphere in the college to do the project.
    </p>
    <p style="line-height: 1.7; margin-bottom: 5mm;">
        We would like to thank <b>Mr. Sajeesh M</b>, Assistant Professor and Head of the Department, for providing permission and facilities to conduct the project in a systematic way. We are highly indebted to <b>Mr. Sajeesh M</b>, Assistant Professor in Department of Computer Applications for guiding us and giving timely advices, suggestions and whole hearted moral support in the successful completion of this project.
    </p>
    <p style="line-height: 1.7; margin-bottom: 25mm;">
        Our sincere thanks to Project Co-ordinator <b>Mr. Adil Narakkoden</b>, Assistant Professor in Department of Computer Applications for his wholehearted moral support in completion of this project.
    </p>
    <div style="display: flex; justify-content: space-between; font-size: 11pt;">
        <div>Athul Krishna R (MEA24MCA-2001)</div>
        <div>DATE: OCTOBER 23, 2025</div>
    </div>
</div>'''
pages.append(p3)

# PAGE 4: ABSTRACT
p4 = f'''<div class="page">
    <div class="center bold" style="font-size: 18pt; margin-top: 10mm; margin-bottom: 10mm;">ABSTRACT</div>
    <p style="line-height: 1.7; margin-bottom: 5mm;">
        Conducting surveys and gathering input from citizens regarding municipal solid waste management is a major challenge for local governance in Kerala. Traditional waste management processes often lack real-time visibility, leading to delayed collections, public hygiene issues, and low citizen participation.
    </p>
    <p style="line-height: 1.7; margin-bottom: 5mm;">
        To address these critical challenges, I developed <b>EcoClean</b>, a modern full-stack web application designed to connect citizens, municipal administrators, and sanitation workers seamlessly. Citizens can report illegal garbage dumps on an interactive map using exact geographical GPS coordinates. The system features a simulated AI waste scanner animation that analyzes uploaded photos to predict waste category (<i>Plastic, Organic, Hazardous, E-waste</i>) and severity level. To incentivize civic responsibility, a gamification engine awards <i>Eco-Points</i> and rank badges for verified cleanups.
    </p>
    <p style="line-height: 1.7; margin-bottom: 5mm;">
        Municipal administrators monitor active city reports via a real-time dark-glassmorphic control panel. They verify incoming reports and assign tasks directly to sanitation workers or teams using interactive maps and statistical analytics built with Recharts. Sanitation workers access a mobile-optimized workspace showing active targets. Workers upload "after-cleaning" verification photos to mark tasks as completed, triggering automated point allocation and feedback loops.
    </p>
    <p style="line-height: 1.7;">
        Built using the MERN stack (<b>MongoDB, Express.js, React.js, Node.js</b>) with Leaflet mapping and styled with modern dark-glassmorphism, EcoClean demonstrates how community-driven reporting, real-time administration, and gamification can digitalize and optimize municipal sanitation workflows.
    </p>
</div>'''
pages.append(p4)

# PAGE 5: CONTENTS PART 1
p5 = f'''<div class="page">
    <div class="center bold" style="font-size: 18pt; margin-top: 5mm; margin-bottom: 8mm;">CONTENTS</div>
    <div style="display: flex; justify-content: flex-end; font-weight: bold; margin-bottom: 4mm;">Page No.</div>
    
    <div class="toc-row"><span class="bold">1. INTRODUCTION</span><span class="toc-dots"></span><span class="bold">1</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;1.1 Project Overview</span><span class="toc-dots"></span><span>2</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;1.2 Motivation</span><span class="toc-dots"></span><span>2</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;1.3 Objectives</span><span class="toc-dots"></span><span>2</span></div>

    <div class="toc-row" style="margin-top: 3mm;"><span class="bold">2. SYSTEM ANALYSIS</span><span class="toc-dots"></span><span class="bold">3</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.1 Existing System & Disadvantages</span><span class="toc-dots"></span><span>4</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.2 Proposed System & Advantages</span><span class="toc-dots"></span><span>4</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.3 Module Description</span><span class="toc-dots"></span><span>5</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.4 Sprint Lifecycle</span><span class="toc-dots"></span><span>6</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;2.5 User Stories</span><span class="toc-dots"></span><span>7</span></div>

    <div class="toc-row" style="margin-top: 3mm;"><span class="bold">3. FEASIBILITY STUDY</span><span class="toc-dots"></span><span class="bold">8</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.1 Economical Feasibility</span><span class="toc-dots"></span><span>9</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.2 Technical Feasibility</span><span class="toc-dots"></span><span>9</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.3 Operational Feasibility</span><span class="toc-dots"></span><span>9</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.4 Behavioural Feasibility</span><span class="toc-dots"></span><span>9</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.5 Software Feasibility</span><span class="toc-dots"></span><span>10</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;3.6 Hardware Feasibility</span><span class="toc-dots"></span><span>10</span></div>

    <div class="toc-row" style="margin-top: 3mm;"><span class="bold">4. SOFTWARE ENGINEERING PARADIGM</span><span class="toc-dots"></span><span class="bold">11</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;4.1 Agile SDLC Model</span><span class="toc-dots"></span><span>12</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;4.2 Scrum Framework</span><span class="toc-dots"></span><span>12</span></div>

    <div class="toc-row" style="margin-top: 3mm;"><span class="bold">5. SYSTEM REQUIREMENT SPECIFICATION</span><span class="toc-dots"></span><span class="bold">13</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;5.1 Software Requirements</span><span class="toc-dots"></span><span>14</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;5.2 Hardware Requirements</span><span class="toc-dots"></span><span>14</span></div>

    <div class="toc-row" style="margin-top: 3mm;"><span class="bold">6. SYSTEM DESIGN</span><span class="toc-dots"></span><span class="bold">15</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;6.1 Database Design</span><span class="toc-dots"></span><span>16</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;6.2 Tables & Schema Structure</span><span class="toc-dots"></span><span>16</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;6.3 UML Design</span><span class="toc-dots"></span><span>17</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;6.4 Use Case Diagram</span><span class="toc-dots"></span><span>17</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;6.5 Use Case Scenario</span><span class="toc-dots"></span><span>18</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;6.6 Data Flow Diagram</span><span class="toc-dots"></span><span>19</span></div>
</div>'''
pages.append(p5)

# PAGE 6: CONTENTS PART 2
p6 = f'''<div class="page">
    <div style="height: 10mm;"></div>
    <div class="toc-row"><span class="bold">7. SYSTEM DEVELOPMENT</span><span class="toc-dots"></span><span class="bold">22</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;7.1 Tech Stack & Architectural Overview</span><span class="toc-dots"></span><span>23</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;7.2 Directory Structure & Core Modules</span><span class="toc-dots"></span><span>23</span></div>

    <div class="toc-row" style="margin-top: 4mm;"><span class="bold">8. SYSTEM TESTING AND IMPLEMENTATION</span><span class="toc-dots"></span><span class="bold">24</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;8.1 Types of Testing</span><span class="toc-dots"></span><span>25</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;8.2 Implementation & Deployment Details</span><span class="toc-dots"></span><span>26</span></div>

    <div class="toc-row" style="margin-top: 4mm;"><span class="bold">9. SYSTEM MAINTENANCE</span><span class="toc-dots"></span><span class="bold">27</span></div>

    <div class="toc-row" style="margin-top: 4mm;"><span class="bold">10. FUTURE ENHANCEMENT</span><span class="toc-dots"></span><span class="bold">29</span></div>

    <div class="toc-row" style="margin-top: 4mm;"><span class="bold">11. CONCLUSION</span><span class="toc-dots"></span><span class="bold">31</span></div>

    <div class="toc-row" style="margin-top: 4mm;"><span class="bold">12. APPENDIX</span><span class="toc-dots"></span><span class="bold">33</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;12.1 API Endpoints Summary</span><span class="toc-dots"></span><span>34</span></div>
    <div class="toc-row"><span>&nbsp;&nbsp;&nbsp;&nbsp;12.2 User Interface Screenshots & Screenshots</span><span class="toc-dots"></span><span>35</span></div>

    <div class="toc-row" style="margin-top: 4mm;"><span class="bold">13. BIBLIOGRAPHY</span><span class="toc-dots"></span><span class="bold">41</span></div>
</div>'''
pages.append(p6)

# PAGE 7: SECTION 1 DIVIDER
p7 = f'''<div class="page">
    {make_header(1)}
    <h1 class="section-cover-title">INTRODUCTION</h1>
    {make_footer()}
</div>'''
pages.append(p7)

# PAGE 8: CHAPTER 1 CONTENT
p8 = f'''<div class="page">
    {make_header(2)}
    <div class="content">
        <h2 class="chapter-title">1. INTRODUCTION</h2>
        
        <h3 class="sec-title">1.1 Project Overview</h3>
        <p>
            <b>EcoClean</b> is an interactive, full-stack web application developed to modernize solid waste monitoring and collection in urban areas. By establishing a collaborative platform, EcoClean allows citizens, sanitation workers, and municipal authorities to coordinate in real time. It uses geolocated mapping, visual validation, and active gamification to create an efficient waste management system.
        </p>

        <h3 class="sec-title">1.2 Motivation</h3>
        <p>
            Traditional waste management systems rely on scheduled routes or manual inspection, which leads to overflows remaining neglected for days. The COVID-19 pandemic highlighted the importance of public sanitation and digitized urban operations. Providing citizens with a direct channel to report hygiene issues, combined with rewards and visual tracking, increases community civic responsibility and accelerates cleanup response times.
        </p>

        <h3 class="sec-title">1.3 Objectives</h3>
        <ul>
            <li>Develop an interactive map interface for citizens to pin exact coordinates of garbage dumps.</li>
            <li>Build a simulation of an AI image analysis scanner to categorize waste types and severity levels.</li>
            <li>Design an administrative dashboard displaying active complaints, assignment drop-downs, and analytics.</li>
            <li>Create a mobile-responsive interface for sanitation workers to view tasks, navigate to locations, and upload before/after cleanup validations.</li>
            <li>Implement an engagement system rewarding reporters with Eco-Points and rank badges upon verified cleanup.</li>
        </ul>
    </div>
    {make_footer()}
</div>'''
pages.append(p8)

# PAGE 9: SECTION 2 DIVIDER
p9 = f'''<div class="page">
    {make_header(3)}
    <h1 class="section-cover-title">SYSTEM ANALYSIS</h1>
    {make_footer()}
</div>'''
pages.append(p9)

# PAGE 10: CHAPTER 2 CONTENT PART 1
p10 = f'''<div class="page">
    {make_header(4)}
    <div class="content">
        <h2 class="chapter-title">2. SYSTEM ANALYSIS</h2>
        
        <h3 class="sec-title">2.1 Existing System & Disadvantages</h3>
        <p>
            In the existing municipal waste management system for citizen surveys and complaints, municipalities typically conduct operations through traditional paper forms, physical landline calls, or written emails. Citizens are required to visit specific locations or interact with surveyors to provide feedback.
        </p>
        <p class="bold">Disadvantages of Existing System:</p>
        <ul>
            <li>High latency between reporting waste dumps and assigning workers for resolution.</li>
            <li>Lack of geographic tracking (GPS coordinates) makes locating dumps in street networks tedious.</li>
            <li>High rate of duplicate or falsified reports due to lack of photo verification.</li>
            <li>Citizens receive no real-time status updates or incentives to maintain public hygiene.</li>
        </ul>

        <h3 class="sec-title">2.2 Proposed System & Advantages</h3>
        <p>
            The proposed <b>EcoClean</b> system aims to modernize the process of waste reporting by leveraging digital technology and centralized web platforms. This system enables citizens to report dumps conveniently from smartphones or desktop computers.
        </p>
        <p class="bold">Advantages of Proposed System:</p>
        <ul>
            <li><b>Geographic Pinpointing:</b> Citizens drop exact coordinates on OpenStreetMap using Leaflet.</li>
            <li><b>Simulated AI Waste Scanner:</b> Analyzes image features to determine waste severity and category.</li>
            <li><b>Visual Accountability:</b> Workers must upload an "after-cleaning" photo before completing tickets.</li>
            <li><b>Gamification Model:</b> Rewards citizens with Eco-Points and rank badges upon confirmed cleanups.</li>
        </ul>
    </div>
    {make_footer()}
</div>'''
pages.append(p10)

# PAGE 11: CHAPTER 2 MODULE DESCRIPTION
p11 = f'''<div class="page">
    {make_header(5)}
    <div class="content">
        <h3 class="sec-title">2.3 Module Description</h3>
        <p>The system is divided into 3 primary functional modules based on user roles:</p>
        
        <h4 class="subsec-title">A. Citizen Module</h4>
        <ul>
            <li><b>Registration & Authentication:</b> Secure signup and login with password hashing.</li>
            <li><b>Waste Reporting:</b> Drop pins on map, attach photos, and describe issue.</li>
            <li><b>Simulated AI Waste Scanner:</b> Real-time visual scan estimating waste category (Organic, Plastic, E-waste) and severity.</li>
            <li><b>Eco-Points Dashboard:</b> Track reported issues, earned points, and unlocked badges (e.g. Eco Warrior).</li>
        </ul>

        <h4 class="subsec-title">B. Municipal Admin Module</h4>
        <ul>
            <li><b>Live Monitoring Map:</b> View all pending, verified, assigned, and completed garbage reports.</li>
            <li><b>Worker & Team Assignment:</b> Assign tasks to individual sanitation workers or teams with deadlines.</li>
            <li><b>Analytics & Reports:</b> View Recharts distribution charts for waste categories and ingestion trends.</li>
        </ul>

        <h4 class="subsec-title">C. Sanitation Worker Module</h4>
        <ul>
            <li><b>Active Job Sheet:</b> View assigned locations, target deadlines, and urgency level.</li>
            <li><b>Task Navigation:</b> Interactive map leading directly to waste coordinate.</li>
            <li><b>Verification Upload:</b> Capture and submit "after-cleaning" photo for admin approval.</li>
        </ul>
    </div>
    {make_footer()}
</div>'''
pages.append(p11)

# PAGE 12: CHAPTER 2 SPRINT TABLES
p12 = f'''<div class="page">
    {make_header(6)}
    <div class="content">
        <h3 class="sec-title">2.4 Sprint Lifecycle</h3>
        <p>The project was developed in 4 two-week Agile Sprints:</p>
        
        <table class="report-table">
            <thead>
                <tr>
                    <th>Sprint</th>
                    <th>Task Description</th>
                    <th>Est. Hours</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><b>Sprint 1</b></td>
                    <td>Database schema modeling & Auth REST APIs</td>
                    <td>40 hrs</td>
                    <td>16/07/2025</td>
                    <td>30/07/2025</td>
                    <td>Completed</td>
                </tr>
                <tr>
                    <td><b>Sprint 2</b></td>
                    <td>Leaflet Map Integration & AI Scanner Simulation</td>
                    <td>45 hrs</td>
                    <td>01/08/2025</td>
                    <td>15/08/2025</td>
                    <td>Completed</td>
                </tr>
                <tr>
                    <td><b>Sprint 3</b></td>
                    <td>Admin Control Panel & Recharts Analytics</td>
                    <td>50 hrs</td>
                    <td>16/08/2025</td>
                    <td>31/08/2025</td>
                    <td>Completed</td>
                </tr>
                <tr>
                    <td><b>Sprint 4</b></td>
                    <td>Worker Photo Verification & Points Engine</td>
                    <td>40 hrs</td>
                    <td>01/09/2025</td>
                    <td>15/09/2025</td>
                    <td>Completed</td>
                </tr>
            </tbody>
        </table>
    </div>
    {make_footer()}
</div>'''
pages.append(p12)

# PAGE 13: CHAPTER 2 USER STORIES
p13 = f'''<div class="page">
    {make_header(7)}
    <div class="content">
        <h3 class="sec-title">2.5 User Stories</h3>
        <ul style="line-height: 1.8;">
            <li><b>As a Citizen</b>, I want to drop a GPS pin on a map to report garbage dumps so that sanitation workers can find the location easily.</li>
            <li><b>As a Citizen</b>, I want to upload a photo of the waste and see an AI scan estimate its severity level automatically.</li>
            <li><b>As a Citizen</b>, I want to earn Eco-Points and rank badges when my report is resolved, motivating me to keep my city clean.</li>
            <li><b>As an Admin</b>, I want to view active city complaints on a centralized map so I can verify and delegate tasks efficiently.</li>
            <li><b>As an Admin</b>, I want to analyze waste trends and category distribution to optimize garbage truck deployment.</li>
            <li><b>As a Sanitation Worker</b>, I want to access my active job sheet on a mobile screen and upload a completion photo to verify my work without paperwork.</li>
        </ul>
    </div>
    {make_footer()}
</div>'''
pages.append(p13)

# PAGE 14: SECTION 3 DIVIDER
p14 = f'''<div class="page">
    {make_header(8)}
    <h1 class="section-cover-title">FEASIBILITY STUDY</h1>
    {make_footer()}
</div>'''
pages.append(p14)

# PAGE 15: CHAPTER 3 CONTENT
p15 = f'''<div class="page">
    {make_header(9)}
    <div class="content">
        <h2 class="chapter-title">3. FEASIBILITY STUDY</h2>
        <p>
            An analysis of the ability to complete a project successfully considering technical, economic, and operational factors is essential before full deployment.
        </p>

        <h3 class="sec-title">3.1 Economical Feasibility</h3>
        <p>
            EcoClean uses open-source web technologies (Node.js, Express, React, MongoDB) that incur zero licensing costs. Deploying on cloud infrastructure reduces manual logging administrative expenses.
        </p>

        <h3 class="sec-title">3.2 Technical Feasibility</h3>
        <p>
            The project stack consists of proven, stable web frameworks. MongoDB handles unstructured complaint documents, Node.js serves fast REST endpoints, and Leaflet JS efficiently renders map overlays.
        </p>

        <h3 class="sec-title">3.3 Operational Feasibility</h3>
        <p>
            The web portal features intuitive interfaces requiring minimal user training. Mobile-optimized screens enable seamless worker usage in outdoor environments.
        </p>

        <h3 class="sec-title">3.4 Behavioral Feasibility</h3>
        <p>
            Gamification through Eco-Points and badges directly motivates public participation, turning passive complaints into active civic engagement.
        </p>

        <h3 class="sec-title">3.5 Software Feasibility</h3>
        <p>
            Cross-platform web standards ensure full compatibility across Chrome, Safari, Firefox, Android, iOS, and Windows.
        </p>

        <h3 class="sec-title">3.6 Hardware Feasibility</h3>
        <p>
            Uses existing mobile GPS and camera hardware without requiring specialized IoT gear.
        </p>
    </div>
    {make_footer()}
</div>'''
pages.append(p15)

# PAGE 16: SECTION 4 DIVIDER
p16 = f'''<div class="page">
    {make_header(10)}
    <h1 class="section-cover-title">SOFTWARE ENGINEERING PARADIGM</h1>
    {make_footer()}
</div>'''
pages.append(p16)

# PAGE 17: CHAPTER 4 CONTENT
p17 = f'''<div class="page">
    {make_header(11)}
    <div class="content">
        <h2 class="chapter-title">4. SOFTWARE ENGINEERING PARADIGM</h2>
        
        <h3 class="sec-title">4.1 Agile SDLC Model</h3>
        <p>
            The software was built using the Agile iterative process model. Features were incrementally built, tested, and demonstrated in two-week cycles.
        </p>
        
        <div class="center" style="margin: 8mm 0;">
            <svg width="450" height="90" viewBox="0 0 450 90" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="25" width="70" height="35" rx="5" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.5"/>
                <text x="40" y="46" font-family="Arial" font-size="8.5" font-weight="bold" text-anchor="middle">Requirement</text>

                <path d="M75 42.5 L95 42.5" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arr)"/>

                <rect x="95" y="25" width="60" height="35" rx="5" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.5"/>
                <text x="125" y="46" font-family="Arial" font-size="8.5" font-weight="bold" text-anchor="middle">Design</text>

                <path d="M155 42.5 L175 42.5" stroke="#1e293b" stroke-width="1.5"/>

                <rect x="175" y="25" width="75" height="35" rx="5" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.5"/>
                <text x="212" y="46" font-family="Arial" font-size="8.5" font-weight="bold" text-anchor="middle">Development</text>

                <path d="M250 42.5 L270 42.5" stroke="#1e293b" stroke-width="1.5"/>

                <rect x="270" y="25" width="60" height="35" rx="5" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.5"/>
                <text x="300" y="46" font-family="Arial" font-size="8.5" font-weight="bold" text-anchor="middle">Testing</text>

                <path d="M330 42.5 L350 42.5" stroke="#1e293b" stroke-width="1.5"/>

                <rect x="350" y="25" width="75" height="35" rx="5" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
                <text x="387" y="46" font-family="Arial" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">Deployment</text>
            </svg>
        </div>

        <h3 class="sec-title">4.2 Scrum Framework</h3>
        <p>
            Scrum meetings ensured rapid feedback loops. Sprint backlog items were monitored on a Kanban board tracking <i>To Do, In Progress, Verification,</i> and <i>Done</i> states.
        </p>
    </div>
    {make_footer()}
</div>'''
pages.append(p17)

# PAGE 18: SECTION 5 DIVIDER
p18 = f'''<div class="page">
    {make_header(12)}
    <h1 class="section-cover-title">SYSTEM REQUIREMENT SPECIFICATION</h1>
    {make_footer()}
</div>'''
pages.append(p18)

# PAGE 19: CHAPTER 5 CONTENT
p19 = f'''<div class="page">
    {make_header(13)}
    <div class="content">
        <h2 class="chapter-title">5. SYSTEM REQUIREMENT SPECIFICATION</h2>
        
        <h3 class="sec-title">5.1 Software Requirements</h3>
        <table class="report-table">
            <tr>
                <td class="bold" style="width: 35%;">Operating System</td>
                <td>Windows 10 / 11, Ubuntu 20.04+, or macOS</td>
            </tr>
            <tr>
                <td class="bold">Backend Server</td>
                <td>Node.js v16.x or higher, Express.js</td>
            </tr>
            <tr>
                <td class="bold">Frontend Engine</td>
                <td>React.js 18.x (Vite build tool)</td>
            </tr>
            <tr>
                <td class="bold">Database</td>
                <td>MongoDB v5.0 / MongoDB Atlas</td>
            </tr>
            <tr>
                <td class="bold">Mapping Library</td>
                <td>Leaflet.js with OpenStreetMap Tiles</td>
            </tr>
            <tr>
                <td class="bold">Analytics Library</td>
                <td>Recharts Data Visualization Engine</td>
            </tr>
        </table>

        <h3 class="sec-title">5.2 Hardware Requirements</h3>
        <table class="report-table">
            <tr>
                <td class="bold" style="width: 35%;">Processor</td>
                <td>Intel Core i3 / AMD Ryzen 3 or above</td>
            </tr>
            <tr>
                <td class="bold">RAM</td>
                <td>8 GB Minimum (16 GB Recommended)</td>
            </tr>
            <tr>
                <td class="bold">Storage</td>
                <td>10 GB Free Storage Space</td>
            </tr>
            <tr>
                <td class="bold">Client Devices</td>
                <td>Smartphones / Desktops with Camera & GPS</td>
            </tr>
        </table>
    </div>
    {make_footer()}
</div>'''
pages.append(p19)

# PAGE 20: SECTION 6 DIVIDER
p20 = f'''<div class="page">
    {make_header(14)}
    <h1 class="section-cover-title">SYSTEM DESIGN</h1>
    {make_footer()}
</div>'''
pages.append(p20)

# PAGE 21: CHAPTER 6 SCHEMAS
p21 = f'''<div class="page">
    {make_header(15)}
    <div class="content">
        <h2 class="chapter-title">6. SYSTEM DESIGN</h2>
        
        <h3 class="sec-title">6.1 Database Design</h3>
        <p>
            EcoClean uses document-oriented NoSQL schemas in MongoDB.
        </p>

        <h3 class="sec-title">6.2 Schema Tables</h3>
        
        <h4 class="subsec-title">A. Users Collection Schema</h4>
        <table class="report-table">
            <thead>
                <tr><th>Field</th><th>Type</th><th>Constraint</th><th>Description</th></tr>
            </thead>
            <tbody>
                <tr><td>`_id`</td><td>ObjectId</td><td>Primary Key</td><td>Unique user identifier</td></tr>
                <tr><td>`name`</td><td>String</td><td>Required</td><td>Full name of user</td></tr>
                <tr><td>`email`</td><td>String</td><td>Unique, Req</td><td>User login email</td></tr>
                <tr><td>`password`</td><td>String</td><td>Required</td><td>Bcrypt encrypted hash</td></tr>
                <tr><td>`role`</td><td>String</td><td>Enum</td><td>`citizen`, `admin`, `worker`</td></tr>
                <tr><td>`points`</td><td>Number</td><td>Default: 0</td><td>Accumulated Eco-Points</td></tr>
            </tbody>
        </table>

        <h4 class="subsec-title">B. Complaints Collection Schema</h4>
        <table class="report-table">
            <thead>
                <tr><th>Field</th><th>Type</th><th>Constraint</th><th>Description</th></tr>
            </thead>
            <tbody>
                <tr><td>`_id`</td><td>ObjectId</td><td>Primary Key</td><td>Unique ticket identifier</td></tr>
                <tr><td>`citizen`</td><td>ObjectId</td><td>Ref: User</td><td>Reporting citizen ID</td></tr>
                <tr><td>`worker`</td><td>ObjectId</td><td>Ref: User</td><td>Assigned worker ID</td></tr>
                <tr><td>`location`</td><td>Object</td><td>Lat/Lng</td><td>GPS Coordinates</td></tr>
                <tr><td>`photoBefore`</td><td>String</td><td>Required</td><td>Before-cleaning photo URL</td></tr>
                <tr><td>`photoAfter`</td><td>String</td><td>Nullable</td><td>After-cleaning photo URL</td></tr>
                <tr><td>`status`</td><td>String</td><td>Enum</td><td>`pending`, `assigned`, `completed`</td></tr>
            </tbody>
        </table>
    </div>
    {make_footer()}
</div>'''
pages.append(p21)

# PAGE 22: CHAPTER 6 USE CASE DIAGRAM SVG
p22 = f'''<div class="page">
    {make_header(16)}
    <div class="content">
        <h3 class="sec-title">6.3 UML & 6.4 Use Case Diagram</h3>
        <p>The Use Case diagram below illustrates system interactions across roles:</p>
        
        <div class="center" style="margin-top: 5mm;">
            <svg width="500" height="380" viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
                <!-- System boundary box -->
                <rect x="110" y="10" width="280" height="360" rx="10" fill="#f8fafc" stroke="#1e293b" stroke-width="2"/>
                <text x="250" y="32" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle">EcoClean System</text>

                <!-- Citizen Actor -->
                <circle cx="50" cy="80" r="14" fill="#0284c7"/>
                <line x1="50" y1="94" x2="50" y2="130" stroke="#0284c7" stroke-width="2"/>
                <line x1="25" y1="110" x2="75" y2="110" stroke="#0284c7" stroke-width="2"/>
                <line x1="50" y1="130" x2="30" y2="160" stroke="#0284c7" stroke-width="2"/>
                <line x1="50" y1="130" x2="70" y2="160" stroke="#0284c7" stroke-width="2"/>
                <text x="50" y="178" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle">Citizen</text>

                <!-- Use Cases -->
                <ellipse cx="250" cy="70" rx="90" ry="18" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
                <text x="250" y="74" font-family="Arial" font-size="9" text-anchor="middle">Register & Login</text>

                <ellipse cx="250" cy="125" rx="90" ry="18" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
                <text x="250" y="129" font-family="Arial" font-size="9" text-anchor="middle">Report Waste & GPS Pin</text>

                <ellipse cx="250" cy="180" rx="90" ry="18" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
                <text x="250" y="184" font-family="Arial" font-size="9" text-anchor="middle">View AI Waste Scan</text>

                <ellipse cx="250" cy="235" rx="90" ry="18" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
                <text x="250" y="239" font-family="Arial" font-size="9" text-anchor="middle">Assign Worker / Task</text>

                <ellipse cx="250" cy="290" rx="90" ry="18" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
                <text x="250" y="294" font-family="Arial" font-size="9" text-anchor="middle">Upload Completion Photo</text>

                <ellipse cx="250" cy="340" rx="90" ry="18" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
                <text x="250" y="344" font-family="Arial" font-size="9" text-anchor="middle">Claim Eco-Points</text>

                <!-- Admin Actor -->
                <circle cx="440" cy="210" r="14" fill="#059669"/>
                <line x1="440" y1="224" x2="440" y2="260" stroke="#059669" stroke-width="2"/>
                <line x1="415" y1="240" x2="465" y2="240" stroke="#059669" stroke-width="2"/>
                <line x1="440" y1="260" x2="420" y2="290" stroke="#059669" stroke-width="2"/>
                <line x1="440" y1="260" x2="460" y2="290" stroke="#059669" stroke-width="2"/>
                <text x="440" y="308" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle">Admin</text>

                <!-- Connector lines -->
                <line x1="75" y1="100" x2="160" y2="75" stroke="#64748b" stroke-width="1"/>
                <line x1="75" y1="115" x2="160" y2="125" stroke="#64748b" stroke-width="1"/>
                <line x1="75" y1="130" x2="160" y2="180" stroke="#64748b" stroke-width="1"/>
                <line x1="415" y1="230" x2="340" y2="235" stroke="#64748b" stroke-width="1"/>
            </svg>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p22)

# PAGE 23: CHAPTER 6 SCENARIOS
p23 = f'''<div class="page">
    {make_header(17)}
    <div class="content">
        <h3 class="sec-title">6.5 Use Case Scenarios</h3>
        
        <h4 class="subsec-title">Scenario 1: Citizen Waste Reporting</h4>
        <ul>
            <li><b>Primary Actor:</b> Citizen</li>
            <li><b>Preconditions:</b> Authenticated user.</li>
            <li><b>Flow:</b>
                <ol>
                    <li>Citizen opens report modal and grants location access.</li>
                    <li>Map pins current GPS coordinates.</li>
                    <li>Citizen uploads garbage dump photo.</li>
                    <li>Simulated AI scanner estimates waste type and severity.</li>
                    <li>Citizen clicks submit; ticket is stored with status `pending`.</li>
                </ol>
            </li>
        </ul>

        <h4 class="subsec-title">Scenario 2: Admin Worker Delegation</h4>
        <ul>
            <li><b>Primary Actor:</b> Admin</li>
            <li><b>Flow:</b>
                <ol>
                    <li>Admin views pending markers on live city map.</li>
                    <li>Admin selects a ticket and clicks "Verify".</li>
                    <li>Admin selects worker from drop-down list and sets target date.</li>
                    <li>Status updates to `assigned`.</li>
                </ol>
            </li>
        </ul>
    </div>
    {make_footer()}
</div>'''
pages.append(p23)

# PAGE 24: CHAPTER 6 DFD LEVEL 0 SVG
p24 = f'''<div class="page">
    {make_header(18)}
    <div class="content">
        <h3 class="sec-title">6.6 Data Flow Diagram - Level 0</h3>
        <p>The Context Level DFD shows high-level boundary flows:</p>
        
        <div class="center" style="margin-top: 15mm;">
            <svg width="480" height="260" viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg">
                <!-- Center Process -->
                <circle cx="240" cy="130" r="55" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/>
                <text x="240" y="125" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle">Central Service</text>
                <text x="240" y="140" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle">Portal Engine</text>

                <!-- Citizen External Entity -->
                <rect x="20" y="100" width="100" height="60" fill="#e2e8f0" stroke="#1e293b" stroke-width="2"/>
                <text x="70" y="135" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle">Citizen</text>

                <!-- Admin External Entity -->
                <rect x="190" y="10" width="100" height="50" fill="#e2e8f0" stroke="#1e293b" stroke-width="2"/>
                <text x="240" y="40" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle">Admin</text>

                <!-- Worker Entity -->
                <rect x="360" y="100" width="100" height="60" fill="#e2e8f0" stroke="#1e293b" stroke-width="2"/>
                <text x="410" y="135" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle">Sanitation Worker</text>

                <!-- Arrows -->
                <line x1="120" y1="120" x2="185" y2="120" stroke="#000" stroke-width="1.5"/>
                <line x1="185" y1="140" x2="120" y2="140" stroke="#000" stroke-width="1.5"/>

                <line x1="295" y1="120" x2="360" y2="120" stroke="#000" stroke-width="1.5"/>
                <line x1="360" y1="140" x2="295" y2="140" stroke="#000" stroke-width="1.5"/>

                <line x1="230" y1="60" x2="230" y2="75" stroke="#000" stroke-width="1.5"/>
                <line x1="250" y1="75" x2="250" y2="60" stroke="#000" stroke-width="1.5"/>
            </svg>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p24)

# PAGE 25: CHAPTER 6 DFD LEVEL 1 ADMIN SVG
p25 = f'''<div class="page">
    {make_header(19)}
    <div class="content">
        <h3 class="sec-title">6.6 DFD Level 1 - Admin Subsystem</h3>
        <div class="center" style="margin-top: 10mm;">
            <svg width="460" height="320" viewBox="0 0 460 320" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="140" width="80" height="40" fill="#e2e8f0" stroke="#000"/>
                <text x="50" y="164" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle">Admin</text>

                <!-- Processes -->
                <circle cx="180" cy="60" r="30" fill="#fff" stroke="#0284c7" stroke-width="2"/>
                <text x="180" y="64" font-family="Arial" font-size="9" text-anchor="middle">Manage Users</text>

                <circle cx="180" cy="160" r="30" fill="#fff" stroke="#0284c7" stroke-width="2"/>
                <text x="180" y="164" font-family="Arial" font-size="9" text-anchor="middle">Assign Tasks</text>

                <circle cx="180" cy="260" r="30" fill="#fff" stroke="#0284c7" stroke-width="2"/>
                <text x="180" y="264" font-family="Arial" font-size="9" text-anchor="middle">View Analytics</text>

                <!-- Data Stores -->
                <rect x="330" y="45" width="100" height="30" fill="#f8fafc" stroke="#000"/>
                <text x="380" y="64" font-family="Arial" font-size="9" text-anchor="middle">Table User</text>

                <rect x="330" y="145" width="100" height="30" fill="#f8fafc" stroke="#000"/>
                <text x="380" y="164" font-family="Arial" font-size="9" text-anchor="middle">Table Complaint</text>

                <!-- Lines -->
                <line x1="90" y1="150" x2="150" y2="65" stroke="#000"/>
                <line x1="90" y1="160" x2="150" y2="160" stroke="#000"/>
                <line x1="90" y1="170" x2="150" y2="255" stroke="#000"/>

                <line x1="210" y1="60" x2="330" y2="60" stroke="#000"/>
                <line x1="210" y1="160" x2="330" y2="160" stroke="#000"/>
            </svg>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p25)

# PAGE 26: CHAPTER 6 DFD LEVEL 1 WORKER & CITIZEN SVG
p26 = f'''<div class="page">
    {make_header(20)}
    <div class="content">
        <h3 class="sec-title">6.6 DFD Level 1 - Worker & Citizen Subsystem</h3>
        <div class="center" style="margin-top: 10mm;">
            <svg width="460" height="320" viewBox="0 0 460 320" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="80" width="80" height="40" fill="#e2e8f0" stroke="#000"/>
                <text x="50" y="104" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle">Citizen</text>

                <rect x="10" y="200" width="80" height="40" fill="#e2e8f0" stroke="#000"/>
                <text x="50" y="224" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle">Worker</text>

                <!-- Processes -->
                <circle cx="180" cy="100" r="30" fill="#fff" stroke="#0284c7" stroke-width="2"/>
                <text x="180" y="104" font-family="Arial" font-size="9" text-anchor="middle">Report Dump</text>

                <circle cx="180" cy="220" r="30" fill="#fff" stroke="#0284c7" stroke-width="2"/>
                <text x="180" y="224" font-family="Arial" font-size="9" text-anchor="middle">Upload Proof</text>

                <!-- Data Store -->
                <rect x="330" y="150" width="100" height="30" fill="#f8fafc" stroke="#000"/>
                <text x="380" y="169" font-family="Arial" font-size="9" text-anchor="middle">Table Complaint</text>

                <line x1="90" y1="100" x2="150" y2="100" stroke="#000"/>
                <line x1="90" y1="220" x2="150" y2="220" stroke="#000"/>
                <line x1="210" y1="100" x2="330" y2="155" stroke="#000"/>
                <line x1="210" y1="220" x2="330" y2="175" stroke="#000"/>
            </svg>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p26)

# PAGE 27: SECTION 7 DIVIDER
p27 = f'''<div class="page">
    {make_header(21)}
    <h1 class="section-cover-title">SYSTEM DEVELOPMENT</h1>
    {make_footer()}
</div>'''
pages.append(p27)

# PAGE 28: CHAPTER 7 CONTENT & MVC DIAGRAM
p28 = f'''<div class="page">
    {make_header(22)}
    <div class="content">
        <h2 class="chapter-title">7. SYSTEM DEVELOPMENT</h2>
        
        <h3 class="sec-title">7.1 Tech Stack & MVC Architecture</h3>
        <p>EcoClean follows the 3-Tier Model-View-Controller pattern:</p>
        
        <div class="center" style="margin: 6mm 0;">
            <svg width="420" height="150" viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="10" width="380" height="35" rx="5" fill="#0f172a"/>
                <text x="210" y="32" font-family="Arial" font-size="10" font-weight="bold" fill="#38bdf8" text-anchor="middle">React Single Page Application (Vite + Leaflet + Recharts)</text>

                <line x1="210" y1="45" x2="210" y2="65" stroke="#000" stroke-width="2"/>

                <rect x="20" y="65" width="380" height="35" rx="5" fill="#0284c7"/>
                <text x="210" y="87" font-family="Arial" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">Node.js & Express REST API Server (JWT + Multer Middleware)</text>

                <line x1="210" y1="100" x2="210" y2="120" stroke="#000" stroke-width="2"/>

                <rect x="20" y="120" width="380" height="25" rx="5" fill="#059669"/>
                <text x="210" y="137" font-family="Arial" font-size="9.5" font-weight="bold" fill="#ffffff" text-anchor="middle">MongoDB Atlas NoSQL Database</text>
            </svg>
        </div>

        <h3 class="sec-title">7.2 Coding Technologies</h3>
        <ul>
            <li><b>React.js:</b> Builds responsive dark-glassmorphism components.</li>
            <li><b>Express.js:</b> Serves fast RESTful endpoints with security middlewares.</li>
            <li><b>MongoDB & Mongoose:</b> Manages document persistence and spatial queries.</li>
        </ul>
    </div>
    {make_footer()}
</div>'''
pages.append(p28)

# PAGE 29: SECTION 8 DIVIDER
p29 = f'''<div class="page">
    {make_header(23)}
    <h1 class="section-cover-title">SYSTEM TESTING AND IMPLEMENTATION</h1>
    {make_footer()}
</div>'''
pages.append(p29)

# PAGE 30: CHAPTER 8 TESTING TABLE
p30 = f'''<div class="page">
    {make_header(24)}
    <div class="content">
        <h2 class="chapter-title">8. SYSTEM TESTING</h2>
        <p>Comprehensive tests were executed to ensure functionality and stability:</p>
        
        <table class="report-table">
            <thead>
                <tr>
                    <th>Test ID</th>
                    <th>Test Case Description</th>
                    <th>Input</th>
                    <th>Expected Result</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><b>TC-01</b></td>
                    <td>Citizen Signup</td>
                    <td>Valid email & password</td>
                    <td>HTTP 201 Created</td>
                    <td><span class="bold">PASS</span></td>
                </tr>
                <tr>
                    <td><b>TC-02</b></td>
                    <td>Invalid Login</td>
                    <td>Wrong password</td>
                    <td>HTTP 401 Unauthorized</td>
                    <td><span class="bold">PASS</span></td>
                </tr>
                <tr>
                    <td><b>TC-03</b></td>
                    <td>Report Garbage</td>
                    <td>GPS Pin + Before Photo</td>
                    <td>Ticket created as `pending`</td>
                    <td><span class="bold">PASS</span></td>
                </tr>
                <tr>
                    <td><b>TC-04</b></td>
                    <td>Worker Assignment</td>
                    <td>Select worker ID</td>
                    <td>Status becomes `assigned`</td>
                    <td><span class="bold">PASS</span></td>
                </tr>
                <tr>
                    <td><b>TC-05</b></td>
                    <td>Upload After Photo</td>
                    <td>Verification Image</td>
                    <td>Status becomes `cleaned`</td>
                    <td><span class="bold">PASS</span></td>
                </tr>
                <tr>
                    <td><b>TC-06</b></td>
                    <td>Points Credit</td>
                    <td>Admin Approval</td>
                    <td>Citizen points += 50</td>
                    <td><span class="bold">PASS</span></td>
                </tr>
            </tbody>
        </table>
    </div>
    {make_footer()}
</div>'''
pages.append(p30)

# PAGE 31: CHAPTER 8 IMPLEMENTATION
p31 = f'''<div class="page">
    {make_header(25)}
    <div class="content">
        <h3 class="sec-title">8.2 Implementation Details</h3>
        <p>
            Implementation transforms theoretical designs into an operational software system.
        </p>
        <ul>
            <li><b>Database Seeding:</b> Initialized seed data for demo workers, admin credentials, and mock coordinates.</li>
            <li><b>Environment Configuration:</b> Set up secure environment variables for MongoDB connection strings and secret JWT keys.</li>
            <li><b>Build Optimization:</b> Compiled frontend assets using Vite into static bundles for high performance.</li>
        </ul>
    </div>
    {make_footer()}
</div>'''
pages.append(p31)

# PAGE 32: SECTION 9 DIVIDER
p32 = f'''<div class="page">
    {make_header(26)}
    <h1 class="section-cover-title">SYSTEM MAINTENANCE</h1>
    {make_footer()}
</div>'''
pages.append(p32)

# PAGE 33: CHAPTER 9 MAINTENANCE
p33 = f'''<div class="page">
    {make_header(27)}
    <div class="content">
        <h2 class="chapter-title">9. SYSTEM MAINTENANCE</h2>
        <p>
            Ongoing software maintenance ensures adaptation to operational environment updates.
        </p>
        <ul>
            <li><b>Corrective Maintenance:</b> Fixing minor UI responsive rendering issues on mobile map markers.</li>
            <li><b>Adaptive Maintenance:</b> Upgrading dependency libraries to maintain compatibility with Node.js LTS versions.</li>
            <li><b>Perfective Maintenance:</b> Indexing database query fields to speed up coordinate search times.</li>
        </ul>
    </div>
    {make_footer()}
</div>'''
pages.append(p33)

# PAGE 34: SECTION 10 DIVIDER
p34 = f'''<div class="page">
    {make_header(28)}
    <h1 class="section-cover-title">FUTURE ENHANCEMENT</h1>
    {make_footer()}
</div>'''
pages.append(p34)

# PAGE 35: CHAPTER 10 FUTURE ENHANCEMENT
p35 = f'''<div class="page">
    {make_header(29)}
    <div class="content">
        <h2 class="chapter-title">10. FUTURE ENHANCEMENT</h2>
        <p>Future releases will expand EcoClean with modern features:</p>
        <ol style="line-height: 1.8;">
            <li><b>Real AI Waste Classification:</b> Integrating on-device TensorFlow models for instant image classification.</li>
            <li><b>Route Optimization Engine:</b> Calculating optimal pickup routes for sanitation trucks.</li>
            <li><b>IoT Smart Bin Integration:</b> Connecting fill-level sensors to automatically generate cleanup tickets.</li>
        </ol>
    </div>
    {make_footer()}
</div>'''
pages.append(p35)

# PAGE 36: SECTION 11 DIVIDER
p36 = f'''<div class="page">
    {make_header(30)}
    <h1 class="section-cover-title">CONCLUSION</h1>
    {make_footer()}
</div>'''
pages.append(p36)

# PAGE 37: CHAPTER 11 CONCLUSION
p37 = f'''<div class="page">
    {make_header(31)}
    <div class="content">
        <h2 class="chapter-title">11. CONCLUSION</h2>
        <p style="line-height: 1.8;">
            The <b>EcoClean Smart Waste Reporting and Management System</b> successfully digitalizes municipal sanitation management. By combining GPS map pinning, visual before/after validation, and citizen gamification rewards, the application addresses urban waste collection delays effectively.
        </p>
        <p style="line-height: 1.8;">
            Testing demonstrates that EcoClean provides an efficient, transparent platform for citizens, workers, and city administrators.
        </p>
    </div>
    {make_footer()}
</div>'''
pages.append(p37)

# PAGE 38: SECTION 12 DIVIDER
p38 = f'''<div class="page">
    {make_header(32)}
    <h1 class="section-cover-title">APPENDIX</h1>
    {make_footer()}
</div>'''
pages.append(p38)

# PAGE 39: APPENDIX API TABLE
p39 = f'''<div class="page">
    {make_header(33)}
    <div class="content">
        <h2 class="chapter-title">12. APPENDIX</h2>
        <h3 class="sec-title">12.1 API Endpoints Summary</h3>
        <table class="report-table">
            <thead>
                <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
            </thead>
            <tbody>
                <tr><td>`POST`</td><td>`/api/auth/register`</td><td>Registers a new citizen account</td></tr>
                <tr><td>`POST`</td><td>`/api/auth/login`</td><td>Authenticates user and returns JWT</td></tr>
                <tr><td>`POST`</td><td>`/api/complaints`</td><td>Creates new waste report with GPS pin</td></tr>
                <tr><td>`GET`</td><td>`/api/complaints`</td><td>Fetches all active map markers</td></tr>
                <tr><td>`PUT`</td><td>`/api/admin/assign`</td><td>Assigns ticket to worker/team</td></tr>
                <tr><td>`PUT`</td><td>`/api/worker/clean`</td><td>Uploads completion photo</td></tr>
            </tbody>
        </table>
    </div>
    {make_footer()}
</div>'''
pages.append(p39)

# PAGE 40: APPENDIX UI SCREENSHOTS 1
p40 = f'''<div class="page">
    {make_header(34)}
    <div class="content">
        <h3 class="sec-title center">Citizen Onboarding & Citizen Login</h3>
        <div class="phone-container">
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">EcoClean Onboarding</div>
                <div class="phone-body center">
                    <div style="font-size: 28pt; margin: 15px 0;">🛡️</div>
                    <div style="font-weight: bold; color: #38bdf8; font-size: 8pt; margin-bottom: 5px;">100% SECURE REPORTING</div>
                    <div style="color: #94a3b8; margin-bottom: 15px;">Report waste dumps with GPS mapping & earn Eco-Points!</div>
                    <div class="phone-btn">Get Started</div>
                </div>
            </div>
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">Citizen Portal Login</div>
                <div class="phone-body center">
                    <div style="font-size: 22pt; margin: 10px 0;">♻️</div>
                    <div style="font-size: 8pt; font-weight: bold; margin-bottom: 10px;">Welcome Back</div>
                    <div class="phone-card">Enter Email Address</div>
                    <div class="phone-card">Enter Password</div>
                    <div class="phone-btn">Login to EcoClean</div>
                </div>
            </div>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p40)

# PAGE 41: APPENDIX UI SCREENSHOTS 2
p41 = f'''<div class="page">
    {make_header(35)}
    <div class="content">
        <h3 class="sec-title center">Citizen Home & Profile Dashboard</h3>
        <div class="phone-container">
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">Citizen Home</div>
                <div class="phone-body">
                    <div class="phone-card" style="border-left: 3px solid #38bdf8;">
                        <b>Welcome, Athul</b><br>
                        <span>Eco-Points: 250 Coins</span>
                    </div>
                    <div class="phone-btn">📍 Report Waste Dump</div>
                    <div class="phone-btn" style="background: #059669;">🏆 View Leaderboard</div>
                </div>
            </div>
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">User Profile</div>
                <div class="phone-body center">
                    <div style="font-size: 24pt;">👤</div>
                    <div style="font-weight: bold; color: #38bdf8;">Athul Krishna R</div>
                    <div style="font-size: 6.5pt; color: #94a3b8; margin-bottom: 8px;">Badge: Eco Warrior 🎖️</div>
                    <div class="phone-card" style="text-align: left;">Reports Submitted: 5</div>
                    <div class="phone-card" style="text-align: left;">Cleanups Verified: 5</div>
                </div>
            </div>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p41)

# PAGE 42: APPENDIX UI SCREENSHOTS 3
p42 = f'''<div class="page">
    {make_header(36)}
    <div class="content">
        <h3 class="sec-title center">Report Complaint & AI Waste Survey</h3>
        <div class="phone-container">
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">Report Garbage Dump</div>
                <div class="phone-body">
                    <div class="phone-card">📍 Map Pin: 10.976, 76.223</div>
                    <div class="phone-card">📷 Attach Dump Photo</div>
                    <div class="phone-btn">Run AI Waste Scanner</div>
                </div>
            </div>
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">AI Waste Analysis</div>
                <div class="phone-body">
                    <div class="phone-card" style="border-left: 3px solid #eab308;">
                        <b>Scan Result:</b><br>
                        Category: Plastic / Mixed<br>
                        Severity: High
                    </div>
                    <div class="phone-btn">Submit Waste Report</div>
                </div>
            </div>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p42)

# PAGE 43: APPENDIX UI SCREENSHOTS 4
p43 = f'''<div class="page">
    {make_header(37)}
    <div class="content">
        <h3 class="sec-title center">Citizen Feedback & Admin Analytics</h3>
        <div class="phone-container">
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">Submit Feedback</div>
                <div class="phone-body">
                    <div class="phone-card">Rate Cleanup Quality: ⭐⭐⭐⭐⭐</div>
                    <div class="phone-card">Comments...</div>
                    <div class="phone-btn">Submit Rating</div>
                </div>
            </div>
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">Admin Analytics</div>
                <div class="phone-body">
                    <div class="phone-card">📊 Active Dumps: 12</div>
                    <div class="phone-card">✅ Resolved: 48</div>
                    <div class="phone-card">🚚 Workers Online: 6</div>
                </div>
            </div>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p43)

# PAGE 44: APPENDIX UI SCREENSHOTS 5
p44 = f'''<div class="page">
    {make_header(38)}
    <div class="content">
        <h3 class="sec-title center">Sanitation Worker Login & Active Job Sheet</h3>
        <div class="phone-container">
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">Worker Portal</div>
                <div class="phone-body center">
                    <div style="font-size: 20pt; margin: 8px 0;">🚚</div>
                    <div class="phone-card">Enter Worker ID</div>
                    <div class="phone-btn">Login to Workspace</div>
                </div>
            </div>
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">Active Assignments</div>
                <div class="phone-body">
                    <div class="phone-card" style="border-left: 3px solid #ef4444;">
                        <b>Task #104</b><br>
                        Location: Perinthalmanna<br>
                        Target: Today 5:00 PM
                    </div>
                    <div class="phone-btn">Navigate on Map</div>
                </div>
            </div>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p44)

# PAGE 45: APPENDIX UI SCREENSHOTS 6
p45 = f'''<div class="page">
    {make_header(39)}
    <div class="content">
        <h3 class="sec-title center">Worker Completion Upload & Verification</h3>
        <div class="phone-container">
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">Upload Clean Photo</div>
                <div class="phone-body">
                    <div class="phone-card">📷 Capture After Photo</div>
                    <div class="phone-btn">Upload Verification</div>
                </div>
            </div>
            <div class="phone-frame">
                <div class="phone-notch"></div>
                <div class="phone-header">Ticket Verification</div>
                <div class="phone-body center">
                    <div style="font-size: 24pt; color: #22c55e;">✅</div>
                    <div style="font-weight: bold; color: #22c55e;">Task Completed</div>
                    <div class="phone-card">Points Awarded to Citizen!</div>
                </div>
            </div>
        </div>
    </div>
    {make_footer()}
</div>'''
pages.append(p45)

# PAGE 46: SECTION 13 DIVIDER
p46 = f'''<div class="page">
    {make_header(40)}
    <h1 class="section-cover-title">BIBLIOGRAPHY</h1>
    {make_footer()}
</div>'''
pages.append(p46)

# PAGE 47: CHAPTER 13 BIBLIOGRAPHY
p47 = f'''<div class="page">
    {make_header(41)}
    <div class="content">
        <h2 class="chapter-title">13. BIBLIOGRAPHY</h2>
        
        <h3 class="sec-title">Reference Books</h3>
        <ol style="line-height: 1.8;">
            <li><b>Hillar, Gastón</b> (2018). <i>Learn Web Development with Python & Modern JavaScript</i>. Packt Publishing.</li>
            <li><b>Müller, Andreas C. & Guido, Sarah</b> (2017). <i>Introduction to Machine Learning: A Guide for Data Scientists</i>. O'Reilly Media.</li>
            <li><b>Dyer, Russell J. T.</b> (2019). <i>Database Design Patterns and Best Practices</i>. Second Edition. MySQL Press.</li>
        </ol>

        <h3 class="sec-title">Reference Websites</h3>
        <ol style="line-height: 1.8;">
            <li>MongoDB Documentation: <u>https://mongoosejs.com/docs/</u></li>
            <li>LeafletJS Mapping APIs: <u>https://leafletjs.com/</u></li>
            <li>OpenStreetMap GeoJSON standards: <u>https://www.openstreetmap.org/</u></li>
            <li>React.js Framework Documentation: <u>https://react.dev/</u></li>
            <li>Node.js API Reference: <u>https://nodejs.org/docs/</u></li>
        </ol>
    </div>
    {make_footer()}
</div>'''
pages.append(p47)

# Combine everything
full_html = html_head + "".join(pages) + "</body></html>"

os.makedirs('scratch', exist_ok=True)
html_path = os.path.abspath('scratch/EcoClean_Project_Report.html')
pdf_path = os.path.abspath('EcoClean_Project_Report.pdf')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(full_html)

print("HTML generated. Compiling PDF using Edge headless...")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
subprocess.run([edge_path, '--headless', f'--print-to-pdf={pdf_path}', '--no-pdf-header-footer', html_path])

print("PDF successfully generated at:", pdf_path)
print("File exists:", os.path.exists(pdf_path))
if os.path.exists(pdf_path):
    print("PDF size:", os.path.getsize(pdf_path), "bytes")
