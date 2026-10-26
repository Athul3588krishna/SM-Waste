import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

diag_dir = r"d:\Smart waste management\scratch\diagrams"
os.makedirs(diag_dir, exist_ok=True)

# 1. Use Case Diagram
def generate_use_case():
    fig, ax = plt.subplots(figsize=(10, 8), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # System boundary box
    rect = patches.FancyBboxPatch((2.2, 0.5), 5.6, 9.0, boxstyle="round,pad=0.2",
                                  edgecolor="#2c3e50", facecolor="#f8f9fa", linewidth=2)
    ax.add_patch(rect)
    ax.text(5.0, 9.2, "EcoClean System Boundary", fontsize=14, fontweight='bold', ha='center', color="#1a252f")
    
    # Actors (Citizen, Admin, Worker)
    def draw_actor(x, y, name):
        circle = plt.Circle((x, y + 0.35), 0.2, color='#2980b9', ec='#1a5276', lw=1.5)
        ax.add_patch(circle)
        ax.plot([x, x], [y + 0.15, y - 0.25], color='#1a5276', lw=2) # body
        ax.plot([x - 0.25, x + 0.25], [y + 0.05, y + 0.05], color='#1a5276', lw=2) # arms
        ax.plot([x, x - 0.2], [y - 0.25, y - 0.55], color='#1a5276', lw=2) # left leg
        ax.plot([x, x + 0.2], [y - 0.25, y - 0.55], color='#1a5276', lw=2) # right leg
        ax.text(x, y - 0.75, name, fontsize=11, fontweight='bold', ha='center', color='#1a5276')

    draw_actor(1.0, 7.0, "Citizen")
    draw_actor(1.0, 2.5, "Sanitation\nWorker")
    draw_actor(9.0, 5.0, "Municipal\nAdmin")
    
    # Use cases (ellipses)
    use_cases = [
        (5.0, 8.4, "Register / Login"),
        (5.0, 7.4, "Report Waste with Geo-Pin"),
        (5.0, 6.4, "Simulate AI Waste Scanner"),
        (5.0, 5.4, "View Eco-Points & Badges"),
        (5.0, 4.4, "Monitor Active Waste Map"),
        (5.0, 3.4, "Assign Task & Set Deadline"),
        (5.0, 2.4, "Navigate to Dump & Clean"),
        (5.0, 1.4, "Upload After-Clean Verification")
    ]
    
    for ux, uy, utext in use_cases:
        ellipse = patches.Ellipse((ux, uy), 3.4, 0.65, edgecolor='#27ae60', facecolor='#e8f8f5', linewidth=1.5)
        ax.add_patch(ellipse)
        ax.text(ux, uy, utext, fontsize=9.5, fontweight='bold', ha='center', va='center', color='#145a32')
        
    # Connections
    # Citizen to UC 0, 1, 2, 3
    ax.plot([1.2, 3.3], [7.0, 8.4], color='#7f8c8d', linestyle='-', lw=1.2)
    ax.plot([1.2, 3.3], [7.0, 7.4], color='#7f8c8d', linestyle='-', lw=1.2)
    ax.plot([1.2, 3.3], [7.0, 6.4], color='#7f8c8d', linestyle='-', lw=1.2)
    ax.plot([1.2, 3.3], [7.0, 5.4], color='#7f8c8d', linestyle='-', lw=1.2)
    
    # Admin to UC 0, 4, 5
    ax.plot([8.8, 6.7], [5.0, 8.4], color='#7f8c8d', linestyle='-', lw=1.2)
    ax.plot([8.8, 6.7], [5.0, 4.4], color='#7f8c8d', linestyle='-', lw=1.2)
    ax.plot([8.8, 6.7], [5.0, 3.4], color='#7f8c8d', linestyle='-', lw=1.2)
    
    # Worker to UC 0, 6, 7
    ax.plot([1.2, 3.3], [2.5, 8.4], color='#7f8c8d', linestyle='-', lw=1.2)
    ax.plot([1.2, 3.3], [2.5, 2.4], color='#7f8c8d', linestyle='-', lw=1.2)
    ax.plot([1.2, 3.3], [2.5, 1.4], color='#7f8c8d', linestyle='-', lw=1.2)

    save_path = os.path.join(diag_dir, "use_case_diagram.png")
    plt.tight_layout()
    plt.savefig(save_path, bbox_inches='tight', dpi=300)
    plt.close()
    print("Saved:", save_path)

# 2. DFD Level 0
def generate_dfd_0():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis('off')
    
    # Entities
    def draw_entity(x, y, w, h, text):
        rect = patches.Rectangle((x, y), w, h, edgecolor='#2c3e50', facecolor='#ebedef', lw=2)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, text, fontsize=11, fontweight='bold', ha='center', va='center', color='#1a252f')

    # Process circle
    circle = patches.Circle((5.0, 2.5), 1.2, edgecolor='#16a085', facecolor='#e8f8f5', lw=2.5)
    ax.add_patch(circle)
    ax.text(5.0, 2.8, "0.0", fontsize=12, fontweight='bold', ha='center', color='#117864')
    ax.text(5.0, 2.3, "EcoClean\nSystem", fontsize=11, fontweight='bold', ha='center', va='center', color='#117864')
    
    draw_entity(0.5, 3.2, 1.8, 1.0, "Citizen")
    draw_entity(0.5, 0.8, 1.8, 1.0, "Sanitation\nWorker")
    draw_entity(7.7, 2.0, 1.8, 1.0, "Municipal\nAdmin")
    
    # Arrows
    def draw_arrow(x1, y1, x2, y2, text, txt_x, txt_y):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color="#2c3e50", lw=1.5))
        ax.text(txt_x, txt_y, text, fontsize=8.5, color="#2c3e50", ha='center', style='italic')

    draw_arrow(2.3, 3.8, 3.9, 3.1, "Waste Report, Photo & GPS", 2.9, 3.65)
    draw_arrow(3.8, 2.7, 2.3, 3.4, "Eco-Points & Badges", 2.9, 2.9)
    
    draw_arrow(7.7, 2.7, 6.2, 2.7, "Task Assignment & Rules", 6.9, 2.85)
    draw_arrow(6.2, 2.3, 7.7, 2.3, "Analytics & Verified Reports", 6.9, 2.1)
    
    draw_arrow(2.3, 1.2, 3.9, 2.0, "After-Cleaning Proof", 2.9, 1.4)
    draw_arrow(4.1, 1.7, 2.3, 1.0, "Assigned Task List", 3.1, 0.8)

    save_path = os.path.join(diag_dir, "dfd_level_0.png")
    plt.tight_layout()
    plt.savefig(save_path, bbox_inches='tight', dpi=300)
    plt.close()
    print("Saved:", save_path)

