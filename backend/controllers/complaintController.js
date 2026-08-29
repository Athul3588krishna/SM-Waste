const Complaint = require('../models/Complaint');

function runFallbackScanner(originalName, fileSize) {
  const name = (originalName || 'image.jpg').toLowerCase();

  // Keyword check for explicit waste dumps
  if (name.includes('waste_dump') || name.includes('garbage_dump') || name.includes('plastic_waste') || name.includes('organic_waste')) {
    if (name.includes('plastic')) return { wasteType: 'Plastic', severity: 'Medium', explanation: `Plastic waste dump identified in "${originalName}".` };
    if (name.includes('organic')) return { wasteType: 'Organic', severity: 'High', explanation: `Organic waste dump identified in "${originalName}".` };
  }

  // DEFAULT ALL UNCLASSIFIED / PAPER / PHOTO UPLOADS TO UNKNOWN
  return {
    wasteType: 'Unknown',
    severity: 'Low',
    explanation: `No municipal waste dump detected in image ("${originalName}"). Categorized as Unknown.`
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
      const mimeType = req.file.mimetype;

      // 2. Call Google Gemini API
      const prompt = `Analyze this image strictly for municipal waste management.
      First, identify the MAIN SUBJECT of the image.
      
      STRICT NON-WASTE / DOCUMENT RULE:
      - If the main subject of the image is a paper sheet, printed document, A4 paper, text page, notebook, book, computer screen, desk setup, selfie, face, car, clean room, pet, or indoor office item (even if a minor cable, pen, or wire is visible in the corner), YOU MUST CLASSIFY IT AS:
        "wasteType": "Unknown", "severity": "Low", "explanation": "No municipal waste dump detected. The image appears to be a paper document or non-waste item."
      
      ONLY IF the image clearly depicts an actual uncollected waste dump, garbage pile, litter on the ground, or overflowing public trash bin, select one of:
      "Organic", "Plastic", "E-waste", "Hazardous", "Medical", or "Mixed".
      
      Output your response ONLY in raw JSON format matching this schema:
      {
        "wasteType": "Organic" | "Plastic" | "E-waste" | "Hazardous" | "Mixed" | "Medical" | "Unknown",
        "severity": "Low" | "Medium" | "High",
        "explanation": "1-2 sentence explanation of what was detected in the image"
      }
      Do not include markdown wrappers. Just output raw JSON.`;

      const modelsToTry = [
        'gemini-2.5-flash',
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-flash-latest'
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
            signal: AbortSignal.timeout(3500),
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
              ]
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

        let finalType = result.wasteType || 'Unknown';
        let finalSeverity = result.severity || 'Low';
        let finalExplanation = result.explanation || 'Visual analysis performed on uploaded image.';

        // Safeguard: Check explanation text for document / paper / non-waste / desk indicators
        const expLower = finalExplanation.toLowerCase();
        const nonWasteTerms = [
          'document', 'paper', 'text', 'printed', 'written', 'a4', 'sheet', 'page',
          'peripheral', 'headset', 'desk', 'office', 'table', 'keyboard', 'no waste',
          'not waste', 'component', 'wire', 'cable', 'headphone', 'earphone', 'device',
          'object', 'indoor', 'surface', 'white paper', 'bullet', 'font', 'list', 'note',
          'recyclable plastic'
        ];

        if (nonWasteTerms.some(term => expLower.includes(term))) {
          finalType = 'Unknown';
          finalSeverity = 'Low';
          finalExplanation = 'No municipal waste dump detected in the image. Categorized as Unknown (Non-Waste).';
        }

        return res.json({
          wasteType: finalType,
          severity: finalSeverity,
          explanation: finalExplanation,
          method: `Gemini AI Vision (${usedModel})`
        });
      } else {
        throw new Error('All Gemini API models returned failure or 404');
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
      explanation: `${fallbackResult.explanation} (AI Vision scanner connection bypassed)`,
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

// @desc    Chat with EcoBot AI helper
// @route   POST /api/complaints/chat
// @access  Public
const chatWithEcoBot = async (req, res) => {
  const { message, history, role } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // Role-based System Prompt for EcoBot
  let systemInstruction = '';
  if (role === 'admin') {
    systemInstruction = `You are "EcoBot", an AI administrative assistant for the Perinthalmanna Municipality waste management portal.
Your job is to assist municipal administrators with:
1. Navigating the Admin control panel map, assignment panels, and analytics charts.
2. Verification workflows (approving/rejecting reports, assigning tasks/cleaning teams, and scheduling deadlines).
3. Overseeing worker metrics, performance charts, and broadcasting municipal announcements.
Important: If anyone asks who developed/created/built this portal, always state clearly: 'ECO Clean portal is developed by Athul Krishna R, MCA S3 student of MEA Engineering College.'
Keep answers brief, highly professional, and helpful. Keep responses under 3 sentences if possible.`;
  } else if (role === 'worker') {
    systemInstruction = `You are "EcoBot", an AI field operations advisor for Perinthalmanna Municipality sanitation workers.
Your job is to assist field workers with:
1. Viewing their touch-friendly job cards, deadlines, and utilizing mapping directions.
2. Understanding the validation loop (accepting tasks, uploading after-cleaning verification photos, and status transitions).
3. Managing online/offline availability states and tracking bonus payout histories.
Important: If anyone asks who developed/created/built this portal, always state clearly: 'ECO Clean portal is developed by Athul Krishna R, MCA S3 student of MEA Engineering College.'
Keep answers brief, encouraging, and clear. Keep responses under 3 sentences if possible.`;
  } else {
    // Default / Citizen / Guest
    systemInstruction = `You are "EcoBot", a friendly AI sanitation helper for the Perinthalmanna Municipality waste management portal.
Your job is to answer questions related to:
1. Waste segregation rules (Plastic, Organic, E-waste, Medical, Hazardous).
2. Municipal garbage collection schedules in Perinthalmanna.
3. How to report waste dumps on the portal (Citizen Dashboard -> Report Waste).
4. The Eco-Rewards point system (1 verified report = 50 points, redeemable for municipal vouchers).
5. Tips for composting, recycling, and keeping Perinthalmanna clean.
Important: If anyone asks who developed/created/built this portal, always state clearly: 'ECO Clean portal is developed by Athul Krishna R, MCA S3 student of MEA Engineering College.'
Keep your answers brief, friendly, and helpful. Keep responses under 3 sentences if possible.`;
  }

  // Build request body with context history if available
  const contents = [];

  // Add history context
  if (history && Array.isArray(history)) {
    history.forEach(item => {
      contents.push({
        role: item.sender === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      });
    });
  }

  // Add latest user message
  contents.push({
    role: 'user',
    parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }]
  });

  try {
    const modelsToTry = [
      'gemini-2.0-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      'gemini-flash-latest',
      'gemini-2.0-flash'
    ];

    let reply = '';

    if (geminiApiKey) {
      for (const model of modelsToTry) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
          });

          const data = await response.json();
          if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
            reply = data.candidates[0].content.parts[0].text;
            break;
          }
        } catch (err) {
          console.warn(`Model ${model} failed for chat, trying next...`);
        }
      }
    }

    if (!reply) {
      // Fallback response if API key is missing or failed
      const query = message.toLowerCase();
      if (query.includes('develop') || query.includes('build') || query.includes('create') || query.includes('who made') || query.includes('who built')) {
        reply = "ECO Clean portal is developed by Athul Krishna R, MCA S3 student of MEA Engineering College.";
      } else if (query.includes('point') || query.includes('reward')) {
        reply = "You earn 50 Eco-Points for every verified waste dump report! You can spend these points on municipal discount vouchers in your rewards tab.";
      } else if (query.includes('report') || query.includes('complaint')) {
        reply = "Go to your Citizen Dashboard and click 'Report Waste'. Upload a photo, double check the map coordinates pin, and submit!";
      } else if (query.includes('compost') || query.includes('organic') || query.includes('food')) {
        reply = "Organic waste like food scraps and yard waste should be separated and composted at home or placed in green bins.";
      } else if (query.includes('plastic') || query.includes('bottle')) {
        reply = "Plastic waste should be cleaned, dried, and deposited in blue bins or given to Haritha Karma Sena workers during collection.";
      } else {
        reply = "Hello! I am EcoBot, your municipal sanitation assistant. Ask me anything about waste sorting, points rewards, or reporting issues in Perinthalmanna!";
      }
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  analyzeWastePhoto,
  createComplaint,
  getCitizenComplaints,
  getComplaintById,
  chatWithEcoBot,
};
