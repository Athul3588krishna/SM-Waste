import docx
import shutil
import os

source_docx = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
target_latest_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Latest.docx"
target_final_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Final.docx"
desktop_docx = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
placeholder_dir = r"d:\Smart waste management\scratch\collection_placeholders"

# Open the desktop version which is unlocked
doc = docx.Document(source_docx)

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

print("1. Updating legacy paragraphs...")
# P157
set_p_clean(doc.paragraphs[157], "Monitor Citizen Cleanliness Reviews and Ward Resolution Ratings", font_size=11.0)

# P429
set_p_clean(doc.paragraphs[429], "Admin Can Detect Duplicate Waste Incident Reports using Geospatial Clustering.", font_size=11.0)

# P525
p525_text = "JavaScript and Node.js, alongside modern full-stack web engineering, possess a vast ecosystem of open-source packages via npm that streamline development, spatial calculations, and asynchronous I/O handling."
set_p_clean(doc.paragraphs[525], p525_text, font_size=12.0)

# P653, P655, P657, P659
set_p_clean(doc.paragraphs[653], "Automated Drone Aerial Surveying for Illegal Dumping Hotspots and Open Dumpsites", font_size=11.0)
set_p_clean(doc.paragraphs[655], "Dynamic Vehicle Routing Optimization (VRP) & Fuel-Efficient Truck Path Navigation", font_size=11.0)
set_p_clean(doc.paragraphs[657], "Integration with Official Municipal WhatsApp Chatbots for Instant Geolocation Reporting", font_size=11.0)
set_p_clean(doc.paragraphs[659], "AI-Powered Predictive Waste Influx and Seasonal Accumulation Forecasting", font_size=11.0)

print("2. Overhauling Database Schema Tables with MongoDB Mongoose NoSQL types...")

