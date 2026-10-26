import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFont
import os

mockup_dir = r"d:\Smart waste management\scratch\mockups"
os.makedirs(mockup_dir, exist_ok=True)

# Helper to create dark glassmorphic UI card
def create_mockup(filename, title, subtitle, main_content_func, width=1300, height=750):
    fig, ax = plt.subplots(figsize=(width/100, height/100), dpi=100)
    ax.set_xlim(0, width)
    ax.set_ylim(0, height)
    ax.axis('off')
    
    # Background (Dark Slate gradient style)
    bg = patches.Rectangle((0, 0), width, height, facecolor='#0f172a')
    ax.add_patch(bg)
    
    # Top Navbar
    nav = patches.Rectangle((0, height - 70), width, 70, facecolor='#1e293b', edgecolor='#334155', lw=1)
    ax.add_patch(nav)
    
    # Brand logo / title
    circle_logo = plt.Circle((50, height - 35), 20, color='#10b981')
    ax.add_patch(circle_logo)
    ax.text(85, height - 42, "EcoClean", fontsize=18, fontweight='bold', color='#f8fafc')
    ax.text(210, height - 40, "|  Smart Municipal Waste Management", fontsize=11, color='#94a3b8')
    
    # User badge / nav items
    ax.text(width - 240, height - 42, "Logged in: Athul Krishna", fontsize=11, color='#cbd5e1')
    badge = patches.FancyBboxPatch((width - 80, height - 52), 60, 32, boxstyle="round,pad=3",
                                  facecolor='#065f46', edgecolor='#10b981', lw=1)
    ax.add_patch(badge)
    ax.text(width - 50, height - 42, "PRO", fontsize=10, fontweight='bold', color='#6ee7b7', ha='center')

    # Page Header
    ax.text(60, height - 120, title, fontsize=20, fontweight='bold', color='#38bdf8')
    ax.text(60, height - 145, subtitle, fontsize=12, color='#94a3b8')

    # Main content callback
    main_content_func(ax, width, height)

    save_path = os.path.join(mockup_dir, filename)
    plt.tight_layout()
    plt.savefig(save_path, bbox_inches='tight', pad_inches=0, dpi=100)
    plt.close()
    print("Generated mockup:", save_path)

# Screen 1: Login
def content_login(ax, w, h):
    # Centered card
    card = patches.FancyBboxPatch((w/2 - 250, 120), 500, 430, boxstyle="round,pad=10",
                                  facecolor='#1e293b', edgecolor='#334155', lw=2)
    ax.add_patch(card)
    ax.text(w/2, 500, "Sign In to Your Account", fontsize=16, fontweight='bold', color='#f8fafc', ha='center')
    
    # Fields
    for y, label, val in [(430, "Email Address", "athul.krishna@meacollege.ac.in"), 
                          (340, "Password", "••••••••••••"),
                          (250, "Select Role", "Citizen Reporter  ▼")]:
        ax.text(w/2 - 200, y + 25, label, fontsize=11, color='#94a3b8')
        f_box = patches.FancyBboxPatch((w/2 - 200, y - 15), 400, 35, boxstyle="round,pad=3",
                                       facecolor='#0f172a', edgecolor='#475569', lw=1)
        ax.add_patch(f_box)
        ax.text(w/2 - 185, y - 7, val, fontsize=11, color='#e2e8f0')

    # Submit button
    btn = patches.FancyBboxPatch((w/2 - 200, 160), 400, 42, boxstyle="round,pad=4",
                                 facecolor='#10b981', edgecolor='#059669', lw=1)
    ax.add_patch(btn)
    ax.text(w/2, 175, "Secure Login ➔", fontsize=13, fontweight='bold', color='#ffffff', ha='center')

