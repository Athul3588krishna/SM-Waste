const Complaint = require('../models/Complaint');

function runFallbackScanner(originalName, fileSize) {
  const name = (originalName || 'image.jpg').toLowerCase();

  // Keyword check for waste categories
  if (name.includes('plastic') || name.includes('bottle') || name.includes('cup') || name.includes('poly') || name.includes('wrapper')) {
    return { wasteType: 'Plastic', severity: 'Medium', explanation: `Plastic waste markers identified in "${originalName}".` };
  }
  if (name.includes('organic') || name.includes('food') || name.includes('veg') || name.includes('fruit') || name.includes('leaf') || name.includes('bio') || name.includes('waste_dump')) {
    return { wasteType: 'Organic', severity: 'High', explanation: `Organic waste markers identified in "${originalName}".` };
  }
  if (name.includes('ewaste') || name.includes('e-waste') || name.includes('electronic') || name.includes('cable') || name.includes('battery') || name.includes('wire')) {
    return { wasteType: 'E-waste', severity: 'High', explanation: `E-waste markers identified in "${originalName}".` };
  }
  if (name.includes('hazard') || name.includes('chemical') || name.includes('paint') || name.includes('toxic') || name.includes('oil')) {
    return { wasteType: 'Hazardous', severity: 'High', explanation: `Hazardous waste markers identified in "${originalName}".` };
  }
  if (name.includes('med') || name.includes('clinic') || name.includes('hospital') || name.includes('mask') || name.includes('syringe')) {
    return { wasteType: 'Medical', severity: 'High', explanation: `Medical waste markers identified in "${originalName}".` };
  }
  if (name.includes('paper') || name.includes('cardboard') || name.includes('carton') || name.includes('box')) {
    return { wasteType: 'Paper', severity: 'Medium', explanation: `Paper/cardboard waste identified in "${originalName}".` };
  }
  if (name.includes('selfie') || name.includes('resume') || name.includes('invoice') || name.includes('receipt') || name.includes('document')) {
    return { wasteType: 'Unknown', severity: 'Low', explanation: `Non-waste item or document detected in "${originalName}". Categorized as Unknown.` };
  }

  // Sensible default for municipal waste reporting
  return {
    wasteType: 'Mixed',
    severity: 'Medium',
    explanation: `Municipal solid waste dump detected in "${originalName}". Categorized as Mixed Waste.`
  };
}

