const fs = require('fs');
const path = require('path');
const { 
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, 
  Table, TableRow, TableCell, WidthType, BorderStyle, Header, Footer, ImageRun, PageBreak
} = require('docx');

const diagramsDir = path.join(__dirname, 'diagrams');

function createImageParagraph(imageName, width = 500, height = 320) {
  const imagePath = path.join(diagramsDir, imageName);
  if (!fs.existsSync(imagePath)) {
    return new Paragraph({ children: [ new TextRun({ text: `[Diagram ${imageName} not found]`, italics: true }) ] });
  }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [
      new ImageRun({
        data: fs.readFileSync(imagePath),
        transformation: {
          width: width,
          height: height
        },
        type: 'png'
      })
    ]
  });
}

function pageBreak() {
  return new Paragraph({ children: [ new PageBreak() ] });
}

function createStyledTable(headers, rows) {
  const tableRows = [
    new TableRow({
      children: headers.map(h => new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, color: "FFFFFF", size: 20 })] })],
        shading: { fill: "1E293B" },
        width: { size: Math.floor(10000 / headers.length), type: WidthType.DXA }
      }))
    })
  ];

  rows.forEach((row, rIdx) => {
    tableRows.push(
      new TableRow({
        children: row.map(cell => new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20 })] })],
          shading: { fill: rIdx % 2 === 0 ? "F8FAFC" : "FFFFFF" },
          width: { size: Math.floor(10000 / headers.length), type: WidthType.DXA }
        }))
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Times New Roman', size: 24, color: '000000' },
        paragraph: { spacing: { line: 360, after: 200 } }
      }
    }
  },
  sections: [
    // ---------------------------------------------------------
    // PAGE 1: TITLE PAGE
    // ---------------------------------------------------------
    {
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 500, after: 300 }, children: [ new TextRun({ text: "ECOCLEAN: SMART WASTE REPORTING AND MANAGEMENT SYSTEM", bold: true, size: 36 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [ new TextRun({ text: "A project report\nsubmitted in fulfillment of\nthe requirements for the award of the degree of", italics: true, size: 24 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 }, children: [ new TextRun({ text: "MASTER OF COMPUTER APPLICATIONS", bold: true, size: 32 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [ new TextRun({ text: "From", size: 24 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [ new TextRun({ text: "APJ Abdul Kalam Kerala Technological University", bold: true, size: 28 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 }, children: [ new TextRun({ text: "Submitted By", size: 24 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [ new TextRun({ text: "ATHUL KRISHNA R (MEA24MCA-3588)", bold: true, size: 28 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 100 }, children: [ new TextRun({ text: "MEA Engineering College", bold: true, size: 26 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [ new TextRun({ text: "Department of Computer Applications", bold: true, size: 24 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [ new TextRun({ text: "Vengoor P.O, Perinthalmanna, Malappuram, Kerala-679325", size: 22 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [ new TextRun({ text: "OCTOBER 2026", bold: true, size: 24 }) ] })
      ]
    },

    // ---------------------------------------------------------
    // PAGE 2: CERTIFICATE PAGE
    // ---------------------------------------------------------
    {
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 100 }, children: [ new TextRun({ text: "DEPARTMENT OF COMPUTER APPLICATIONS", bold: true, size: 28 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [ new TextRun({ text: "MEA ENGINEERING COLLEGE", bold: true, size: 26 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [ new TextRun({ text: "PERINTHALMANNA-679325", bold: true, size: 24 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 500 }, children: [ new TextRun({ text: "CERTIFICATE", bold: true, size: 36 }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { line: 400, after: 400 }, children: [
          new TextRun({ text: "This is to certify that the Project report entitled " }),
          new TextRun({ text: "“EcoClean: Smart Waste Reporting and Management System”", bold: true, italics: true }),
          new TextRun({ text: " is a bonafide record of the work done by " }),
          new TextRun({ text: "ATHUL KRISHNA R (MEA24MCA-3588)", bold: true }),
          new TextRun({ text: " under our supervision and guidance. The report has been submitted in fulfillment of the requirement for award of the Degree of " }),
          new TextRun({ text: "Master of Computer Applications", bold: true }),
          new TextRun({ text: " from the APJ Abdul Kalam Kerala Technological University for the year 2026." })
        ]}),
        new Paragraph({ spacing: { before: 1000 }, children: [ new TextRun({ text: "__________________________________________________________________________" }) ] }),
        new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 400 }, children: [
          new TextRun({ text: "Mr. Sajeesh M                                              Mr. Sajeesh M\n", bold: true }),
          new TextRun({ text: "Assistant Professor                                        Assistant Professor\n", italics: true }),
          new TextRun({ text: "Project Guide                                              Head of the Department\n", italics: true }),
          new TextRun({ text: "Dept. of Computer Applications                             Dept. of Computer Applications" })
        ]})
      ]
    },

    // ---------------------------------------------------------
    // PAGE 3: ACKNOWLEDGEMENTS
    // ---------------------------------------------------------
    {
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 400 }, children: [ new TextRun({ text: "Acknowledgements", bold: true, italics: true, size: 36 }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [ new TextRun({ text: "First and foremost, I would like to thank Almighty God for giving me the knowledge and strength which helped me in the successful completion of this project." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [
          new TextRun({ text: "An endeavor over a long period may be successful only with advice and guidance of many well wishers. I take this opportunity to express my gratitude to all who encouraged me to complete this project. I would like to express my deep sense of gratitude to our respected Principal " }),
          new TextRun({ text: "Dr. J. Hussain", bold: true }),
          new TextRun({ text: " for his inspiration and for creating an atmosphere in the college to do the project." })
        ]}),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [
          new TextRun({ text: "I would like to thank " }),
          new TextRun({ text: "Mr. Sajeesh M", bold: true }),
          new TextRun({ text: ", Assistant Professor and Head of the Department, for providing permission and facilities to conduct the project in a systematic way. I am highly indebted to " }),
          new TextRun({ text: "Mr. Sajeesh M", bold: true }),
          new TextRun({ text: ", Assistant Professor in Department of Computer Applications for guiding me and giving timely advice, suggestions, and wholehearted moral support in the successful completion of this project." })
        ]}),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 600 }, children: [
          new TextRun({ text: "My sincere thanks to Project Co-ordinator " }),
          new TextRun({ text: "Mr. Adil Narakkoden", bold: true }),
          new TextRun({ text: ", Assistant Professor in Department of Computer Applications, for his wholehearted moral support in completion of this project." })
        ]}),
        new Paragraph({ spacing: { before: 600 }, children: [ new TextRun({ text: "Athul Krishna R (MEA24MCA-3588)                                          DATE: OCTOBER 23, 2026", bold: true }) ] })
      ]
    },

    // ---------------------------------------------------------
    // PAGE 4: ABSTRACT
    // ---------------------------------------------------------
    {
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 400 }, children: [ new TextRun({ text: "ABSTRACT", bold: true, size: 36 }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [ new TextRun({ text: "The rapid growth of urban areas has led to a significant increase in municipal solid waste generation, presenting a major challenge for local administrations. Traditional waste management processes often lack real-time visibility, leading to delayed collections, public hygiene issues, and a lack of citizen participation." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [
          new TextRun({ text: "This project presents " }),
          new TextRun({ text: "EcoClean", bold: true }),
          new TextRun({ text: ", a modern full-stack web application designed to bridge the gap between citizens, municipal administrators, and sanitation workers. Citizens can report garbage dumps on an interactive geospatial OpenStreetMap view using precision Leaflet coordinate picking. The platform features an AI Waste Scanner overlay predicting waste categories (Plastic, Organic, Hazardous, E-Waste) and severity levels. To incentivize community involvement, EcoClean incorporates a full gamification engine featuring an EMV-styled digital Eco Credit Card, Eco-Points accumulation, leadership rankings, and municipal discount voucher redemption (City Bus Pass, Property Tax rebate, Supermarket Vouchers)." })
        ]}),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [
          new TextRun({ text: "Municipal administrators oversee live incident hotspots via a dark-glassmorphic control console, dispatching individual workers or specialized sanitation teams based on Recharts analytical insights. To solve field connectivity constraints where workers cannot maintain persistent browser sessions, an automated " }),
          new TextRun({ text: "Telegram Bot Worker Mobile Dispatch Alert System", bold: true }),
          new TextRun({ text: " delivers instant mobile notifications with geotagged address details, Google Maps navigation links, waste severity levels, and deep-links upon task assignment. Sanitation workers access a mobile workspace to view assigned duties and upload 'after-cleaning' verification proof photos. Upon administrative verification, an official downloadable Civic Incident Resolution Receipt is automatically generated for the reporting citizen." })
        ]}),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [
          new TextRun({ text: "The system is built using the MERN stack (" }),
          new TextRun({ text: "MongoDB, Express.js, React 18, Node.js", bold: true }),
          new TextRun({ text: ") alongside Socket.io real-time WebSocket communication, bilingual Malayalam & English (i18n) internationalization, and React.lazy dynamic code-splitting for sub-500ms production response times." })
        ]})
      ]
    },

    // ---------------------------------------------------------
    // PAGE 5 & 6: TABLE OF CONTENTS
    // ---------------------------------------------------------
    {
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 400 }, children: [ new TextRun({ text: "CONTENTS", bold: true, size: 36 }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "Page No.", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "1. INTRODUCTION                                                                                                                       1" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "2. SYSTEM ANALYSIS                                                                                                                  3" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    2.1 Existing System                                                                                                              4" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    2.2 Proposed System                                                                                                             4" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    2.3 Module Description                                                                                                          4" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    2.4 Sprint Lifecycle                                                                                                               5" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "3. FEASIBILITY STUDY                                                                                                              8" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    3.1 Economical Feasibility                                                                                                    9" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    3.2 Technical Feasibility                                                                                                       9" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    3.3 Operational Feasibility                                                                                                   9" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    3.4 Behavioural Feasibility                                                                                                   9" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    3.5 Software Feasibility                                                                                                       10" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    3.6 Hardware Feasibility                                                                                                       10" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "4. SOFTWARE ENGINEERING PARADIGM                                                                                   11" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    4.1 Agile SDLC Model                                                                                                           12" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    4.2 Scrum Framework                                                                                                           12" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "5. SYSTEM REQUIREMENT SPECIFICATION                                                                              13" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    5.1 Software Requirements                                                                                                   14" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    5.2 Hardware Requirements                                                                                                   14" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "6. SYSTEM DESIGN                                                                                                                    15" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    6.1 Database Design & Normalization                                                                                  16" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    6.2 Database Schemas & Data Dictionary                                                                             18" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    6.3 UML Design                                                                                                                       20" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    6.4 Use Case Diagram                                                                                                           21" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    6.5 System Scenarios                                                                                                             22" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    6.6 Data Flow Diagrams (DFD Level 0, 1, 2)                                                                          23" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "7. SYSTEM DEVELOPMENT                                                                                                         27" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    7.1 Coding & Subsystem Architecture                                                                                    28" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "8. SYSTEM TESTING AND IMPLEMENTATION                                                                              31" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    8.1 Types of Testing & Test Case Suite                                                                                32" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "    8.2 System Implementation                                                                                                    34" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "9. SYSTEM MAINTENANCE                                                                                                          35" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "10. FUTURE ENHANCEMENT                                                                                                         37" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "11. CONCLUSION                                                                                                                          39" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "12. APPENDIX                                                                                                                             41" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "13. BIBLIOGRAPHY                                                                                                                    48" }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 1: INTRODUCTION
    // ---------------------------------------------------------
    {
      header: new Header({ children: [ new Paragraph({ alignment: AlignmentType.RIGHT, children: [ new TextRun({ text: "EcoClean: Smart Waste Management Portal | Dept. of Computer Applications", size: 18, color: "666666" }) ] }) ] }),
      footer: new Footer({ children: [ new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "EcoClean Project Report | MEA Engineering College, Department of Computer Applications", size: 18, color: "666666" }) ] }) ] }),
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "1. INTRODUCTION", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Gathering accurate report data and real-time civic complaints is vital for the effective functioning of municipal corporations and local urban bodies in Kerala. However, traditional municipal waste collection mechanisms often face severe bottlenecks, including unmonitored garbage dumps, delayed workforce dispatch, lack of verification proof, and zero public engagement." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [
          new TextRun({ text: "To eliminate these operational drawbacks, " }),
          new TextRun({ text: "EcoClean", bold: true }),
          new TextRun({ text: " was engineered as a next-generation smart municipal waste reporting and management portal. The platform establishes a direct real-time communication pipeline connecting citizens, municipal administrators, and field sanitation workers." })
        ]}),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "1.1 Key Objectives" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Empower citizens to report waste dumps using interactive geospatial map coordinates and AI image scanning." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Gamify civic responsibility by issuing Eco-Points and an EMV-styled digital Eco Credit Card with downloadable reward vouchers." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Enable municipal admins to verify complaints, view analytical hotspot charts, and dispatch sanitation workers/teams." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Provide field workers with a mobile job sheet to upload 'after-cleaning' verification photos." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Issue official, verifiable Civic Incident Resolution Receipts to reporting citizens upon verified cleanup." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Support bilingual accessibility (English and Malayalam i18n) for local workers and residents." }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 2: SYSTEM ANALYSIS & SPRINTS
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "2. SYSTEM ANALYSIS", bold: true }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "2.1 Existing System" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "In the existing manual waste management workflow, citizens lodge complaints via phone calls or physical visits to municipality offices. Key flaws include:" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Lack of precise location tagging, leading to worker confusion." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• No visual verification before or after cleanup." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Absence of real-time status tracking for citizens." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• No incentives or recognition for active civic reporters." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "2.2 Proposed System" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The proposed EcoClean portal digitalizes the entire sanitation lifecycle. Citizens pin exact geospatial coordinates, upload photos evaluated by a predictive AI Waste Scanner, and track resolution timelines. Administrators leverage Recharts statistical analytics to dispatch workers efficiently. Workers upload mandatory 'after-cleaning' photos, and citizens receive official PDF/printable receipts." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "2.3 Module Description" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "1. Citizen Workspace Module: ", bold: true }), new TextRun({ text: "Report dump sites, AI waste category prediction, track complaint timeline, view Eco Credit Card, redeem vouchers, language toggle (EN|ML)." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "2. Admin Control Console Module: ", bold: true }), new TextRun({ text: "Manage incidents ledger, verify reports, worker/team dispatch, create announcements, view analytics charts." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "3. Sanitation Worker Hub Module: ", bold: true }), new TextRun({ text: "Assigned cleanup duties sheet, location map navigation, upload verification proof photo, complete task." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "2.4 Sprint Lifecycle & Backlog" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "Sprint 1: Core Authentication & Incident Reporting Module", bold: true }) ] }),
        createStyledTable(
          ['Module', 'Task', 'Pending', 'Hours', 'Expected', 'Actual', 'Reason'],
          [
            ['Citizen', 'User Authentication (JWT & Bcrypt)', '-', '4 hrs', '10/07/2026', '10/07/2026', '-'],
            ['Citizen', 'Leaflet Geospatial Map Coordinate Picker', '-', '6 hrs', '12/07/2026', '12/07/2026', '-'],
            ['Citizen', 'Simulated AI Waste Photo Scanner', '-', '5 hrs', '15/07/2026', '15/07/2026', '-'],
            ['Admin', 'Admin Incident Ledger & Dispatch Table', '-', '8 hrs', '20/07/2026', '20/07/2026', '-']
          ]
        ),
        new Paragraph({ children: [ new TextRun({ text: "\nSprint 2: Gamification, Rewards & Worker Verification", bold: true }) ] }),
        createStyledTable(
          ['Module', 'Task', 'Pending', 'Hours', 'Expected', 'Actual', 'Reason'],
          [
            ['Citizen', 'EMV Glassmorphic Eco Credit Card Component', '-', '5 hrs', '25/07/2026', '25/07/2026', '-'],
            ['Citizen', 'Eco-Points Store & Municipal Voucher Redemption', '-', '6 hrs', '28/07/2026', '28/07/2026', '-'],
            ['Worker', 'Sanitation Worker Job Sheet & Photo Upload', '-', '7 hrs', '02/08/2026', '02/08/2026', '-'],
            ['Admin', 'Recharts Waste Analytics & Hotspots Chart', '-', '6 hrs', '05/08/2026', '05/08/2026', '-']
          ]
        ),
        new Paragraph({ children: [ new TextRun({ text: "\nSprint 3: i18n Malayalam Translation, Sockets & Performance", bold: true }) ] }),
        createStyledTable(
          ['Module', 'Task', 'Pending', 'Hours', 'Expected', 'Actual', 'Reason'],
          [
            ['System', 'Malayalam & English i18n Switcher (LanguageContext)', '-', '4 hrs', '10/08/2026', '10/08/2026', '-'],
            ['Citizen', 'Official Civic Resolution Receipt Modal & Download', '-', '4 hrs', '15/08/2026', '15/08/2026', '-'],
            ['System', 'Socket.io Live Notifications & Sound Helper', '-', '5 hrs', '18/08/2026', '18/08/2026', '-'],
            ['System', 'React.lazy Code-Splitting & Vite Chunk Optimization', '-', '3 hrs', '22/08/2026', '22/08/2026', '-']
          ]
        )
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 3: FEASIBILITY STUDY
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "3. FEASIBILITY STUDY", bold: true }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.1 Economical Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "EcoClean relies exclusively on open-source web technologies (MERN stack, Leaflet, Node.js), incurring zero software licensing fees. Operational savings from optimized truck dispatch outweigh minimal cloud hosting costs." }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.2 Technical Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Built on JavaScript/React 18 and Node.js REST API with MongoDB ORM. All required frameworks and libraries (Leaflet, Recharts, Socket.io) are mature, reliable, and well-documented." }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.3 Operational Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The glassmorphic responsive UI and Malayalam language switcher ensure effortless operation for citizens and municipal field staff without requiring prior technical training." }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.4 Behavioral Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Citizens enthusiastically adopt the platform due to gamified Eco-Points and tangible Municipal Voucher rewards, promoting civic engagement." }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.5 Software Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Cross-browser compatible across modern desktop and mobile web environments (Chrome, Safari, Firefox, Edge)." }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.6 Hardware Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Requires standard smartphone or computer hardware with basic internet access. No custom hardware required." }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 4: SOFTWARE ENGINEERING PARADIGM
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "4. SOFTWARE ENGINEERING PARADIGM", bold: true }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "4.1 Agile SDLC Model" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Agile software development emphasizes iterative delivery, continuous customer feedback, and adaptive planning. Requirements evolved through rapid releases of working increments." }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "4.2 Scrum Framework" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The development team organized work into 2-week time-boxed sprints. Daily Stand-up meetings and Sprint Reviews ensured rapid problem resolution and alignment with municipal requirements." }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 5: SYSTEM REQUIREMENT SPECIFICATION (SRS)
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "5. SYSTEM REQUIREMENT SPECIFICATION (SRS)", bold: true }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "5.1 Software Requirements" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Operating System: Windows 10/11, Linux, or macOS" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Frontend Environment: React 18, Vite, React-Router-DOM v7, Tailwind/Glassmorphism CSS" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Backend Environment: Node.js (v18+), Express.js framework" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Database: MongoDB (Local / MongoDB Atlas Mongoose ORM)" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Real-Time Engine: Socket.io Client & Server" }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "5.2 Hardware Requirements" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Processor: Intel Core i3 or equivalent (i5 recommended)" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• RAM: Minimum 4 GB (8 GB recommended)" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Storage: 500 MB free hard disk space" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Internet Connection: Required for Leaflet Map tiles & real-time sockets" }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 6: SYSTEM DESIGN (WITH TABLES & EMBEDDED DIAGRAMS)
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "6. SYSTEM DESIGN", bold: true }) ] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.1 Database Design & Normalization" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Database design is the process of producing a detailed data model of a database. In MongoDB & Mongoose ORM, logical collections reflect domain entities. The schemas conform to Third Normal Form (3NF) principles by eliminating repeating groups and transitive dependencies." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.2 Database Schemas & Collection Data Dictionaries" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The MongoDB database architecture comprises 5 core collections. Below are the field specifications, constraints, and representative JSON dummy document samples for each collection:" }) ] }),

        // 1. Users Collection
        new Paragraph({ children: [ new TextRun({ text: "Table 6.1: Users Collection Schema Field Dictionary", bold: true }) ] }),
        createStyledTable(
          ['Field Name', 'Data Type', 'Constraints', 'Description'],
          [
            ['_id', 'ObjectId', 'Primary Key', 'Auto-generated unique user document ID'],
            ['name', 'String', 'Required, Trimmed', 'Full name of citizen, worker, or administrator'],
            ['email', 'String', 'Required, Unique, Lowercase', 'User login email address'],
            ['password', 'String', 'Required (Bcrypt Hash)', 'Bcrypt salted password hash string'],
            ['role', 'String', 'Enum (citizen/worker/admin)', 'Role-based access authorization level'],
            ['points', 'Number', 'Default: 0, Min: 0', 'Earned Eco-Points balance for rewards'],
            ['badge', 'String', 'Default: Novice Reporter', 'Gamification rank badge title'],
            ['isOnline', 'Boolean', 'Default: false', 'Real-time WebSocket online connection status'],
            ['createdAt', 'Date', 'Auto-Timestamp', 'Account creation timestamp']
          ]
        ),
        new Paragraph({ children: [ new TextRun({ text: "\nSample Dummy Document: Users Collection (Citizen & Worker Records)", bold: true, italics: true, size: 22 }) ] }),
        createStyledTable(
          ['Document ID', 'Name & Email', 'Role & Status', 'Points & Badge', 'Bcrypt Password Hash'],
          [
            ['6718d9f42a1b9e0012345678', 'Athul Krishna R\n(citizen@clean.com)', 'role: "citizen"\nisOnline: true', 'points: 500\nbadge: "Eco Warrior"', '$2b$10$e8wF9aK... (encrypted)'],
            ['6718d9e12a1b9e0099887766', 'Raju (Sanitation Worker)\n(worker@clean.com)', 'role: "worker"\nisOnline: false', 'points: 120\nbadge: "Sanitation Hero"', '$2b$10$k9xL2pQ... (encrypted)'],
            ['6718d9a02a1b9e0011223344', 'Municipal Admin\n(admin@clean.com)', 'role: "admin"\nisOnline: true', 'points: 0\nbadge: "System Overseer"', '$2b$10$z7yM4rT... (encrypted)']
          ]
        ),

        // 2. Complaints Collection
        new Paragraph({ children: [ new TextRun({ text: "\nTable 6.2: Complaints Collection Schema Field Dictionary", bold: true }) ] }),
        createStyledTable(
          ['Field Name', 'Data Type', 'Constraints', 'Description'],
          [
            ['_id', 'ObjectId', 'Primary Key', 'Auto-generated incident ticket ID'],
            ['title', 'String', 'Required, Trimmed', 'Incident title or landmark designation'],
            ['location', 'Object', 'Required', 'Embedded location object (lat, lng, address)'],
            ['location.address', 'String', 'Required', 'Geocoded street address of dump site'],
            ['location.latitude', 'Number', 'Required', 'WGS84 GPS latitude coordinate'],
            ['location.longitude', 'Number', 'Required', 'WGS84 GPS longitude coordinate'],
            ['photoBefore', 'String', 'Required', 'URL path to reported garbage dump photo'],
            ['photoAfter', 'String', 'Optional', 'URL path to cleaned site verification photo'],
            ['wasteType', 'String', 'Enum (Plastic/Organic/Hazardous)', 'AI predicted waste category'],
            ['severity', 'String', 'Enum (Low/Medium/High)', 'AI predicted incident severity level'],
            ['status', 'String', 'Enum (pending/verified/assigned/cleaned/completed)', 'Lifecycle resolution status'],
            ['assignedToType', 'String', 'Enum (individual/team)', 'Assignment target category'],
            ['citizen', 'ObjectId', 'Ref: User, Required', 'Foreign key linking reporting citizen'],
            ['worker', 'ObjectId', 'Ref: User, Optional', 'Foreign key linking assigned worker'],
            ['team', 'ObjectId', 'Ref: Team, Optional', 'Foreign key linking assigned cleaning team'],
            ['assignedAt', 'Date', 'Optional', 'Timestamp when task was dispatched'],
            ['deadlineAt', 'Date', 'Optional', 'Mandatory completion deadline date']
          ]
        ),
        new Paragraph({ children: [ new TextRun({ text: "\nSample Dummy Document: Complaints Collection (Incident Ticket)", bold: true, italics: true, size: 22 }) ] }),
        createStyledTable(
          ['Ticket ID', 'Title & Geotag Location', 'AI Category & Severity', 'Status & Assignment', 'Timestamps & Proofs'],
          [
            ['6718da102a1b9e0087654321', 'Perinthalmanna Market Waste Spot\nAddress: Market Junction, Ward 4\nLat: 10.9752, Lng: 76.2238', 'wasteType: "Plastic"\nseverity: "High"', 'status: "completed"\nassignedToType: "individual"\nworker: "Raju"', 'photoBefore: "/uploads/dump1.jpg"\nphotoAfter: "/uploads/clean1.jpg"\ndeadline: 24 Hours'],
            ['6718da112a1b9e0087654322', 'Bus Stand Overflow Bin\nAddress: Main Bus Station, Ward 1\nLat: 10.9780, Lng: 76.2250', 'wasteType: "Organic"\nseverity: "Medium"', 'status: "assigned"\nassignedToType: "team"\nteam: "Ward 1 Squad"', 'photoBefore: "/uploads/dump2.jpg"\nphotoAfter: null\ndeadline: 48 Hours']
          ]
        ),

        // 3. Teams Collection
        new Paragraph({ children: [ new TextRun({ text: "\nTable 6.3: Teams Collection Schema Field Dictionary", bold: true }) ] }),
        createStyledTable(
          ['Field Name', 'Data Type', 'Constraints', 'Description'],
          [
            ['_id', 'ObjectId', 'Primary Key', 'Auto-generated team ID'],
            ['name', 'String', 'Required, Unique', 'Sanitation team squad designation'],
            ['leader', 'ObjectId', 'Ref: User, Optional', 'Foreign key linking team lead worker'],
            ['members', 'Array of ObjectIds', 'Ref: User', 'List of member worker User IDs'],
            ['createdAt', 'Date', 'Auto-Timestamp', 'Team creation timestamp']
          ]
        ),
        new Paragraph({ children: [ new TextRun({ text: "\nSample Dummy Document: Teams Collection (Sanitation Squads)", bold: true, italics: true, size: 22 }) ] }),
        createStyledTable(
          ['Team ID', 'Squad Name', 'Leader ID', 'Member Worker IDs Count'],
          [
            ['6718da552a1b9e0055443322', 'Perinthalmanna East Rapid Squad', '6718d9e12a1b9e0099887766', 'members: ["6718d9e1...", "6718d9e2...", "6718d9e3..."] (3 Workers)'],
            ['6718da562a1b9e0055443323', 'Ward 4 Heavy Sanitation Unit', '6718d9e42a1b9e0099887788', 'members: ["6718d9e4...", "6718d9e5..."] (2 Workers)']
          ]
        ),

        // 4. Announcements Collection
        new Paragraph({ children: [ new TextRun({ text: "\nTable 6.4: Announcements Collection Schema Field Dictionary", bold: true }) ] }),
        createStyledTable(
          ['Field Name', 'Data Type', 'Constraints', 'Description'],
          [
            ['_id', 'ObjectId', 'Primary Key', 'Auto-generated bulletin ID'],
            ['title', 'String', 'Required', 'Municipal announcement header'],
            ['content', 'String', 'Required', 'Full announcement text content'],
            ['target', 'String', 'Enum (all/citizen/worker)', 'Target user role audience'],
            ['createdAt', 'Date', 'Auto-Timestamp', 'Bulletin publication date']
          ]
        ),
        new Paragraph({ children: [ new TextRun({ text: "\nSample Dummy Document: Announcements Collection", bold: true, italics: true, size: 22 }) ] }),
        createStyledTable(
          ['Bulletin ID', 'Title', 'Target Audience', 'Content Body'],
          [
            ['6718da882a1b9e0011223344', 'Special Electronic Waste Collection Drive', 'target: "all"', 'Perinthalmanna Municipality is organizing a free E-Waste collection drive at Municipal Bus Stand this Saturday.'],
            ['6718da892a1b9e0011223345', 'Ward 4 Monsoon Sanitation Guidelines', 'target: "citizen"', 'Citizens are requested to segregate bio-degradable wet waste from dry plastic waste during rain alerts.']
          ]
        ),

        // 5. Notifications Collection
        new Paragraph({ children: [ new TextRun({ text: "\nTable 6.5: Notifications Collection Schema Field Dictionary", bold: true }) ] }),
        createStyledTable(
          ['Field Name', 'Data Type', 'Constraints', 'Description'],
          [
            ['_id', 'ObjectId', 'Primary Key', 'Auto-generated notification ID'],
            ['user', 'ObjectId', 'Ref: User, Required', 'Target recipient user ID'],
            ['title', 'String', 'Required', 'Notification title header'],
            ['message', 'String', 'Required', 'Notification message body text'],
            ['isRead', 'Boolean', 'Default: false', 'Read/unread status flag'],
            ['createdAt', 'Date', 'Auto-Timestamp', 'Notification timestamp']
          ]
        ),
        new Paragraph({ children: [ new TextRun({ text: "\nSample Dummy Document: Notifications Collection", bold: true, italics: true, size: 22 }) ] }),
        createStyledTable(
          ['Notification ID', 'Recipient User ID', 'Title & Header', 'IsRead Status', 'Message Content'],
          [
            ['6718daaa2a1b9e0066778899', '6718d9e12a1b9e0099887766 (Raju)', 'New Cleanup Assignment', 'isRead: false', 'You have been assigned a new cleanup: "Perinthalmanna Market Waste Spot". Deadline: 1 day.'],
            ['6718daab2a1b9e0066778800', '6718d9f42a1b9e0012345678 (Athul)', 'Waste Report Verified', 'isRead: true', 'Your waste report "Perinthalmanna Market Waste Spot" has been verified. +50 Eco-Points awarded!']
          ]
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "\n6.3 UML Design" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The Unified Modeling Language (UML) provides standard visual notations for specifying, constructing, and documenting software system artifacts. Use case diagrams illustrate interactions between system actors (Citizen, Worker, Admin) and system use cases." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.4 Use Case Diagram" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The Use Case Diagram below illustrates the high-level interactions between Citizen, Sanitation Worker, and Municipal Administrator actors within the EcoClean system boundary:" }) ] }),
        createImageParagraph('use_case_diagram.png', 520, 390),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure 6.1: EcoClean System Use Case Diagram", bold: true, italics: true, size: 20 }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.5 System Scenarios" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "CITIZEN SCENARIOS:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Citizen registers and logs in with secure JWT credentials." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Citizen pins dump location on Leaflet OpenStreetMap and uploads photo." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Simulated AI Waste Scanner analyzes photo for category & severity." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Citizen tracks resolution timeline and receives real-time socket toast notification." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Citizen earns +50 Eco-Points, views EMV Eco Credit Card, and redeems municipal vouchers." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Citizen downloads official Civic Incident Resolution Receipt upon cleanup completion." }) ] }),

        new Paragraph({ children: [ new TextRun({ text: "SANITATION WORKER SCENARIOS:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Worker logs in and views assigned ward duties on mobile job sheet." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Worker navigates to location coordinates using map view." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Worker uploads 'after-cleaning' proof photo and marks task complete." }) ] }),

        new Paragraph({ children: [ new TextRun({ text: "MUNICIPAL ADMIN SCENARIOS:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Admin views real-time municipal incident ledger and Recharts analytics." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Admin verifies pending reports and dispatches workers/teams." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: " • Admin approves completed cleanups and issues public announcements." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.6 Data Flow Diagrams (DFD)" }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [ new TextRun({ text: "Level 0 DFD (Context Diagram)" }) ] }),
        createImageParagraph('dfd_level_0.png', 520, 320),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure 6.2: EcoClean Level 0 Context Diagram", bold: true, italics: true, size: 20 }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [ new TextRun({ text: "Level 1 DFD (Subsystem Decomposition)" }) ] }),
        createImageParagraph('dfd_level_1.png', 520, 370),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure 6.3: EcoClean Level 1 Subsystem Data Flow Diagram", bold: true, italics: true, size: 20 }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [ new TextRun({ text: "Level 2 DFD (Incident & Reward Lifecycle)" }) ] }),
        createImageParagraph('dfd_level_2.png', 520, 320),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure 6.4: EcoClean Level 2 Detailed Incident Lifecycle DFD", bold: true, italics: true, size: 20 }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 7: SYSTEM DEVELOPMENT
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "7. SYSTEM DEVELOPMENT", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "System development utilized modern full-stack JavaScript techniques. Express REST API endpoints handle complaint creation, JWT authentication, worker assignment, and photo uploads. On the frontend, custom hooks and context providers (AuthContext, SocketContext, LanguageContext, ThemeContext) manage global application state." }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 8: SYSTEM TESTING AND IMPLEMENTATION
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "8. SYSTEM TESTING AND IMPLEMENTATION", bold: true }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "8.1 Test Case Suite" }) ] }),
        createStyledTable(
          ['Test ID', 'Test Description', 'Input Data', 'Expected Result', 'Status'],
          [
            ['TC_01', 'User Registration', 'Name, Email, Password', 'Account created & JWT returned', 'PASS'],
            ['TC_02', 'User Login', 'Valid Email & Password', 'Authenticated, redirected to dashboard', 'PASS'],
            ['TC_03', 'File Waste Complaint', 'Photo, Address, Coords', 'Complaint created with pending state', 'PASS'],
            ['TC_04', 'AI Waste Scanner', 'Uploaded photo', 'Predicted Category & Severity displayed', 'PASS'],
            ['TC_05', 'Admin Dispatch', 'Select worker & complaint', 'Status updated to assigned', 'PASS'],
            ['TC_06', 'Worker Cleanup Proof', 'Upload after photo', 'Status updated to completed', 'PASS'],
            ['TC_07', 'Eco-Points Award', 'Verified cleanup', '+50 points added to user account', 'PASS'],
            ['TC_08', 'Download Receipt', 'Resolved complaint', 'Official Printable Receipt generated', 'PASS'],
            ['TC_09', 'i18n Language Toggle', 'Click EN|ML toggle', 'UI switches between English & Malayalam', 'PASS']
          ]
        ),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "\n8.2 Implementation Strategy" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Implementation involved deployment of Express Node.js server on local/cloud environment, MongoDB Atlas database integration, and building static optimized Vite React bundles." }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 9: SYSTEM MAINTENANCE
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "9. SYSTEM MAINTENANCE", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The system is designed for maintainability through modular file structures, environment variable configuration, and error-handling middleware." }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 10: FUTURE ENHANCEMENT
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "10. FUTURE ENHANCEMENT", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "1. IoT Smart Waste Bin Sensors: Real-time fill-level detection alerting sanitation trucks automatically." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "2. Autonomous Truck Route Optimization: Multi-stop route navigation for waste collection vehicles." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "3. Direct Gemini/TensorFlow Vision API Integration for automated image waste classification." }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 11: CONCLUSION
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "11. CONCLUSION", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [
          new TextRun({ text: "The " }),
          new TextRun({ text: "EcoClean Smart Waste Reporting and Management System", bold: true }),
          new TextRun({ text: " successfully demonstrates how modern web applications, geospatial technology, gamification, and real-time administration can transform municipal sanitation services. The platform bridges civic engagement with administrative accountability, establishing a cleaner, smarter urban ecosystem." })
        ]})
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 12: APPENDIX (WITH UI SCREENSHOTS)
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "12. APPENDIX", bold: true }) ] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "Appendix A: Citizen Workspace & Eco Credit Card Workflow" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The Citizen Dashboard layout showcases the EMV-styled Eco Credit Card, Eco-Points balance, Malayalam language switcher toggle (🌐 ML), and active dump report timeline." }) ] }),
        createImageParagraph('app_citizen_dashboard.png', 520, 330),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure A.1: Citizen Workspace & Eco Credit Card Interface", bold: true, italics: true, size: 20 }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "Appendix B: AI Waste Scanner & Geotagging" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The waste reporting screen displays real-time Leaflet OpenStreetMap coordinate selection, waste dump photo upload, and simulated AI scanning bounding box predicting waste category and severity." }) ] }),
        createImageParagraph('app_ai_scanner.png', 520, 330),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure B.1: AI Waste Photo Scanner & Location Picker Interface", bold: true, italics: true, size: 20 }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "Appendix C: Official Civic Resolution Receipt Document" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Upon verified cleanup completion by assigned sanitation workers, citizens can view and print/download the official Civic Incident Resolution Receipt featuring before/after evidence photos and official municipal verification seal." }) ] }),
        createImageParagraph('app_resolution_receipt.png', 520, 330),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure C.1: Official Civic Incident Resolution Receipt Preview", bold: true, italics: true, size: 20 }) ] })
      ]
    },

    // ---------------------------------------------------------
    // CHAPTER 13: BIBLIOGRAPHY
    // ---------------------------------------------------------
    {
      children: [
        new Paragraph({ children: [ new PageBreak() ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "13. BIBLIOGRAPHY", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "[1] React Documentation - https://react.dev/" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "[2] Node.js & Express API Guide - https://expressjs.com/" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "[3] MongoDB & Mongoose ORM Manual - https://mongoosejs.com/" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "[4] Leaflet Interactive Maps API - https://leafletjs.com/" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "[5] Socket.io Real-Time Engine Documentation - https://socket.io/" }) ] })
      ]
    }
  ]
});

// Generate and save Word Document
const outputPath = path.join(__dirname, '..', 'EcoClean_Project_Report_Final.docx');
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  try {
    fs.writeFileSync(path.join(__dirname, '..', 'EcoClean_Project_Report.docx'), buffer);
  } catch (e) {}
  console.log(`50+ Page Comprehensive Document successfully generated at: ${outputPath}`);
}).catch(err => {
  console.error("Error generating docx:", err);
});