db_schemas_nosql = [
    # Table 2: User Collection
    [["_id", "ObjectId (Primary Key, Index)", "Unique MongoDB auto-generated document identifier"],
     ["name", "String (Required)", "Full name of citizen, admin, or worker"],
     ["email", "String (Required, Unique)", "Login email address for authentication"],
     ["password", "String (Bcrypt Hashed)", "Encrypted password using salt rounds"],
     ["role", "String (Enum: ['citizen', 'admin', 'worker'])", "Role-based access control level in portal"],
     ["points", "Number (Default: 0)", "Accumulated citizen reward Eco-Points"],
     ["badge", "String (Default: 'Novice Reporter')", "Current civic achievement badge tier"],
     ["isOnline", "Boolean (Default: false)", "Real-time active field worker tracking flag"],
     ["team", "ObjectId (ref: 'Team', Nullable)", "Reference to worker's sanitation squad"]],

    # Table 3: CitizenProfile
    [["_id", "ObjectId (Index)", "Unique profile document identifier"],
     ["user", "ObjectId (ref: 'User', Unique)", "One-to-one reference to User account document"],
     ["phoneNumber", "String (Indexed)", "Contact phone number for SMS notices"],
     ["wardNumber", "Number", "Residential municipal ward number"]],

    # Table 4: WardZone
    [["_id", "ObjectId (Index)", "Unique ward location document identifier"],
     ["wardName", "String (Required)", "Name of administrative municipal ward"],
     ["city", "String (Default: 'Perinthalmanna')", "Municipality or corporation jurisdiction"],
     ["supervisor", "ObjectId (ref: 'User')", "Reference to ward sanitation officer"],
     ["location.coordinates", "[Number] (GeoJSON [lng, lat])", "2dsphere indexed center coordinate pair"],
     ["location.type", "String (Default: 'Point')", "GeoJSON spatial geometry type"],
     ["pincode", "String", "Postal area code of the municipal zone"],
     ["totalDwellings", "Number", "Estimated count of residential households"],
     ["activeDumpsters", "Number", "Registered public waste dumpsters in ward"]],

    # Table 5: WasteAssessment
    [["_id", "ObjectId (Index)", "Unique AI assessment record identifier"],
     ["complaint", "ObjectId (ref: 'Complaint')", "Reference to reported waste dump document"],
     ["predictedCategory", "String (Enum: ['Plastic', 'Organic', 'E-Waste', 'Hazardous'])", "Simulated AI classification prediction"],
     ["confidenceScore", "Number (Percentage)", "Model certainty rating (e.g., 94.6%)"],
     ["estimatedVolume", "Number (m³)", "Estimated physical volume of garbage heap"],
     ["hazardIndex", "String (Enum: ['Low', 'Medium', 'High'])", "Toxicity and contagion severity score"],
     ["recommendedTruck", "String", "Suggested collection truck category to deploy"]],

    # Table 6: CitizenFAQ
    [["_id", "ObjectId (Index)", "Unique civic FAQ document identifier"],
     ["question", "String (Required)", "Waste disposal or segregation question"],
     ["answer", "String (Long Text)", "Official municipal guideline response"],
     ["category", "String", "Topic: Segregation, E-Waste, Bulky Items"],
     ["createdAt", "Date", "Timestamp of FAQ publication in portal"],
     ["displayOrder", "Number", "Frontend rendering sequence number"]],

    # Table 7: WorkerJobSheet
    [["_id", "ObjectId (Index)", "Unique worker daily job sheet identifier"],
     ["worker", "ObjectId (ref: 'User')", "Reference to sanitation field worker"],
     ["shiftDate", "Date", "Scheduled duty date for cleaning shift"],
     ["assignedWard", "Number", "Ward allocated for garbage collection"],
     ["totalTasks", "Number (Default: 0)", "Count of target cleanup sites assigned"]],

    # Table 8: TaskItem
    [["_id", "ObjectId (Index)", "Unique task dispatch record identifier"],
     ["jobSheet", "ObjectId (ref: 'WorkerJobSheet')", "Reference to daily WorkerJobSheet document"],
     ["complaint", "ObjectId (ref: 'Complaint')", "Reference to Complaint dump site document"],
     ["priority", "String (Enum: ['Low', 'Medium', 'High'])", "Urgency ranking of task item"],
     ["targetDeadline", "Date", "Mandatory completion deadline set by admin"],
     ["status", "String (Enum)", "Task progress status (assigned, in-progress, completed)"]],

    # Table 9: WasteCategory
    [["_id", "ObjectId (Index)", "Unique waste category document identifier"],
     ["categoryName", "String (Unique, Required)", "Class: Plastic, Organic, E-Waste, Hazard"],
     ["disposalProtocol", "String (Long Text)", "Official municipal recycling handling guide"]],

    # Table 10: IncidentPhoto
    [["_id", "ObjectId (Index)", "Unique photo document identifier"],
     ["complaint", "ObjectId (ref: 'Complaint')", "Reference to corresponding Complaint document"],
     ["imageUrl", "String", "Cloudinary or local static storage URI path"]],

    # Table 11: Complaint
    [["_id", "ObjectId (Primary Key, Index)", "Unique waste dump incident document identifier"],
     ["citizen", "ObjectId (ref: 'User', Required)", "Reference to reporting citizen User document"],
     ["worker", "ObjectId (ref: 'User', Nullable)", "Reference to assigned sanitation worker"],
     ["team", "ObjectId (ref: 'Team', Nullable)", "Reference to assigned sanitation squad"],
     ["title", "String (Required)", "Short descriptive title of waste incident"],
     ["description", "String (Required)", "Detailed notes and geographical landmarks"],
     ["location.latitude", "Number (Required)", "Precise GPS latitude coordinate (-90 to +90)"],
     ["location.longitude", "Number (Required)", "Precise GPS longitude coordinate (-180 to +180)"],
     ["location.address", "String", "Reverse geocoded street address from OSM"],
     ["wasteType", "String (Default: 'Mixed')", "Waste category (Plastic, Organic, Mixed, etc.)"],
     ["severity", "String (Enum: ['Low', 'Medium', 'High'])", "Urgency classification of dump site"],
     ["photoBefore", "String (Required)", "Storage URI of initial report photo"],
     ["photoAfter", "String (Nullable)", "Storage URI of verification photo by worker"],
     ["status", "String (Enum)", "Lifecycle status: pending, verified, assigned, cleaned, completed"],
     ["pointsAwarded", "Number (Default: 0)", "Eco-Points credited to citizen upon resolution"],
     ["deadlineAt", "Date (Nullable)", "Scheduled deadline timestamp set by admin"],
     ["createdAt", "Date (Default: Date.now)", "Auto-generated Mongoose creation timestamp"]],

    # Table 12: SeverityScale
    [["_id", "ObjectId (Index)", "Unique severity tier document identifier"],
     ["levelName", "String (Unique)", "Scale designation: Low, Medium, High, Critical"],
     ["slaHours", "Number", "Service Level Agreement response target hours"],
     ["bonusMultiplier", "Number", "Multiplier factor for citizen Eco-Points award"]],

    # Table 13: EcoPointsVoucher
    [["_id", "ObjectId (Index)", "Unique reward voucher redemption identifier"],
     ["citizen", "ObjectId (ref: 'User')", "Reference to citizen User document"],
     ["voucherCode", "String (Unique)", "Unique alphanumeric coupon redemption code"],
     ["discountValue", "Number", "Redemption coupon value in Indian Rupees"],
     ["partnerStore", "String", "Partner green merchant / grocery vendor"],
     ["isRedeemed", "Boolean (Default: false)", "Redemption status flag"],
     ["expiresAt", "Date", "Coupon expiration validity date"],
     ["issuedDate", "Date (Default: Date.now)", "Date voucher was redeemed with Eco-Points"]],

    # Table 14: CleanupValidationLog
    [["_id", "ObjectId (Index)", "Unique validation event document identifier"],
     ["complaint", "ObjectId (ref: 'Complaint')", "Reference to Complaint document"],
     ["worker", "ObjectId (ref: 'User')", "Sanitation worker who executed field cleanup"],
     ["verifiedByAdmin", "ObjectId (ref: 'User')", "Municipal administrator who approved resolution"],
     ["validationTime", "Date", "Exact timestamp of after-photo upload"],
     ["cleanlinessRating", "Number (1 to 5 scale)", "Audit quality rating score assigned by admin"],
     ["adminRemarks", "String (Long Text)", "Notes and observations from municipal inspection"]],

    # Table 15: WorkerAssignment
    [["_id", "ObjectId (Index)", "Unique task assignment document identifier"],
     ["complaint", "ObjectId (ref: 'Complaint')", "Complaint ID allocated to field worker"],
     ["worker", "ObjectId (ref: 'User')", "Sanitation field worker assigned to task"],
     ["assignedBy", "ObjectId (ref: 'User')", "Administrator who scheduled assignment"],
     ["assignedAt", "Date (Default: Date.now)", "Timestamp of ticket dispatch to worker"],
     ["expectedCompletion", "Date", "Target resolution completion deadline"],
     ["actualCompletion", "Date (Nullable)", "Actual timestamp recorded upon completion"],
     ["status", "String (Enum)", "Dispatch status (En Route, In Progress, Done)"],
     ["workerNotes", "String (Long Text)", "Field remarks recorded by sanitation worker"],
     ["verificationFlag", "Boolean (Default: false)", "Verification flag confirmed by administrator"]],

    # Table 16: CitizenReview
    [["_id", "ObjectId (Index)", "Unique feedback review document identifier"],
     ["complaint", "ObjectId (ref: 'Complaint')", "Reference to resolved Complaint document"],
     ["citizen", "ObjectId (ref: 'User')", "Citizen submitting cleanup feedback"],
     ["rating", "Number (1 to 5 Stars)", "Citizen rating of cleanup thoroughness"],
     ["comments", "String (Long Text)", "Citizen remarks regarding speed and cleanliness"],
     ["submittedAt", "Date (Default: Date.now)", "Timestamp of citizen feedback submission"]],

    # Table 17: StarredHotspot
    [["_id", "ObjectId (Index)", "Unique hotspot bookmark document identifier"],
     ["admin", "ObjectId (ref: 'User')", "Municipal administrator bookmarking the zone"],
     ["wardNumber", "Number", "Ward flagged as recurrent chronic dump site"],
     ["notes", "String (Long Text)", "Surveillance and frequent collection notes"]]
]

