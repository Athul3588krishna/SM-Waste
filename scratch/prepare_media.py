from PIL import Image
import os

diag_dir = r"d:\Smart waste management\scratch\diagrams"
mockup_dir = r"d:\Smart waste management\scratch\mockups"
ready_media = r"d:\Smart waste management\scratch\ready_media"
os.makedirs(ready_media, exist_ok=True)

# 1. Image3 (PNG) -> use_case_diagram.png
im3 = Image.open(os.path.join(diag_dir, "use_case_diagram.png"))
im3.save(os.path.join(ready_media, "image3.png"), "PNG")

# 2. Image4 (JPEG) -> dfd_level_0.png
im4 = Image.open(os.path.join(diag_dir, "dfd_level_0.png")).convert("RGB")
im4.save(os.path.join(ready_media, "image4.jpeg"), "JPEG", quality=95)

# 3. Image5 (PNG) -> dfd_level_1_admin.png
im5 = Image.open(os.path.join(diag_dir, "dfd_level_1_admin.png"))
im5.save(os.path.join(ready_media, "image5.png"), "PNG")

# 4. Image6 (PNG) -> dfd_level_1_user.png
im6 = Image.open(os.path.join(diag_dir, "dfd_level_1_user.png"))
im6.save(os.path.join(ready_media, "image6.png"), "PNG")

# 5. Image7 (PNG) -> dfd_level_2.png
im7 = Image.open(os.path.join(diag_dir, "dfd_level_2.png"))
im7.save(os.path.join(ready_media, "image7.png"), "PNG")

# 6. Image8 (PNG) -> system_architecture.png
im8 = Image.open(os.path.join(diag_dir, "system_architecture.png"))
im8.save(os.path.join(ready_media, "image8.png"), "PNG")

# 7. Images 9 to 16 (JPEG) -> screen1 to screen8
screens = [
    ("image9.jpeg", "screen1_login.png"),
    ("image10.jpeg", "screen2_register.png"),
    ("image11.jpeg", "screen3_admin_map.png"),
    ("image12.jpeg", "screen4_report_waste.png"),
    ("image13.jpeg", "screen5_worker_jobs.png"),
    ("image14.jpeg", "screen6_ai_scanner.png"),
    ("image15.jpeg", "screen7_leaderboard.png"),
    ("image16.jpeg", "screen8_admin_analytics.png"),
]

for target_name, src_name in screens:
    src_p = os.path.join(mockup_dir, src_name)
    im = Image.open(src_p).convert("RGB")
    im.save(os.path.join(ready_media, target_name), "JPEG", quality=95)
    print(f"Prepared media: {target_name} from {src_name}")

print("All media assets prepared successfully!")
