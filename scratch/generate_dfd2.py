import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

diag_dir = r"d:\Smart waste management\scratch\diagrams"
os.makedirs(diag_dir, exist_ok=True)

def generate_dfd_2():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')

    def draw_entity(x, y, w, h, text):
        rect = patches.Rectangle((x, y), w, h, edgecolor='#2c3e50', facecolor='#ebedef', lw=2)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, text, fontsize=10, fontweight='bold', ha='center', va='center')

    def draw_process(x, y, num, name):
        circle = patches.Circle((x, y), 0.75, edgecolor='#d35400', facecolor='#fef5e7', lw=2)
        ax.add_patch(circle)
        ax.text(x, y + 0.18, num, fontsize=9.5, fontweight='bold', ha='center', color='#935116')
        ax.text(x, y - 0.18, name, fontsize=8, fontweight='bold', ha='center', va='center', color='#935116')

    def draw_store(x, y, w, h, name):
        ax.plot([x, x+w], [y, y], color='#2980b9', lw=2)
        ax.plot([x, x+w], [y+h, y+h], color='#2980b9', lw=2)
        ax.plot([x, x], [y, y+h], color='#2980b9', lw=2)
        ax.text(x + w/2, y + h/2, f"D: {name}", fontsize=8.5, fontweight='bold', ha='center', va='center', color='#1f618d')

    draw_entity(0.4, 2.5, 1.8, 1.2, "Sanitation\nWorker")
    draw_process(3.5, 4.3, "2.1.1", "Query Active\nJob List")
    draw_process(3.5, 2.0, "2.1.2", "Route Nav &\nClean Dump")
    draw_process(6.5, 2.0, "2.1.3", "Upload After\nPhoto Proof")
    draw_entity(8.2, 4.0, 1.6, 1.2, "Municipal\nAdmin")
    draw_process(8.2, 1.8, "2.1.4", "Verify &\nClose Ticket")

    draw_store(5.5, 4.4, 2.0, 0.8, "Tasks DB")
    draw_store(4.5, 0.3, 2.2, 0.8, "Proof Records")

    def connect(x1, y1, x2, y2, label=""):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1), arrowprops=dict(arrowstyle="->", color="#34495e", lw=1.3))
        if label:
            mx, my = (x1 + x2)/2, (y1 + y2)/2
            ax.text(mx, my + 0.15, label, fontsize=7.5, color="#2c3e50", ha='center')

    connect(2.2, 3.4, 2.9, 4.1, "Worker Auth")
    connect(4.2, 4.3, 5.5, 4.6, "Fetch tasks")
    connect(3.5, 3.5, 3.5, 2.8, "Select dump")
    connect(4.3, 2.0, 5.7, 2.0, "Before/After")
    connect(6.5, 1.2, 6.0, 0.9, "Store proof")
    connect(7.3, 2.2, 8.2, 2.2, "Notify Admin")
    connect(8.8, 3.9, 8.8, 2.7, "Approve")

    save_path = os.path.join(diag_dir, "dfd_level_2.png")
    plt.tight_layout()
    plt.savefig(save_path, bbox_inches='tight', dpi=300)
    plt.close()
    print("Saved:", save_path)

generate_dfd_2()
