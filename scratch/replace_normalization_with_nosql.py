import docx
import shutil

target_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
desktop_docx = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"

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

# P307: Heading 6
set_p_clean(doc.paragraphs[307], "NoSQL Document Schema Design & Architecture", bold=True, font_size=12.0)

# P309: Body Text
p309_text = "In the MERN stack architecture, the EcoClean system utilizes MongoDB, a modern distributed NoSQL document-oriented database. Unlike conventional relational databases (such as MySQL or Oracle) that mandate strict multi-stage normalization (1NF, 2NF, 3NF, and BCNF) to eliminate update and insertion anomalies by decomposing entities across dozens of isolated tables, MongoDB stores data as flexible, self-contained JSON/BSON documents. This document paradigm allows related data—such as geographic coordinates, incident timestamps, and verification image payloads—to be co-located within the same document, eliminating expensive multi-table JOIN operations and dramatically accelerating read/write query performance."
set_p_clean(doc.paragraphs[309], p309_text, font_size=12.0)

# P312, P313, P315, P317: Features / Advantages
set_p_clean(doc.paragraphs[312], "Schema Flexibility: Dynamic BSON structure accommodates evolving incident attributes without table migrations.", font_size=11.0)
set_p_clean(doc.paragraphs[313], "Atomic Document Operations: Updates to embedded subdocuments and ticket statuses occur atomically in a single write.", font_size=11.0)
set_p_clean(doc.paragraphs[315], "High-Throughput Spatial Querying: Native support for GeoJSON coordinates and 2dsphere spatial indexing.", font_size=12.0)
set_p_clean(doc.paragraphs[317], "Data Modeling Paradigms: Two fundamental design strategies govern MongoDB data modeling: Embedding and Referencing.", font_size=12.0)

# P319: Heading 6
set_p_clean(doc.paragraphs[319], "Document-Oriented Data Modeling Principles", bold=True, font_size=12.0)

# P321: Body Text
p321_text = "A document database stores each real-world entity as an independent, self-describing BSON document containing key-value pairs, arrays, and nested structures. In EcoClean, each waste dump complaint encapsulates its title, description, timestamp, status, and severity rating within a single document. This design aligns naturally with JavaScript and React frontend object models, ensuring that data retrieved from the Express backend requires zero translation or complex object-relational mapping."
set_p_clean(doc.paragraphs[321], p321_text, font_size=12.0)

# P323: Heading 6
set_p_clean(doc.paragraphs[323], "Embedding vs. Referencing Strategies (Denormalization)", bold=True, font_size=12.0)

# P325: Body Text
set_p_clean(doc.paragraphs[325], "In MongoDB, data modeling balances between embedding subdocuments (denormalization) and referencing documents via ObjectIds (normalization). EcoClean applies both strategies strategically based on system access patterns:", font_size=12.0)

# P326, P327, P328: List Paragraphs
set_p_clean(doc.paragraphs[326], "Embedding (1-to-Few): Geospatial location coordinates (latitude, longitude, formatted street address) are embedded directly within the Complaint document for instant single-query retrieval.", font_size=11.0)
set_p_clean(doc.paragraphs[327], "Referencing (1-to-Many): Relationships between Complaints and Users (Citizens, Workers, Admins) are modeled via ObjectId references (ref: 'User') to avoid duplicating user credentials across millions of reports.", font_size=11.0)
set_p_clean(doc.paragraphs[328], "Two-Way Referencing: Sanitation Squad Teams reference Worker ObjectIds in an array, while Workers reference their assigned Team ID for fast bidirectional querying.", font_size=11.0)

# P331: Heading 6
set_p_clean(doc.paragraphs[331], "Mongoose Schema Validation & Constraints", bold=True, font_size=12.0)

# P333: Body Text
p333_text = "Although MongoDB provides a flexible schema at the database layer, enterprise applications require strict data integrity. EcoClean implements Mongoose Object Data Modeling (ODM) to enforce rigorous schema validation at the application tier. Mongoose defines field data types (String, Number, Date, ObjectId), mandatory constraints (required: true), unique constraints (such as unique user emails), and enumerated value restrictions (restricting roles to 'citizen', 'admin', or 'worker' and statuses to 'pending', 'verified', 'assigned', 'cleaned', 'completed'). This ensures that all documents stored in the database conform strictly to application business rules."
set_p_clean(doc.paragraphs[333], p333_text, font_size=12.0)

# P336: Heading 6
set_p_clean(doc.paragraphs[336], "Geospatial Indexing & Spatial Queries (2dsphere):", bold=True, font_size=12.0)

# P338: Body Text
p338_text = "A distinctive requirement of the EcoClean platform is geographic proximity tracking. Traditional relational databases require external GIS extensions or complex trigonometric formulas (such as the Haversine equation) to locate nearby waste dumps. MongoDB natively integrates geospatial indexing through the '2dsphere' index on coordinate pairs ([longitude, latitude]). This enables real-time spatial queries—such as finding all active garbage dumps within a 5-kilometer radius of a sanitation truck—using MongoDB's $near and $geoWithin aggregation operators with sub-millisecond execution times."
set_p_clean(doc.paragraphs[338], p338_text, font_size=12.0)

# P340: Heading 6
set_p_clean(doc.paragraphs[340], "Data Consistency, Encryption & Audit Logging:", bold=True, font_size=12.0)

# P342: Body Text
p342_text = "To maintain operational security and consistency across concurrent mobile and web requests, EcoClean incorporates Mongoose pre-save middleware hooks. Passwords are automatically salted and hashed using Bcrypt before storage. Automatic timestamping (createdAt, updatedAt) provides an immutable audit trail for every status transition (pending ➔ verified ➔ assigned ➔ cleaned ➔ completed). This guarantees total accountability and tamper-proof verification records for municipal sanitation audits."
set_p_clean(doc.paragraphs[342], p342_text, font_size=12.0)

# P345: Heading 5
set_p_clean(doc.paragraphs[345], "Collections and Document Schema Definitions", bold=True, font_size=14.0)

# Save document
doc.save(target_docx)
print("Updated target docx successfully!")

# Copy to Desktop
shutil.copyfile(target_docx, desktop_docx)
print("Updated desktop docx successfully!")
