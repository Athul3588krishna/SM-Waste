const fs = require('fs');
const path = require('path');
const { 
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, 
  Table, TableRow, TableCell, WidthType, BorderStyle, Header, Footer, ImageRun, PageBreak, PageNumber
} = require('docx');

const diagramsDir = path.join(__dirname, 'diagrams');

function createImageParagraph(imageName, width = 450, height = 280) {
  const imagePath = path.join(diagramsDir, imageName);
  if (!fs.existsSync(imagePath)) {
    return new Paragraph({ children: [ new TextRun({ text: `[Image ${imageName} not found]`, italics: true }) ] });
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

function createDividerPage(titleText) {
  return [
    pageBreak(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 4000, after: 4000 },
      children: [
        new TextRun({ text: titleText, bold: true, size: 36, font: 'Times New Roman' })
      ]
    }),
    pageBreak()
  ];
}

function createStyledTable(headers, rows) {
  const tableRows = [
    new TableRow({
      children: headers.map(h => new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, color: "000000", size: 20, font: 'Times New Roman' })] })],
        shading: { fill: "F1F5F9" },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
          left: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
          right: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" }
        },
        width: { size: Math.floor(10000 / headers.length), type: WidthType.DXA }
      }))
    })
  ];

  rows.forEach((row) => {
    tableRows.push(
      new TableRow({
        children: row.map(cell => new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, font: 'Times New Roman' })] })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            left: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            right: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" }
          },
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

// Common Header & Footer for inner pages
const commonHeader = new Header({
  children: [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "94A3B8" } },
      children: [
        new TextRun({ text: "EcoClean Waste Management System                                                        ", italics: true, size: 20, font: 'Times New Roman' }),
        new TextRun({ children: [PageNumber.CURRENT], italics: true, size: 20, font: 'Times New Roman' })
      ]
    })
  ]
});