# Screen 2: Register
def content_register(ax, w, h):
    card = patches.FancyBboxPatch((w/2 - 270, 100), 540, 470, boxstyle="round,pad=10",
                                  facecolor='#1e293b', edgecolor='#334155', lw=2)
    ax.add_patch(card)
    ax.text(w/2, 520, "Citizen Registration", fontsize=16, fontweight='bold', color='#f8fafc', ha='center')
    
    fields = [(450, "Full Name", "Athul Krishna R"),
              (380, "Email Address", "athul.krishna@gmail.com"),
              (310, "Phone Number", "+91 98471 23456"),
              (240, "Ward / Municipality", "Perinthalmanna - Ward 14"),
              (170, "Password", "••••••••••••")]
    for y, label, val in fields:
        ax.text(w/2 - 220, y + 20, label, fontsize=10.5, color='#94a3b8')
        f_box = patches.FancyBboxPatch((w/2 - 220, y - 15), 440, 32, boxstyle="round,pad=3",
                                       facecolor='#0f172a', edgecolor='#475569', lw=1)
        ax.add_patch(f_box)
        ax.text(w/2 - 205, y - 6, val, fontsize=11, color='#e2e8f0')

# Screen 3: Admin Live Map & Dashboard
def content_admin_map(ax, w, h):
    # Stats row
    stats = [(60, "TOTAL REPORTS", "1,248", "#38bdf8"),
             (360, "PENDING VERIFICATION", "42", "#f59e0b"),
             (660, "ACTIVE SQUADS", "18 Teams", "#10b981"),
             (960, "CLEANED THIS MONTH", "892", "#a855f7")]
    for x, label, val, col in stats:
        box = patches.FancyBboxPatch((x, 480), 270, 80, boxstyle="round,pad=4",
                                     facecolor='#1e293b', edgecolor='#334155', lw=1.5)
        ax.add_patch(box)
        ax.text(x + 20, 530, label, fontsize=10, fontweight='bold', color='#94a3b8')
        ax.text(x + 20, 495, val, fontsize=22, fontweight='bold', color=col)

    # Interactive Map Frame
    map_box = patches.Rectangle((60, 80), 1170, 380, facecolor='#1e293b', edgecolor='#334155', lw=1.5)
    ax.add_patch(map_box)
    ax.text(80, 430, "📍 Real-Time GPS Incident Map (OpenStreetMap / Leaflet Integration)", fontsize=13, fontweight='bold', color='#f8fafc')
    
    # Mock map grid / roads
    ax.plot([120, 1150], [250, 250], color='#334155', lw=3)
    ax.plot([400, 400], [100, 420], color='#334155', lw=3)
    ax.plot([800, 800], [100, 420], color='#334155', lw=3)
    ax.plot([200, 1000], [150, 350], color='#475569', lw=2, linestyle='--')
    
    # Markers
    markers = [(300, 270, '#ef4444', "High: Dump near Market"),
               (550, 320, '#f59e0b', "Med: Overflowing Bin"),
               (750, 180, '#10b981', "Cleaned: Town Hall"),
               (950, 290, '#38bdf8', "Assigned: Ward 4")]
    for mx, my, mcol, mtxt in markers:
        pin = plt.Circle((mx, my), 12, color=mcol)
        ax.add_patch(pin)
        p_box = patches.FancyBboxPatch((mx + 15, my - 12), 170, 26, boxstyle="round,pad=2",
                                       facecolor='#0f172a', edgecolor=mcol, lw=1)
        ax.add_patch(p_box)
        ax.text(mx + 22, my - 4, mtxt, fontsize=8.5, color='#ffffff')