for t_idx, schema_data in enumerate(db_schemas_nosql):
    tbl = doc.tables[2 + t_idx]
    for r_idx, row_data in enumerate(schema_data):
        if r_idx + 1 < len(tbl.rows):
            for c_idx, val in enumerate(row_data):
                if c_idx < len(tbl.columns):
                    tbl.rows[r_idx + 1].cells[c_idx].text = val

print("3. Inserting Collection Screenshot Placeholders...")

def insert_placeholder_after_table(doc, table, img_name, caption_text):
    img_path = os.path.join(placeholder_dir, img_name)
    
    new_p = doc.add_paragraph()
    new_p.alignment = docx.enum.text.WD_ALIGN_PARAGRAPH.CENTER
    run = new_p.add_run()
    run.add_picture(img_path, width=docx.shared.Inches(5.6))

    cap_p = doc.add_paragraph()
    cap_p.alignment = docx.enum.text.WD_ALIGN_PARAGRAPH.CENTER
    r_cap = cap_p.add_run(caption_text)
    r_cap.font.name = "Times New Roman"
    r_cap.font.size = docx.shared.Pt(11.0)
    r_cap.italic = True
    r_cap.bold = True

    # Insert into XML after table: order: table -> new_p (image) -> cap_p (caption)
    table._element.addnext(cap_p._element)
    table._element.addnext(new_p._element)
    print(f"   -> Inserted: {caption_text}")

