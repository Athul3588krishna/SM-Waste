import docx
import shutil

desktop_docx = r"C:\Users\User\Desktop\Documentation\Athul_Krishna_R_EcoClean_Report_Final.docx"
latest_docx = r"d:\Smart waste management\Athul_Krishna_R_EcoClean_Report_Latest.docx"

doc = docx.Document(desktop_docx)

# P270 (SRS Libraries)
doc.paragraphs[270].text = "Libraries & APIs\t: React-Leaflet, OpenStreetMap Tiles, Recharts, Socket.io (Real-Time WebSockets), Axios, Bcrypt.js, JWT, Multer, Cloudinary"

# P544 (Add Socket.io details alongside AI scanner)
p544_text = "The AI Waste Scanner simulation incorporates computer vision feature extraction principles to analyze uploaded garbage dump imagery. By evaluating pixel color distributions, contour densities, and material texture patterns, the algorithm estimates waste classifications (such as Plastic Polymers, Biodegradable Organic Matter, or Toxic E-Waste) and assigns an appropriate severity score to prioritize sanitation dispatch."
doc.paragraphs[544].text = p544_text

doc.save(desktop_docx)
shutil.copyfile(desktop_docx, latest_docx)
print("Updated desktop and latest docx with Socket.io and full tech alignment!")