# Screen 4: Report Waste
def content_report(ax, w, h):
    # Left column: Form
    card_l = patches.FancyBboxPatch((60, 80), 550, 480, boxstyle="round,pad=6",
                                    facecolor='#1e293b', edgecolor='#334155', lw=1.5)
    ax.add_patch(card_l)
    ax.text(85, 520, "Submit Waste Geo-Report", fontsize=15, fontweight='bold', color='#f8fafc')

    fields = [(450, "Incident Title", "Plastic bottle heap near bus station"),
              (370, "Coordinates (Auto GPS)", "10.9765° N, 76.2241° E (Accuracy: 4m)"),
              (290, "Estimated Waste Category", "Plastic & Polymer Waste  ▼"),
              (210, "Severity Level", "High - Immediate Action Required  ▼"),
              (130, "Detailed Landmark Notes", "Behind KSRTC bus bay counter, roadside overflow")]
    for y, label, val in fields:
        ax.text(85, y + 20, label, fontsize=10.5, color='#94a3b8')
        f_box = patches.FancyBboxPatch((85, y - 15), 500, 32, boxstyle="round,pad=3",
                                       facecolor='#0f172a', edgecolor='#475569', lw=1)
        ax.add_patch(f_box)
        ax.text(95, y - 5, val, fontsize=10, color='#e2e8f0')

    # Right column: Upload & Photo Preview
    card_r = patches.FancyBboxPatch((650, 80), 580, 480, boxstyle="round,pad=6",
                                    facecolor='#1e293b', edgecolor='#334155', lw=1.5)
    ax.add_patch(card_r)
    ax.text(675, 520, "Uploaded Before-Cleaning Photo", fontsize=15, fontweight='bold', color='#f8fafc')
    
    preview_box = patches.Rectangle((675, 160), 530, 320, facecolor='#0f172a', edgecolor='#10b981', lw=2)
    ax.add_patch(preview_box)
    ax.text(940, 330, "📷 [ Geo-Tagged High-Resolution Image Preview ]", fontsize=13, color='#6ee7b7', ha='center')
    ax.text(940, 290, "Timestamp: 26-Oct-2026 10:15 AM | GPS: 10.9765, 76.2241", fontsize=10, color='#94a3b8', ha='center')

    # Submit button
    btn = patches.FancyBboxPatch((675, 100), 530, 45, boxstyle="round,pad=4",
                                 facecolor='#10b981', edgecolor='#059669', lw=1)
    ax.add_patch(btn)
    ax.text(940, 118, "Submit Report & Earn 50 Eco-Points ➔", fontsize=13, fontweight='bold', color='#ffffff', ha='center')