# 3. System Architecture Diagram
def generate_architecture():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')
    
    # 3 Layers: Presentation, Business Logic, Data
    def draw_tier(x, y, w, h, title, subtitle, color_bg, color_border):
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.15",
                                      edgecolor=color_border, facecolor=color_bg, lw=2)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h - 0.35, title, fontsize=11, fontweight='bold', ha='center', color=color_border)
        ax.text(x + w/2, y + h/2 - 0.2, subtitle, fontsize=9.5, ha='center', va='center', color="#2c3e50")

    draw_tier(0.5, 4.0, 9.0, 1.5, "PRESENTATION TIER (CLIENT)", 
              "React SPA | Vite Engine | Leaflet OpenStreetMap | Recharts Visualization | Responsive Tailwind UI",
              "#ebf5fb", "#2980b9")
    
    draw_tier(0.5, 2.1, 9.0, 1.5, "APPLICATION TIER (BACKEND / REST API)", 
              "Node.js & Express Server | JWT Authentication Middleware | Multer Image Handler | Role-Based Access Control",
              "#eafaf1", "#27ae60")
    
    draw_tier(0.5, 0.2, 9.0, 1.5, "DATA TIER (PERSISTENCE LAYER)", 
              "MongoDB Database | Mongoose Schema Validation | Geospatial Coordinates | Cloudinary Storage",
              "#fef9e7", "#d4ac0d")
              
    # Arrows connecting tiers
    ax.annotate('', xy=(5.0, 3.6), xytext=(5.0, 4.0),
                arrowprops=dict(arrowstyle="<->", color="#34495e", lw=2))
    ax.text(5.2, 3.8, "HTTP/REST (JSON)", fontsize=9, fontweight='bold', color="#34495e")
    
    ax.annotate('', xy=(5.0, 1.7), xytext=(5.0, 2.1),
                arrowprops=dict(arrowstyle="<->", color="#34495e", lw=2))
    ax.text(5.2, 1.9, "Mongoose ODM Queries", fontsize=9, fontweight='bold', color="#34495e")

    save_path = os.path.join(diag_dir, "system_architecture.png")
    plt.tight_layout()
    plt.savefig(save_path, bbox_inches='tight', dpi=300)
    plt.close()
    print("Saved:", save_path)

generate_use_case()
generate_dfd_0()
generate_architecture()
