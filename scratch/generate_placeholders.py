import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

placeholder_dir = r"d:\Smart waste management\scratch\collection_placeholders"
os.makedirs(placeholder_dir, exist_ok=True)

def create_collection_placeholder(filename, collection_title, collection_subtitle):
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=200)
    ax.set_xlim(0, 1000)
    ax.set_ylim(0, 450)
    ax.axis('off')

    # Outer dashed frame
    frame = patches.FancyBboxPatch((20, 20), 960, 410, boxstyle="round,pad=10",
                                  facecolor='#f8fafc', edgecolor='#059669', lw=2, linestyle='--')
    ax.add_patch(frame)

    # Inner decorative container
    inner = patches.FancyBboxPatch((40, 40), 920, 370, boxstyle="round,pad=8",
                                  facecolor='#f1f5f9', edgecolor='#cbd5e1', lw=1)
    ax.add_patch(inner)

    # Database Icon / Badge
    db_badge = patches.FancyBboxPatch((420, 320), 160, 50, boxstyle="round,pad=5",
                                      facecolor='#059669', edgecolor='#047857', lw=1.5)
    ax.add_patch(db_badge)
    ax.text(500, 345, "MongoDB", fontsize=14, fontweight='bold', color='#ffffff', ha='center', va='center')

    # Main placeholder prompt text
    ax.text(500, 265, "[ INSERT SCREENSHOT HERE ]", fontsize=16, fontweight='bold', color='#0f172a', ha='center')
    ax.text(500, 220, collection_title, fontsize=14, fontweight='bold', color='#047857', ha='center')
    ax.text(500, 180, collection_subtitle, fontsize=11, color='#475569', ha='center', style='italic')

    # Instructional hint box
    hint_box = patches.FancyBboxPatch((150, 70), 700, 65, boxstyle="round,pad=4",
                                      facecolor='#ffffff', edgecolor='#94a3b8', lw=1)
    ax.add_patch(hint_box)
    ax.text(500, 110, "How to replace in Microsoft Word:", fontsize=9.5, fontweight='bold', color='#334155', ha='center')
    ax.text(500, 85, "Right Click on this image  -->  Select 'Change Picture'  -->  Choose your MongoDB Compass / Atlas Screenshot", 
            fontsize=9, color='#64748b', ha='center')

    save_path = os.path.join(placeholder_dir, filename)
    plt.tight_layout()
    plt.savefig(save_path, bbox_inches='tight', dpi=200)
    plt.close()
    print("Generated placeholder:", save_path)

create_collection_placeholder(
    "placeholder_compass_db_overview.png",
    "MongoDB Compass - Database Collections Overview",
    "Displaying EcoClean Database & All Collections (users, complaints, teams, tasks, logs)"
)

create_collection_placeholder(
    "placeholder_users_collection.png",
    "MongoDB Compass - Users Collection Document View",
    "Displaying citizen, worker, and admin documents with bcrypt hashed passwords and Eco-Points"
)

create_collection_placeholder(
    "placeholder_complaints_collection.png",
    "MongoDB Compass - Complaints Collection Document View",
    "Displaying reported waste dump documents with GPS coordinates, photos, and status lifecycle"
)

create_collection_placeholder(
    "placeholder_teams_collection.png",
    "MongoDB Compass - Sanitation Teams Collection Document View",
    "Displaying sanitation cleanup squads, assigned municipal wards, and worker member arrays"
)

create_collection_placeholder(
    "placeholder_tasks_collection.png",
    "MongoDB Compass - Worker Job Tasks Collection Document View",
    "Displaying active task dispatch sheets, deadlines, priority levels, and assignment tracking"
)

create_collection_placeholder(
    "placeholder_validation_collection.png",
    "MongoDB Compass - Cleanup Validation Logs Collection Document View",
    "Displaying verified cleanups, before/after comparison photo URIs, and admin approval records"
)

print("All collection placeholder images generated successfully!")