# Screen 5: Worker Job Sheet
def content_worker(ax, w, h):
    # Worker task list
    for idx, (y, task_id, title, loc, dist, status, st_col) in enumerate([
        (430, "TSK-8091", "Clear Plastic Dump at Market Road", "Ward 12, Market Junction", "0.4 km away", "In Progress", "#f59e0b"),
        (300, "TSK-8089", "E-Waste Disposal at College Corner", "College Rd, Gate 2", "1.2 km away", "Assigned", "#38bdf8"),
        (170, "TSK-8085", "Organic Garbage Collection", "Hospital Rd, Lane 4", "2.1 km away", "Completed", "#10b981")
    ]):
        box = patches.FancyBboxPatch((60, y), 1170, 110, boxstyle="round,pad=6",
                                     facecolor='#1e293b', edgecolor='#334155', lw=1.5)
        ax.add_patch(box)
        ax.text(90, y + 70, task_id, fontsize=12, fontweight='bold', color='#38bdf8')
        ax.text(200, y + 70, title, fontsize=14, fontweight='bold', color='#f8fafc')
        ax.text(90, y + 30, f"📍 Location: {loc}  |  📏 Distance: {dist}", fontsize=11, color='#94a3b8')

        st_badge = patches.FancyBboxPatch((850, y + 45), 130, 35, boxstyle="round,pad=3",
                                          facecolor='#0f172a', edgecolor=st_col, lw=1.5)
        ax.add_patch(st_badge)
        ax.text(915, y + 57, status, fontsize=11, fontweight='bold', color=st_col, ha='center')

        act_btn = patches.FancyBboxPatch((1010, y + 45), 190, 35, boxstyle="round,pad=3",
                                         facecolor='#0284c7' if status != "Completed" else '#334155',
                                         edgecolor='#0369a1', lw=1)
        ax.add_patch(act_btn)
        act_text = "Upload After Photo ➔" if status != "Completed" else "Verified ✓"
        ax.text(1105, y + 57, act_text, fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')

# Screen 6: AI Waste Scanner
def content_ai_scanner(ax, w, h):
    # Left: Scanning Viewport
    view = patches.Rectangle((80, 80), 550, 480, facecolor='#0f172a', edgecolor='#10b981', lw=2.5)
    ax.add_patch(view)
    ax.text(355, 360, "[ AI Image Analysis Viewport ]", fontsize=15, fontweight='bold', color='#6ee7b7', ha='center')
    
    # Laser scan line
    ax.plot([90, 620], [300, 300], color='#22c55e', lw=4)
    ax.text(355, 270, "Scanning Feature Vectors... 88% Confidence", fontsize=11, color='#4ade80', ha='center')

    # Right: Classification results card
    card = patches.FancyBboxPatch((680, 80), 540, 480, boxstyle="round,pad=8",
                                  facecolor='#1e293b', edgecolor='#334155', lw=1.5)
    ax.add_patch(card)
    ax.text(710, 510, "Automated AI Waste Categorization", fontsize=16, fontweight='bold', color='#f8fafc')
    
    metrics = [
        ("Detected Class:", "Plastic Containers & Bottles (PET/HDPE)", "#38bdf8"),
        ("Model Confidence:", "94.6% Accuracy (CNN Deep Model)", "#10b981"),
        ("Estimated Volume:", "Approx. 1.8 cubic meters", "#f59e0b"),
        ("Hazard Index:", "Medium Severity (Non-Toxic Recyclable)", "#fbbf24"),
        ("Recommended Action:", "Deploy Dry-Waste Recycler Truck", "#a855f7")
    ]
    for idx, (label, val, col) in enumerate(metrics):
        py = 430 - idx * 70
        ax.text(710, py + 20, label, fontsize=11, color='#94a3b8')
        ax.text(710, py - 5, val, fontsize=13, fontweight='bold', color=col)

# Screen 7: Leaderboard & Gamification
def content_leaderboard(ax, w, h):
    # Top User Profile Card
    u_card = patches.FancyBboxPatch((60, 440), 1170, 120, boxstyle="round,pad=6",
                                    facecolor='#1e293b', edgecolor='#10b981', lw=2)
    ax.add_patch(u_card)
    ax.text(90, 520, "Athul Krishna R (You)", fontsize=18, fontweight='bold', color='#f8fafc')
    ax.text(90, 480, "Municipal Ward 14  |  Total Verified Reports: 9", fontsize=12, color='#94a3b8')
    
    # Points & Badge
    ax.text(700, 515, "Current Balance", fontsize=11, color='#94a3b8')
    ax.text(700, 475, "450 Eco-Points", fontsize=22, fontweight='bold', color='#10b981')
    
    badge_box = patches.FancyBboxPatch((940, 465), 250, 65, boxstyle="round,pad=4",
                                       facecolor='#065f46', edgecolor='#34d399', lw=1.5)
    ax.add_patch(badge_box)
    ax.text(1065, 498, "Tier: ECO WARRIOR 🏆", fontsize=13, fontweight='bold', color='#6ee7b7', ha='center')

    # City Rankings Table
    ax.text(60, 400, "City-Wide Civic Leadership Board (Top Contributors)", fontsize=14, fontweight='bold', color='#f8fafc')
    ranks = [
        (1, "Rahul Menath", "Ward 08", "720 pts", "Eco Champion 🥇"),
        (2, "Athul Krishna R", "Ward 14", "450 pts", "Eco Warrior 🥈"),
        (3, "Sneha Varma", "Ward 03", "380 pts", "Eco Guardian 🥉"),
        (4, "Fahad P", "Ward 11", "310 pts", "Active Reporter")
    ]
    for idx, (rk, name, ward, pts, badge) in enumerate(ranks):
        ry = 320 - idx * 60
        r_box = patches.FancyBboxPatch((60, ry), 1170, 50, boxstyle="round,pad=3",
                                       facecolor='#1e293b' if rk != 2 else '#1e3a5f',
                                       edgecolor='#334155' if rk != 2 else '#38bdf8', lw=1.5)
        ax.add_patch(r_box)
        ax.text(90, ry + 18, f"#{rk}", fontsize=13, fontweight='bold', color='#38bdf8')
        ax.text(160, ry + 18, name, fontsize=13, fontweight='bold', color='#f8fafc')
        ax.text(450, ry + 18, ward, fontsize=12, color='#94a3b8')
        ax.text(750, ry + 18, pts, fontsize=13, fontweight='bold', color='#10b981')
        ax.text(1000, ry + 18, badge, fontsize=12, fontweight='bold', color='#facc15')

# Screen 8: Analytics & Trends
def content_analytics(ax, w, h):
    # Left Chart: Waste Categories Breakdown
    box_l = patches.FancyBboxPatch((60, 80), 560, 480, boxstyle="round,pad=6",
                                   facecolor='#1e293b', edgecolor='#334155', lw=1.5)
    ax.add_patch(box_l)
    ax.text(90, 520, "Waste Distribution by Classification", fontsize=15, fontweight='bold', color='#f8fafc')
    
    cats = [("Plastic & Polymers", 45, "#38bdf8"),
            ("Organic & Food Waste", 30, "#10b981"),
            ("Electronic Waste (E-Waste)", 15, "#f59e0b"),
            ("Hazardous / Chemical", 10, "#ef4444")]
    for idx, (cat_name, pct, c_col) in enumerate(cats):
        cy = 440 - idx * 80
        ax.text(90, cy + 25, f"{cat_name} ({pct}%)", fontsize=11, fontweight='bold', color='#cbd5e1')
        # Bar track
        track = patches.Rectangle((90, cy - 5), 500, 20, facecolor='#0f172a', edgecolor='#475569', lw=1)
        ax.add_patch(track)
        # Bar fill
        fill = patches.Rectangle((90, cy - 5), 500 * (pct / 100), 20, facecolor=c_col)
        ax.add_patch(fill)

    # Right Chart: Monthly Cleanups Trend
    box_r = patches.FancyBboxPatch((660, 80), 570, 480, boxstyle="round,pad=6",
                                   facecolor='#1e293b', edgecolor='#334155', lw=1.5)
    ax.add_patch(box_r)
    ax.text(690, 520, "Monthly Cleanup Velocity & Resolution Rate", fontsize=15, fontweight='bold', color='#f8fafc')
    
    months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"]
    reports = [110, 160, 210, 280, 340, 420]
    for idx, (m, val) in enumerate(zip(months, reports)):
        bx = 710 + idx * 80
        bar_h = val * 0.7
        b_bar = patches.Rectangle((bx, 150), 50, bar_h, facecolor='#10b981', edgecolor='#059669', lw=1)
        ax.add_patch(b_bar)
        ax.text(bx + 25, 120, m, fontsize=11, color='#94a3b8', ha='center')
        ax.text(bx + 25, 155 + bar_h, str(val), fontsize=10, fontweight='bold', color='#6ee7b7', ha='center')

create_mockup("screen1_login.png", "System Authentication & Portal Access", "Citizen, Worker, and Administrator Multi-Role Login", content_login)
create_mockup("screen2_register.png", "New Citizen Registration", "Account Creation with Municipality Ward Geocoding", content_register)
create_mockup("screen3_admin_map.png", "Municipal Administration Dashboard", "Real-Time GPS Incident Mapping & Active Fleet Monitoring", content_admin_map)
create_mockup("screen4_report_waste.png", "Citizen Waste Reporting Module", "Interactive Map Geolocation Pinning & Before-Cleaning Photo Ingestion", content_report)
create_mockup("screen5_worker_jobs.png", "Sanitation Worker Mobile Job Sheet", "Active Task Dispatch, Navigation Vectors & Verification Trigger", content_worker)
create_mockup("screen6_ai_scanner.png", "AI Waste Scanner Simulation", "Deep Feature Extraction, Material Classification & Severity Metric", content_ai_scanner)
create_mockup("screen7_leaderboard.png", "Civic Gamification & Leaderboard", "Eco-Points Balance, Achievement Badges & Community Rankings", content_leaderboard)
create_mockup("screen8_admin_analytics.png", "Municipal Waste Intelligence & Analytics", "Classification Percentages & Monthly Resolution Trend Metrics", content_analytics)
print("All 8 mockups successfully generated!")
