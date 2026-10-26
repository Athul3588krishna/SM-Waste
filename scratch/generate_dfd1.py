import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

diag_dir = r"d:\Smart waste management\scratch\diagrams"
os.makedirs(diag_dir, exist_ok=True)

# 4. DFD Level 1 Admin
def generate_dfd_1_admin():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')

    def draw_entity(x, y, w, h, text):
        rect = patches.Rectangle((x, y), w, h, edgecolor='#2c3e50', facecolor='#ebedef', lw=2)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, text, fontsize=10, fontweight='bold', ha='center', va='center')

    def draw_process(x, y, num, name):
        circle = patches.Circle((x, y), 0.8, edgecolor='#2980b9', facecolor='#ebf5fb', lw=2)
        ax.add_patch(circle)
        ax.text(x, y + 0.2, num, fontsize=10, fontweight='bold', ha='center', color='#1b4f72')
        ax.text(x, y - 0.2, name, fontsize=8.5, fontweight='bold', ha='center', va='center', color='#1b4f72')

    def draw_store(x, y, w, h, name):
        ax.plot([x, x+w], [y, y], color='#d35400', lw=2)
        ax.plot([x, x+w], [y+h, y+h], color='#d35400', lw=2)
        ax.plot([x, x], [y, y+h], color='#d35400', lw=2)
        ax.text(x + w/2, y + h/2, f"D: {name}", fontsize=9, fontweight='bold', ha='center', va='center', color='#ba4a00')

    draw_entity(0.5, 2.5, 1.8, 1.2, "Municipal\nAdmin")
    draw_process(4.0, 4.5, "1.1", "Verify\nComplaints")
    draw_process(4.0, 2.5, "1.2", "Assign\nTask/Worker")
    draw_process(4.0, 0.7, "1.3", "Generate\nAnalytics")
    
    draw_store(7.5, 4.0, 2.2, 0.8, "Complaints DB")
    draw_store(7.5, 2.1, 2.2, 0.8, "Workers DB")
    draw_store(7.5, 0.5, 2.2, 0.8, "Reports Archive")

    def connect(x1, y1, x2, y2, label=""):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1), arrowprops=dict(arrowstyle="->", color="#34495e", lw=1.3))
        if label:
            mx, my = (x1 + x2)/2, (y1 + y2)/2
            ax.text(mx, my + 0.15, label, fontsize=8, color="#2c3e50", ha='center')

    connect(2.3, 3.4, 3.3, 4.2, "Review ticket")
    connect(2.3, 3.1, 3.2, 2.5, "Select worker")
    connect(2.3, 2.7, 3.3, 1.1, "Request stats")

    connect(4.8, 4.5, 7.5, 4.5, "Update status")
    connect(4.8, 2.5, 7.5, 2.5, "Task record")
    connect(7.5, 0.9, 4.8, 0.9, "Aggregated data")

    save_path = os.path.join(diag_dir, "dfd_level_1_admin.png")
    plt.tight_layout()
    plt.savefig(save_path, bbox_inches='tight', dpi=300)
    plt.close()
    print("Saved:", save_path)

# 5. DFD Level 1 User
def generate_dfd_1_user():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')

    def draw_entity(x, y, w, h, text):
        rect = patches.Rectangle((x, y), w, h, edgecolor='#2c3e50', facecolor='#ebedef', lw=2)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, text, fontsize=10, fontweight='bold', ha='center', va='center')

    def draw_process(x, y, num, name):
        circle = patches.Circle((x, y), 0.8, edgecolor='#27ae60', facecolor='#eafaf1', lw=2)
        ax.add_patch(circle)
        ax.text(x, y + 0.2, num, fontsize=10, fontweight='bold', ha='center', color='#145a32')
        ax.text(x, y - 0.2, name, fontsize=8.5, fontweight='bold', ha='center', va='center', color='#145a32')

    def draw_store(x, y, w, h, name):
        ax.plot([x, x+w], [y, y], color='#8e44ad', lw=2)
        ax.plot([x, x+w], [y+h, y+h], color='#8e44ad', lw=2)
        ax.plot([x, x], [y, y+h], color='#8e44ad', lw=2)
        ax.text(x + w/2, y + h/2, f"D: {name}", fontsize=9, fontweight='bold', ha='center', va='center', color='#6c3483')

    draw_entity(0.5, 2.5, 1.8, 1.2, "Citizen\nReporter")
    draw_process(4.0, 4.5, "2.1", "Capture &\nPin Location")
    draw_process(4.0, 2.5, "2.2", "AI Waste\nScanning")
    draw_process(4.0, 0.7, "2.3", "Points &\nReward Ledger")
    
    draw_store(7.5, 4.2, 2.2, 0.8, "Complaints DB")
    draw_store(7.5, 2.3, 2.2, 0.8, "Waste Categories")
    draw_store(7.5, 0.5, 2.2, 0.8, "User Points DB")

    def connect(x1, y1, x2, y2, label=""):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1), arrowprops=dict(arrowstyle="->", color="#34495e", lw=1.3))
        if label:
            mx, my = (x1 + x2)/2, (y1 + y2)/2
            ax.text(mx, my + 0.15, label, fontsize=8, color="#2c3e50", ha='center')

    connect(2.3, 3.4, 3.3, 4.2, "GPS coords & photo")
    connect(2.3, 3.1, 3.2, 2.5, "Image feed")
    connect(4.0, 1.6, 2.3, 2.7, "Eco-Points update")

    connect(4.8, 4.5, 7.5, 4.5, "Store complaint")
    connect(4.8, 2.5, 7.5, 2.5, "Classify severity")
    connect(7.5, 0.9, 4.8, 0.9, "Credit balance")

    save_path = os.path.join(diag_dir, "dfd_level_1_user.png")
    plt.tight_layout()
    plt.savefig(save_path, bbox_inches='tight', dpi=300)
    plt.close()
    print("Saved:", save_path)

generate_dfd_1_admin()
generate_dfd_1_user()