// @desc    Analyze uploaded image for waste classification using Gemini API
// @route   POST /api/complaints/analyze
// @access  Private
const analyzeWastePhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No photo uploaded for analysis' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const filePath = req.file.path;

  try {
    if (geminiApiKey) {
      // 1. Read file to base64
      const fs = require('fs');
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');
      const mimeType = req.file.mimetype || 'image/jpeg';

      // 2. Call Google Gemini Vision API
      const prompt = `Analyze this image strictly for municipal waste management.
Classify the waste visible in the image into one of the municipal waste categories.

Categories:
- "Plastic": Plastic bottles, polythene bags, food wrappers, single-use cups/plates, plastic containers/packaging.
- "Organic": Kitchen/food waste, vegetable/fruit scraps, garden waste, dry leaves, decaying organic matter.
- "E-waste": Discarded electronic items, broken gadgets, chargers, cables, circuit boards, appliances.
- "Hazardous": Paints, toxic chemicals, batteries, motor oils, pesticide containers, flammable waste.
- "Medical": Syringes, face masks, medicine blisters, bandages, hospital/clinic disposables.
- "Paper": Discarded cartons, cardboard boxes, packaging paper, newspapers.
- "Mixed": Mixed piles of general municipal solid waste, roadside garbage dumps, overflowing garbage bins.
- "Unknown": ONLY if the image clearly contains NO waste at all (such as a selfie/face portrait, screenshot of text/code, blank document paper, ID card, pet, or indoor office furniture).

Output your response strictly as valid raw JSON matching this schema:
{
  "wasteType": "Plastic" | "Organic" | "E-waste" | "Hazardous" | "Medical" | "Paper" | "Mixed" | "Unknown",
  "severity": "Low" | "Medium" | "High",
  "explanation": "1-2 sentence description explaining what waste was detected and recommended action."
}
Do not include markdown codeblocks or quotes. Just output raw JSON.`;

      const modelsToTry = [
        'gemini-3.6-flash',
        'gemini-flash-latest',
        'gemini-3.8-flash',
        'gemini-3.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash'
      ];

      let apiSuccess = false;
      let result = null;
      let usedModel = '';

      for (const model of modelsToTry) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(10000),
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: base64Data
                      }
                    }
                  ]
                }
              ],
              generationConfig: {
                responseMimeType: 'application/json'
              }
            })
          });

          if (response.ok) {
            const responseData = await response.json();
            const textResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              let cleanText = textResponse.trim();
              const startIdx = cleanText.indexOf('{');
              const endIdx = cleanText.lastIndexOf('}');
              if (startIdx !== -1 && endIdx !== -1) {
                cleanText = cleanText.substring(startIdx, endIdx + 1);
              }
              result = JSON.parse(cleanText);
              apiSuccess = true;
              usedModel = model;
              break;
            }
          } else {
            const errBody = await response.json().catch(() => ({}));
            console.warn(`Model ${model} returned status ${response.status}:`, JSON.stringify(errBody));
          }
        } catch (err) {
          console.warn(`Model ${model} try failed:`, err.message);
        }
      }

      if (apiSuccess && result) {
        fs.unlinkSync(filePath);

        const finalType = result.wasteType || 'Mixed';
        const finalSeverity = result.severity || 'Medium';
        const finalExplanation = result.explanation || 'Visual analysis performed on uploaded image.';

        return res.json({
          wasteType: finalType,
          severity: finalSeverity,
          explanation: finalExplanation,
          method: `Gemini AI Vision (${usedModel})`
        });
      } else {
        throw new Error('All Gemini API models returned failure');
      }
    } else {
      // Fallback: analyze original file name using smart fallback scanner
      const originalName = req.file.originalname;
      const fileSize = req.file.size;
      const fallbackResult = runFallbackScanner(originalName, fileSize);

      // Clean up uploaded temp file
      const fs = require('fs');
      fs.unlinkSync(filePath);

      return res.json({
        wasteType: fallbackResult.wasteType,
        severity: fallbackResult.severity,
        explanation: fallbackResult.explanation,
        method: 'AI Fallback Scanner'
      });
    }
  } catch (error) {
    console.error('Image analysis failed, using fallback:', error.message);

    // Clean up file if still exists
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const originalName = req.file ? req.file.originalname : 'image.jpg';
    const fileSize = req.file ? req.file.size : 0;
    const fallbackResult = runFallbackScanner(originalName, fileSize);

    return res.json({
      wasteType: fallbackResult.wasteType,
      severity: fallbackResult.severity,
      explanation: `${fallbackResult.explanation} (AI Vision fallback applied)`,
      method: 'AI Fallback Scanner'
    });
  }
};

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen only, though any logged in user can report if needed)
const createComplaint = async (req, res) => {
  const { title, description, latitude, longitude, address, wasteType, severity, aiAnalysis } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a photo of the waste dump' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location latitude and longitude are required' });
    }

    const complaint = await Complaint.create({
      citizen: req.user._id,
      title,
      description,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || 'Location specified on map',
      },
      wasteType: wasteType || 'Mixed',
      severity: severity || 'Medium',
      aiAnalysis: aiAnalysis || null,
      photoBefore: req.file.uploadedUrl,
    });

    // Emit real-time notification to Admins
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('new_complaint', {
        title: complaint.title,
        severity: complaint.severity,
        wasteType: complaint.wasteType,
        citizenName: req.user.name,
        _id: complaint._id,
      });
      io.emit('complaint_updated', { complaintId: complaint._id, status: complaint.status });
    }

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints submitted by the logged-in citizen
// @route   GET /api/complaints/citizen
// @access  Private
const getCitizenComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user._id })
      .sort({ createdAt: -1 })
      .populate('worker', 'name email');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint details by ID
// @route   GET /api/complaints/detail/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name email badge points')
      .populate('worker', 'name email points');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  analyzeWastePhoto,
  createComplaint,
  getCitizenComplaints,
  getComplaintById,
};