# 1. After Table 2 (User Collection)
insert_placeholder_after_table(
    doc, doc.tables[2],
    "placeholder_users_collection.png",
    "Figure 6.1: MongoDB Compass - Users Collection Document Schema View"
)

# 2. After Table 4 (WardAddress / Teams)
insert_placeholder_after_table(
    doc, doc.tables[4],
    "placeholder_teams_collection.png",
    "Figure 6.2: MongoDB Compass - Ward Geolocation & Teams Collection View"
)

# 3. After Table 8 (Worker Tasks / Job Sheet)
insert_placeholder_after_table(
    doc, doc.tables[8],
    "placeholder_tasks_collection.png",
    "Figure 6.3: MongoDB Compass - Worker Tasks & Job Sheet Collection View"
)

# 4. After Table 11 (Complaint Collection)
insert_placeholder_after_table(
    doc, doc.tables[11],
    "placeholder_complaints_collection.png",
    "Figure 6.4: MongoDB Compass - Complaints Collection Document Schema View"
)

# 5. After Table 14 (Cleanup Validation Logs)
insert_placeholder_after_table(
    doc, doc.tables[14],
    "placeholder_validation_collection.png",
    "Figure 6.5: MongoDB Compass - Cleanup Validation Logs Collection View"
)

# Save to target latest docx
doc.save(target_latest_docx)
print(f"4. Saved updated document to: {target_latest_docx}")

# Copy to Desktop
shutil.copyfile(target_latest_docx, desktop_docx)
print(f"5. Copied updated document to Desktop: {desktop_docx}")

# Try copying to target final docx if unlocked
try:
    shutil.copyfile(target_latest_docx, target_final_docx)
    print(f"6. Also updated {target_final_docx}!")
except Exception as e:
    print(f"Note: {target_final_docx} is currently opened in Word. The updated file is saved at Desktop and as _Latest.docx")