const commonFooter = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: "94A3B8" } },
      children: [
        new TextRun({ text: "Department of Computer Applications                                                     MEA Engineering College", size: 18, font: 'Times New Roman' })
      ]
    })
  ]
});

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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 200 }, children: [ new TextRun({ text: "ECOCLEAN SMART WASTE REPORTING AND MANAGEMENT SYSTEM", bold: true, size: 36 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 150 }, children: [ new TextRun({ text: "A project report\nsubmitted in fulfillment of\nthe requirements for the award of the degree of", italics: true, size: 24 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 150, after: 150 }, children: [ new TextRun({ text: "MASTER OF COMPUTER APPLICATIONS", bold: true, size: 32 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 150 }, children: [ new TextRun({ text: "From", size: 24 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [ new TextRun({ text: "APJ Abdul Kalam Kerala Technological University", bold: true, size: 26 }) ] }),
        createImageParagraph('ktu_logo.png', 130, 130),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 150, after: 100 }, children: [ new TextRun({ text: "Submitted By", size: 24 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [ new TextRun({ text: "MUHAMMED RINSHAD (MEA25MCA-2014)", bold: true, size: 28 }) ] }),
        createImageParagraph('mea_logo.png', 130, 130),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 150, after: 100 }, children: [ new TextRun({ text: "MEA Engineering College", bold: true, size: 26 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [ new TextRun({ text: "Department of Computer Applications", bold: true, size: 24 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [ new TextRun({ text: "Vengoor P.O, Perinthalmanna, Malappuram, Kerala-679325", size: 22 }) ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 150 }, children: [ new TextRun({ text: "OCTOBER 2026", bold: true, size: 24 }) ] })
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [ new TextRun({ text: "PERINTHALMANNA-679325", bold: true, size: 24 }) ] }),
        createImageParagraph('mea_logo.png', 140, 140),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 400 }, children: [ new TextRun({ text: "CERTIFICATE", bold: true, size: 32 }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 600 }, children: [
          new TextRun({ text: 'This is to certify that the Project report entitled "' }),
          new TextRun({ text: "EcoClean Smart Waste Reporting and Management System", bold: true }),
          new TextRun({ text: '" is a bonafide record of the work done by ' }),
          new TextRun({ text: "MUHAMMED RINSHAD (MEA25MCA-2014)", bold: true }),
          new TextRun({ text: " under our supervision and guidance. The report has been submitted in fulfillment of the requirement for award of the Degree of Master of Computer Applications from the APJ Abdul Kalam Kerala Technological University for the year 2026." })
        ]}),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [
                    new Paragraph({ children: [ new TextRun({ text: "Mr. Sajeesh M", bold: true }) ] }),
                    new Paragraph({ children: [ new TextRun({ text: "Assistant Professor", italics: true }) ] }),
                    new Paragraph({ children: [ new TextRun({ text: "Project Guide", italics: true }) ] }),
                    new Paragraph({ children: [ new TextRun({ text: "Dept. of Computer Applications", italics: true }) ] })
                  ]
                }),
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                  children: [
                    new Paragraph({ children: [ new TextRun({ text: "Mr. Sajeesh M", bold: true }) ] }),
                    new Paragraph({ children: [ new TextRun({ text: "Assistant Professor", italics: true }) ] }),
                    new Paragraph({ children: [ new TextRun({ text: "Head of the Department", italics: true }) ] }),
                    new Paragraph({ children: [ new TextRun({ text: "Dept. of Computer Applications", italics: true }) ] })
                  ]
                })
              ]
            })
          ]
        })
      ]
    },

    // ---------------------------------------------------------
    // PAGE 3: ACKNOWLEDGEMENTS
    // ---------------------------------------------------------
    {
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 400 }, children: [ new TextRun({ text: "Acknowledgements", bold: true, italics: true, size: 32 }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [ new TextRun({ text: "First and foremost, We would like to thank the Almighty God for giving us the knowledge and strength which helped us in the successful completion of this project." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [ new TextRun({ text: "An endeavor over a long period may be successful only with advice and guidance of many well wishers. We take this opportunity to express our gratitude to all who encouraged us to complete this project. We would like to express our deep sense of gratitude to our respected Principal Dr. J. Hussain for his inspiration and for creating an atmosphere in the college to do the project." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [ new TextRun({ text: "We would like to thank Mr. Sajeesh M, Assistant Professor and Head of the Department, for providing permission and facilities to conduct the project in a systematic way. We are highly indebted to Mr. Sajeesh M, Assistant Professor in Department of Computer Applications for guiding us and giving timely advices, suggestions and wholehearted moral support in the successful completion of this project." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 500 }, children: [ new TextRun({ text: "Our sincere thanks to Project Co-ordinator Mr. Adil Narakkoden, Assistant Professor in Department of Computer Applications for his wholehearted moral support in completion of this project." }) ] }),
        new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 600, after: 100 }, children: [ new TextRun({ text: "MUHAMMED RINSHAD T (MEA25MCA-2014)", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [ new TextRun({ text: "DATE: OCTOBER 25, 2026", bold: true }) ] })
      ]
    },

    // ---------------------------------------------------------
    // PAGE 4: ABSTRACT
    // ---------------------------------------------------------
    {
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 400 }, children: [ new TextRun({ text: "ABSTRACT", bold: true, size: 36 }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [ new TextRun({ text: "Traditional municipal waste management processes often rely on manual reporting, paper-based records, and unmonitored garbage dumps, making the overall workflow time-consuming, inefficient, and difficult to manage. Existing civic systems lack a centralized platform to verify cleanup requests, monitor workforce dispatches, and track real-time incident status effectively. As a result, citizens experience delays, local urban bodies struggle with delayed workforce allocations, and administrators face difficulties in maintaining operational transparency." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [
          new TextRun({ text: "To overcome these challenges, I developed the " }),
          new TextRun({ text: "EcoClean Smart Waste Reporting and Management System", bold: true }),
          new TextRun({ text: ", a secure web-based application that digitizes the complete municipal sanitation workflow. The system enables citizens to report garbage dumps on an interactive geospatial OpenStreetMap view using precision Leaflet coordinate picking. The platform features an AI Waste Scanner overlay predicting waste categories (Plastic, Organic, Hazardous, E-Waste) and severity levels. To incentivize community involvement, EcoClean incorporates a full gamification engine featuring an EMV-styled digital Eco Credit Card, Eco-Points accumulation, leadership rankings, and municipal discount voucher redemption (City Bus Pass, Property Tax rebate, Supermarket Vouchers)." })
        ]}),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [
          new TextRun({ text: "Municipal administrators oversee live incident hotspots via a dark-glassmorphic control console, dispatching individual workers or specialized sanitation teams based on Recharts analytical insights. Sanitation workers access a mobile workspace to view assigned duties with geotagged address details, Google Maps navigation links, waste severity levels, and upload 'after-cleaning' verification proof photos. Upon administrative verification, an official downloadable Civic Incident Resolution Receipt is automatically generated for the reporting citizen." })
        ]}),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, spacing: { after: 300 }, children: [
          new TextRun({ text: "The application provides a centralized platform that improves transparency, reduces manual paperwork, minimizes processing delays, and enhances municipal efficiency. The system was developed using HTML, CSS, JavaScript, React.js for the frontend, Node.js with Express.js for the backend, and MongoDB as the database to provide secure, reliable, and efficient waste management operations." })
        ]})
      ]
    },

    // ---------------------------------------------------------
    // PAGE 5 & 6: CONTENTS
    // ---------------------------------------------------------
    {
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 400 }, children: [ new TextRun({ text: "CONTENTS", bold: true, size: 36 }) ] }),
        createStyledTable(['Section / Topic', 'Page No.'], [
          ['1. INTRODUCTION', '1'],
          ['2. SYSTEM ANALYSIS', '3'],
          ['   2.1 Existing System', '4'],
          ['   2.2 Proposed System', '4'],
          ['   2.3 Module Description', '4'],
          ['   2.4 Sprint', '5'],
          ['3. FEASIBILITY STUDY', '8'],
          ['   3.1 Economical Feasibility', '9'],
          ['   3.2 Technical Feasibility', '9'],
          ['   3.3 Operational Feasibility', '9'],
          ['   3.4 Behavioural Feasibility', '9'],
          ['   3.5 Software Feasibility', '10'],
          ['   3.6 Hardware Feasibility', '10'],
          ['4. SOFTWARE ENGINEERING PARADIGM', '11'],
          ['   4.1 Agile Model', '12'],
          ['   4.2 Scrum', '12'],
          ['5. SYSTEM REQUIREMENT SPECIFICATION', '13'],
          ['   5.1 Software Requirements', '14'],
          ['   5.2 Hardware Requirements', '14'],
          ['6. SYSTEM DESIGN', '15'],
          ['   6.1 Database Design', '16'],
          ['   6.2 Tables', '18'],
          ['   6.3 UML Design', '20'],
          ['   6.4 User Story', '21'],
          ['   6.5 Scenario', '22'],
          ['   6.6 Data flow diagram', '23'],
          ['7. SYSTEM DEVELOPMENT', '27'],
          ['   7.1 Coding', '28'],
          ['8. SYSTEM TESTING AND IMPLEMENTATION', '31'],
          ['   8.1 Types of Testing', '32'],
          ['   8.2 Implementation', '34'],
          ['9. SYSTEM MAINTENANCE', '35'],
          ['10. FUTURE ENHANCEMENT', '37'],
          ['11. CONCLUSION', '39'],
          ['12. APPENDIX', '41'],
          ['13. BIBLIOGRAPHY', '48']
        ])
      ]
    },

    // ---------------------------------------------------------
    // MAIN REPORT SECTION (WITH HEADER & FOOTER)
    // ---------------------------------------------------------
    {
      headers: { default: commonHeader },
      footers: { default: commonFooter },
      children: [
        // ---------------------------------------------------------
        // CHAPTER 1: INTRODUCTION
        // ---------------------------------------------------------
        ...createDividerPage('INTRODUCTION'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "1. INTRODUCTION", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The safe distribution, collection, and disposal of municipal solid waste require proper authorization, real-time monitoring, and continuous tracking to prevent unauthorized dumping and maintain public hygiene. However, many urban local bodies still depend on traditional manual procedures for handling civic complaints, verifying incident locations, and assigning sanitation workers. These methods are often slow, error-prone, and inefficient, resulting in delayed workforce dispatch, unmonitored garbage dumps, and zero public engagement throughout the waste collection process." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "To address these issues, I developed the EcoClean Smart Waste Reporting and Management System, a secure web-based platform designed to automate and simplify the complete municipal waste management workflow. The system provides a centralized environment where citizens can register, report garbage dumps by capturing exact geospatial coordinates on an OpenStreetMap interface, upload photos, and receive real-time updates regarding incident resolution." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The platform also enables sanitation workers and municipal administrators to verify incident locations, review complaint details, monitor ward heatmaps, dispatch workforce units, and approve verification proof photos efficiently. Administrators are responsible for managing ward areas, verifying citizen reports, assigning workers or teams, and monitoring overall system activities. By integrating these operations into a single platform, the system improves transparency, accountability, and operational efficiency while significantly reducing manual effort." }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 2: SYSTEM ANALYSIS
        // ---------------------------------------------------------
        ...createDividerPage('SYSTEM ANALYSIS'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "2. SYSTEM ANALYSIS", bold: true }) ] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "2.1 Existing System" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "In the existing system, municipal waste reporting and complaints are handled manually using paper records, phone calls, and offline verification. Citizens must visit municipal ward offices or call helpline numbers to submit reports. Municipal staff manually record complaint details and maintain paper registers, making the process slow, inefficient, and prone to errors. The absence of a centralized digital system also makes it difficult to monitor uncollected garbage spots, track worker dispatches, and verify cleanup completion effectively." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "2.2 Proposed System" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The proposed EcoClean Smart Waste Reporting and Management System provides a centralized web-based platform for managing the complete waste reporting and sanitation dispatch workflow. Citizens can report garbage dumps online using GPS map picking, view automated AI waste vision classifications, and track ticket status in real time. Municipal administrators verify reports, monitor ward heatmaps, assign workers or teams, and generate official downloadable receipts. The system improves efficiency, transparency, workforce dispatching, and citizen engagement." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "2.3 Module Description" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "The system is divided into 3 primary modules based on user roles, each with specific functionalities:" }) ] }),

        new Paragraph({ children: [ new TextRun({ text: "Admin Module:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• View system dashboard, ward heatmaps, and analytics" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Register and manage sanitation workers and teams" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Manage citizen accounts and verify reports" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Approve or reject cleanup verification proof photos" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Broadcast municipal announcements and export CSV audit reports" }) ] }),

        new Paragraph({ children: [ new TextRun({ text: "Sanitation Worker Module:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• View assigned duties and task targets" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Access direct Google Maps navigation links for target locations" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• View waste severity and geotagged address details" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Upload 'after-cleaning' verification proof photos" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Track individual completion rates and performance score" }) ] }),

        new Paragraph({ children: [ new TextRun({ text: "User / Citizen Module:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Register and login securely" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Report garbage dump using precision Leaflet map coordinate picking" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Upload waste photo analyzed by AI Waste Scanner overlay" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• View EMV-styled digital Eco Credit Card and Eco-Points balance" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Redeem points for municipal vouchers (Bus Pass, Tax Rebate, Coupons)" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• View and download official Civic Incident Resolution Receipt" }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "2.4 Sprint" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "Sprint 1: Citizen Module", bold: true }) ] }),
        createStyledTable(
          ['Module', 'Task', 'Pending task if any', 'Hour of completion', 'Expected date', 'Actual date', 'Reason for delay'],
          [
            ['Citizen', 'Login & Registration page', '-', '2 hr.', '15/07/2026', '15/07/2026', '-'],
            ['Citizen', 'Report Waste Map Picker page', '-', '3 hr.', '17/07/2026', '17/07/2026', '-'],
            ['Citizen', 'AI Photo Scanner Overlay', '-', '2 hr.', '18/07/2026', '18/07/2026', '-'],
            ['Citizen', 'Eco Credit Card & Rewards page', '-', '3 hr.', '21/07/2026', '21/07/2026', '-'],
            ['Citizen', 'Resolution Receipt page', '-', '2 hr.', '22/07/2026', '22/07/2026', '-']
          ]
        ),

        new Paragraph({ spacing: { before: 200 }, children: [ new TextRun({ text: "Sprint 2: Sanitation Worker Module", bold: true }) ] }),
        createStyledTable(
          ['Module', 'Task', 'Pending task if any', 'Hour of completion', 'Expected date', 'Actual date', 'Reason for delay'],
          [
            ['Worker', 'Worker Login Page', '-', '1 hr.', '30/07/2026', '30/07/2026', '-'],
            ['Worker', 'Duty Workspace Dashboard', '-', '2 hr.', '01/08/2026', '01/08/2026', '-'],
            ['Worker', 'Google Maps Deep-Link Navigator', '-', '3 hr.', '05/08/2026', '05/08/2026', '-'],
            ['Worker', 'Proof Photo Compressor Upload', '-', '1 hr.', '07/08/2026', '07/08/2026', '-'],
            ['Worker', 'Task Completion Status page', '-', '2 hr.', '15/08/2026', '15/08/2026', '-']
          ]
        ),

        new Paragraph({ spacing: { before: 200 }, children: [ new TextRun({ text: "Sprint 3: Admin Module", bold: true }) ] }),
        createStyledTable(
          ['Module', 'Task', 'Pending task if any', 'Hour of completion', 'Expected date', 'Actual date', 'Reason for delay'],
          [
            ['Admin', 'Admin Login & Dashboard', '-', '2 hr.', '20/08/2026', '20/08/2026', '-'],
            ['Admin', 'Incidents Ledger & Dispatch Table', '-', '3 hr.', '22/08/2026', '22/08/2026', '-'],
            ['Admin', 'Recharts Ward Heatmap Analytics', '-', '3 hr.', '25/08/2026', '25/08/2026', '-'],
            ['Admin', 'Verification & Proof Approval', '-', '2 hr.', '28/08/2026', '28/08/2026', '-'],
            ['Admin', 'Municipal Announcement & CSV Export', '-', '2 hr.', '30/08/2026', '30/08/2026', '-']
          ]
        ),

        // ---------------------------------------------------------
        // CHAPTER 3: FEASIBILITY STUDY
        // ---------------------------------------------------------
        ...createDividerPage('FEASIBILITY STUDY'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "3. FEASIBILITY STUDY", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "An analysis of the ability to complete a project successfully, taking into account legal, economic, technological, scheduling, and other factors is considered as feasibility study. Rather than just diving into a project and hoping for the best, feasibility study allows project managers to investigate the possible negative and positive outcomes of a project before investing too much time and money." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.1 Economical Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The project is economically feasible because it is developed using open-source technologies (MERN stack, Leaflet, Tailwind CSS), which significantly reduce software development costs. The system also minimizes manual paperwork, improves workforce dispatching efficiency, and reduces the time required for processing civic complaints, making it a cost-effective solution for urban local bodies." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.2 Technical Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The proposed system is technically feasible because it is developed using HTML, CSS, JavaScript, React.js, Node.js, Express.js, and MongoDB. These technologies are reliable, secure, and suitable for developing a web-based application. The modular architecture makes the system easy to maintain, update, and expand with additional features in the future." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.3 Operational Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The proposed system provides a simple and user-friendly interface for citizens, sanitation workers, and administrators. It automates the waste reporting process, workforce dispatching, and cleanup verification tracking, improving operational efficiency while reducing manual work and processing delays." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.4 Behavioral Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The system is designed to be easy to learn and use, requiring minimal training for all users. Clear navigation, interactive maps, and real-time status updates encourage citizens and workers to adopt the system quickly. The digital gamification workflow also improves communication between citizens, workers, and administrators." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.5 Software Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The application is developed using React.js, Node.js, Express.js, and MongoDB. It can be accessed through modern web browsers such as Google Chrome, Microsoft Edge, and Mozilla Firefox. The system supports Windows, Linux, and macOS without requiring additional software installation." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "3.6 Hardware Feasibility" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The proposed system requires only a standard desktop, laptop, or smartphone with an internet connection and a modern web browser. Sanitation workers and administrators can operate the system using existing computer or mobile systems, eliminating the need for specialized hardware and reducing implementation costs." }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 4: SOFTWARE ENGINEERING PARADIGM
        // ---------------------------------------------------------
        ...createDividerPage('SOFTWARE ENGINEERING PARADIGM'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "4. SOFTWARE ENGINEERING PARADIGM", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The software engineering paradigm which is also referred to as a software process model or Software Development Life Cycle (SDLC) model is the development strategy that encompasses the process, methods and tools. SDLC describes the period of time that starts with the software system being conceptualized." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "4.1 Agile Model" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Agile SDLC model is a combination of iterative and incremental process models with focus on process adaptability and customer satisfaction by rapid delivery of working software product. Agile Methods break the product into small incremental builds. These builds are provided in iterations. Each iteration typically lasts from about one to three weeks. At the end of the iteration, a working product is displayed to the customer and important stakeholders." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "In Agile, the tasks are divided to time boxes (small time frames) to deliver specific features for a release. Iterative approach is taken and working software build is delivered after each iteration. Each build is incremental in terms of features; the final build holds all the features required by the customer." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "4.2 Scrum" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Scrum is an agile framework for managing knowledge work, with an emphasis on software development. It is designed for teams of three to nine members, who break their work into actions that can be completed within time boxed iterations, called 'sprints', no longer than one month and most commonly two weeks, then track progress and re-plan in 15-minute stand-up meetings, called daily scrums." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Scrum is an iterative and incremental framework for product development. It promotes a flexible strategy where development teams collaborate to achieve common goals, challenging traditional sequential methods. Scrum encourages self-organization, physical co-location, and daily communication among team members." }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 5: SYSTEM REQUIREMENT SPECIFICATION
        // ---------------------------------------------------------
        ...createDividerPage('SYSTEM REQUIREMENTS SPECIFICATION'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "5. SYSTEM REQUIREMENTS SPECIFICATION", bold: true }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "5.1 Software Requirements" }) ] }),
        createStyledTable(
          ['Component', 'Requirement'],
          [
            ['Operating system', 'Windows 8 or above / Linux / macOS'],
            ['Backend Runtime', 'Node.js (v18+) & Express.js'],
            ['Frontend Framework', 'React.js 18, Tailwind CSS, Leaflet Maps'],
            ['Database System', 'MongoDB Atlas / Local MongoDB'],
            ['Development IDE', 'Visual Studio Code']
          ]
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [ new TextRun({ text: "5.2 Hardware Requirements" }) ] }),
        createStyledTable(
          ['Component', 'Requirement'],
          [
            ['Processor', 'Intel Core i3 or above'],
            ['RAM', 'Minimum 8GB (recommended 16GB)'],
            ['Monitor Display', '14" LCD or Above (1920x1080 resolution)'],
            ['Keyboard', 'Standard 108 Keys'],
            ['Pointing Device', 'Optical mouse or touchpad']
          ]
        ),

        // ---------------------------------------------------------
        // CHAPTER 6: SYSTEM DESIGN
        // ---------------------------------------------------------
        ...createDividerPage('SYSTEM DESIGN'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "6. SYSTEM DESIGN", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "System design is the first in the development phase for many engineered product or system. It may define the process of applying various techniques and principles for the purpose of defining a device, a process or system in sufficient detail to permit its physical realization." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.1 Database Design" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Database design is the process of producing a detailed data model of a database. This logical data model contains all the needed logical and physical design choices and physical storage parameters needed to generate a design in a data definition language, which can then be used to create a database." }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "In the relational and NoSQL document models, collections and tables represent data entities and relationships. Database design encompasses forms, schemas, and queries within a database management system, focusing on establishing logical structure and normalization." }) ] }),

        new Paragraph({ children: [ new TextRun({ text: "Normalization Rules Applied:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "1. First Normal Form (1NF): All attribute values in relations are atomic with no repeating groups." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "2. Second Normal Form (2NF): Meets 1NF and all non-key attributes are fully functionally dependent on the primary key." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "3. Third Normal Form (3NF): Meets 2NF and eliminates all transitive dependencies, ensuring clean schema design." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.2 Tables" }) ] }),

        new Paragraph({ children: [ new TextRun({ text: "User Collection / Table", bold: true }) ] }),
        createStyledTable(
          ['FIELD NAME', 'DATA TYPE', 'CONSTRAINTS'],
          [
            ['_id / user_id', 'OBJECTID / INT', 'Primary Key'],
            ['full_name', 'VARCHAR', 'NOT NULL'],
            ['email', 'VARCHAR', 'UNIQUE, NOT NULL'],
            ['password', 'VARCHAR', 'NOT NULL'],
            ['role', 'ENUM("citizen", "worker", "admin")', 'NOT NULL'],
            ['phone', 'VARCHAR', 'NOT NULL'],
            ['ward', 'VARCHAR', 'NULL'],
            ['ecoPoints', 'INT', 'DEFAULT 0']
          ]
        ),

        new Paragraph({ spacing: { before: 200 }, children: [ new TextRun({ text: "Complaint Collection / Table", bold: true }) ] }),
        createStyledTable(
          ['FIELD NAME', 'DATA TYPE', 'CONSTRAINTS'],
          [
            ['_id / complaint_id', 'OBJECTID / INT', 'Primary Key'],
            ['citizen_id', 'OBJECTID / INT', 'Foreign Key (User)'],
            ['category', 'ENUM("Plastic", "Organic", "Hazardous", "E-Waste")', 'NOT NULL'],
            ['severity', 'ENUM("Low", "Medium", "High", "Critical")', 'NOT NULL'],
            ['latitude', 'DECIMAL(10,8)', 'NOT NULL'],
            ['longitude', 'DECIMAL(11,8)', 'NOT NULL'],
            ['status', 'ENUM("pending", "assigned", "resolved", "rejected")', 'NOT NULL'],
            ['proof_image', 'VARCHAR', 'NULL'],
            ['assigned_worker_id', 'OBJECTID / INT', 'Foreign Key (User)']
          ]
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [ new TextRun({ text: "6.3 UML Designs" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The Unified Modelling Language (UML) is a standard language for specifying, visualizing, constructing, and documenting the artifacts of software systems. UML diagrams provide visual notations to model system functionality, actor interactions, and data flows." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.4 User Story" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "As a citizen or resident, I want to register on the EcoClean system, pin garbage dumps on an interactive map, upload waste photos for AI vision scanning, receive real-time resolution alerts, and earn Eco-Points to redeem municipal vouchers. As a sanitation worker, I want to view assigned duties, click one-button Google Maps navigation links, and upload verification proof photos. As a municipal administrator, I want to view ward heatmaps, assign workers or teams, verify cleanups, and export audit reports." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.5 Scenario" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "CITIZEN / USER SCENARIO:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Citizen can Register and Login to EcoClean portal." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Citizen can Report Waste with precision Leaflet OpenStreetMap coordinate picking." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Citizen can View automated AI Waste Vision scanning results." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Citizen can Track real-time ticket status timeline." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Citizen can View EMV Digital Eco Credit Card and Eco-Points balance." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Citizen can Redeem Eco-Points for municipal bus passes and tax rebates." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Citizen can Download official Civic Incident Resolution Receipt." }) ] }),

        new Paragraph({ children: [ new TextRun({ text: "SANITATION WORKER SCENARIO:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Worker can Login and access mobile duty workspace." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Worker can View assigned garbage target locations and waste severity." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Worker can Launch one-click Google Maps GPS navigation to target." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Worker can Upload compressed 'after-cleaning' proof photos." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Worker can View individual completion rate and performance score." }) ] }),

        new Paragraph({ children: [ new TextRun({ text: "MUNICIPAL ADMIN SCENARIO:", bold: true }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Admin can Login to dark-glassmorphic control console." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Admin can Monitor live ward heatmaps and Recharts analytical charts." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Admin can Dispatch individual sanitation workers or specialized teams." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Admin can Verify uploaded proof photos and approve cleanup completion." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Admin can Broadcast municipal announcements and export CSV audit reports." }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "6.6 Use Case Diagram & Data Flow Diagrams" }) ] }),
        createImageParagraph('use_case_diagram.png', 500, 380),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure 6.1: Use Case Diagram - EcoClean System", bold: true, italics: true, size: 20 }) ] }),

        createImageParagraph('dfd_level_0.png', 500, 260),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure 6.2: Level 0 Context Data Flow Diagram", bold: true, italics: true, size: 20 }) ] }),

        createImageParagraph('dfd_level_1.png', 500, 320),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure 6.3: Level 1 Data Flow Diagram (Subsystems)", bold: true, italics: true, size: 20 }) ] }),

        createImageParagraph('dfd_level_2.png', 500, 300),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure 6.4: Level 2 Data Flow Diagram (Incident Lifecycle)", bold: true, italics: true, size: 20 }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 7: SYSTEM DEVELOPMENT
        // ---------------------------------------------------------
        ...createDividerPage('SYSTEM DEVELOPMENT'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "7. SYSTEM DEVELOPMENT", bold: true }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "7.1 Coding" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The EcoClean project was developed following modular full-stack architecture principles. The backend API is constructed using Node.js and Express.js, featuring RESTful endpoints for authentication, complaint filing, worker dispatching, and notification delivery. Database interaction is handled via Mongoose ORM models connecting to MongoDB Atlas. The frontend is built using React 18 with Vite, styled with Tailwind CSS, and uses Socket.io for real-time WebSocket communication." }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 8: TESTING AND IMPLEMENTATION
        // ---------------------------------------------------------
        ...createDividerPage('SYSTEM TESTING AND IMPLEMENTATION'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "8. SYSTEM TESTING AND IMPLEMENTATION", bold: true }) ] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "8.1 Types of Testing" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "Testing ensures that the application operates reliably and meets user requirements. The following testing methodologies were executed:" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "1. Unit Testing: Verified individual API routes and component functions." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "2. Integration Testing: Validated data flow between React frontend, Express API, and MongoDB." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "3. System Testing: Tested end-to-end user journeys across Citizen, Worker, and Admin roles." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "4. Acceptance Testing: Confirmed real-time map picking, AI scanning, and voucher redemption." }) ] }),

        new Paragraph({ spacing: { before: 200 }, children: [ new TextRun({ text: "Test Cases Results Table", bold: true }) ] }),
        createStyledTable(
          ['Test ID', 'Test Case Description', 'Expected Result', 'Actual Result', 'Status'],
          [
            ['TC_01', 'User Login & Authentication', 'Valid JWT token generated & role redirected', 'Matches expected behavior', 'PASS'],
            ['TC_02', 'Leaflet Coordinates Pinning', 'Latitude & Longitude captured accurately', 'Coordinates saved correctly', 'PASS'],
            ['TC_03', 'AI Waste Photo Scan', 'Category & Severity predicted', 'Gemini Vision returns predictions', 'PASS'],
            ['TC_04', 'Admin Worker Dispatch', 'Complaint assigned to worker & status updated', 'Status set to assigned', 'PASS'],
            ['TC_05', 'Proof Upload & Resolution', 'Proof photo saved, status set to resolved, +50 pts credited', 'Points credited & receipt ready', 'PASS']
          ]
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [ new TextRun({ text: "8.2 Implementation" }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The system was implemented on local and cloud servers. The Node.js Express server manages environment configurations via .env files, while the React Vite application is optimized for fast production response times under 500ms." }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 9: SYSTEM MAINTENANCE
        // ---------------------------------------------------------
        ...createDividerPage('SYSTEM MAINTENANCE'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "9. SYSTEM MAINTENANCE", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "System maintenance involves ongoing software updates to fix bugs, enhance security, and adapt to changing user requirements. Maintenance procedures are categorized into four types:" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Corrective Maintenance: Resolving runtime exception bugs and API edge cases." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Adaptive Maintenance: Updating Node.js dependencies and MongoDB drivers." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Perfective Maintenance: Refining UI responsiveness and optimizing image compression." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "• Preventive Maintenance: Monitoring server logs and executing security audits." }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 10: FUTURE ENHANCEMENT
        // ---------------------------------------------------------
        ...createDividerPage('FUTURE ENHANCEMENT'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "10. FUTURE ENHANCEMENT", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The EcoClean platform is designed with modular scalability, allowing future enhancements such as:" }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "1. IoT Smart Waste Bin Integration: Installing ultrasonic fill-level sensors inside public bins to dispatch workers automatically before overflow." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "2. AI Garbage Vehicle Route Optimization: Implementing Dijkstra pathfinding algorithms to compute shortest collection routes for municipal vehicles." }) ] }),
        new Paragraph({ children: [ new TextRun({ text: "3. Native Mobile Application: Developing a PWA/Native Android app supporting offline report filing in remote ward areas." }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 11: CONCLUSION
        // ---------------------------------------------------------
        ...createDividerPage('CONCLUSION'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "11. CONCLUSION", bold: true }) ] }),
        new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [ new TextRun({ text: "The EcoClean Smart Waste Reporting and Management System successfully digitalizes the municipal solid waste management lifecycle. By replacing manual paperwork with interactive geospatial map picking, predictive AI waste vision scanning, and real-time worker dispatching, the platform significantly reduces processing delays and improves operational transparency. The gamification engine incentivizes community involvement through Eco-Points and digital rewards. EcoClean demonstrates how modern full-stack web technologies can optimize urban sanitation workflows effectively." }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 12: APPENDIX
        // ---------------------------------------------------------
        ...createDividerPage('APPENDIX'),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [ new TextRun({ text: "12. APPENDIX", bold: true }) ] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "Appendix A: Citizen Portal & Digital Eco Credit Card" }) ] }),
        createImageParagraph('app_citizen_dashboard.png', 500, 300),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure A.1: Citizen Workspace & Eco Credit Card Interface", bold: true, italics: true, size: 20 }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "Appendix B: AI Waste Scanner & Geotagging" }) ] }),
        createImageParagraph('app_ai_scanner.png', 500, 300),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure B.1: AI Waste Photo Scanner & Location Picker Interface", bold: true, italics: true, size: 20 }) ] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [ new TextRun({ text: "Appendix C: Official Civic Resolution Receipt Document" }) ] }),
        createImageParagraph('app_resolution_receipt.png', 500, 300),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Figure C.1: Official Civic Incident Resolution Receipt Preview", bold: true, italics: true, size: 20 }) ] }),

        // ---------------------------------------------------------
        // CHAPTER 13: BIBLIOGRAPHY
        // ---------------------------------------------------------
        ...createDividerPage('BIBLIOGRAPHY'),
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
  console.log(`Document matching reference PDF format successfully generated at: ${outputPath}`);
}).catch(err => {
  console.error("Error generating docx:", err);
});
