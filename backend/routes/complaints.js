const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');
const { upload, uploadImage } = require('../middleware/upload');

// @desc    Analyze uploaded image for waste classification using Gemini API
// @route   POST /api/complaints/analyze
// @access  Private
router.post('/analyze', protect, upload.single('photo'), async (req, res) => {
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
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      
      const prompt = `Analyze this image and classify it for municipal waste management. 
      Select the most appropriate category and severity.
      Output your response ONLY in raw JSON format matching this schema:
      {
        "wasteType": "Organic" | "Plastic" | "E-waste" | "Hazardous" | "Mixed" | "Medical",
        "severity": "Low" | "Medium" | "High"
      }
      Do not include any markdown wrappers, codeblocks (like \`\`\`json), or additional text. Just output the raw JSON object.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const responseData = await response.json();
      const textResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        throw new Error('Empty response from Gemini API');
      }

      // Parse JSON from text response
      let cleanText = textResponse.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
      }

      const result = JSON.parse(cleanText);

      // Clean up uploaded temp file since we only needed it for analysis
      fs.unlinkSync(filePath);

      return res.json({
        wasteType: result.wasteType || 'Mixed',
        severity: result.severity || 'Medium',
        method: 'Gemini AI Vision'
      });
    } else {
      // Fallback: analyze original file name
      const originalName = req.file.originalname.toLowerCase();
      let detectedType = 'Mixed';
      let detectedSeverity = 'Medium';

      if (originalName.includes('bottle') || originalName.includes('plastic') || originalName.includes('bag') || originalName.includes('pet')) {
        detectedType = 'Plastic';
        detectedSeverity = 'Medium';
      } else if (originalName.includes('food') || originalName.includes('waste') || originalName.includes('rotting') || originalName.includes('organic') || originalName.includes('veg')) {
        detectedType = 'Organic';
        detectedSeverity = 'High';
      } else if (originalName.includes('battery') || originalName.includes('wire') || originalName.includes('phone') || originalName.includes('electronic') || originalName.includes('cable')) {
        detectedType = 'E-waste';
        detectedSeverity = 'Medium';
      } else if (originalName.includes('paint') || originalName.includes('chemical') || originalName.includes('toxic') || originalName.includes('oil')) {
        detectedType = 'Hazardous';
        detectedSeverity = 'High';
      } else if (originalName.includes('medical') || originalName.includes('syringe') || originalName.includes('pill') || originalName.includes('tablet') || originalName.includes('mask') || originalName.includes('hospital') || originalName.includes('medicine') || originalName.includes('needle')) {
        detectedType = 'Medical';
        detectedSeverity = 'High';
      }

      // Clean up uploaded temp file
      const fs = require('fs');
      fs.unlinkSync(filePath);

      return res.json({
        wasteType: detectedType,
        severity: detectedSeverity,
        method: 'Keyword Fallback'
      });
    }
  } catch (error) {
    console.error('Image analysis failed, using fallback:', error.message);
    
    // Clean up file if still exists
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Return fallback defaults to prevent breaking frontend
    return res.json({
      wasteType: 'Mixed',
      severity: 'Medium',
      method: 'Default Fallback'
    });
  }
});

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen only, though any logged in user can report if needed)
router.post('/', protect, upload.single('photo'), uploadImage, async (req, res) => {
  const { title, description, latitude, longitude, address, wasteType, severity } = req.body;

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
      photoBefore: req.file.uploadedUrl,
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get complaints submitted by the logged-in citizen
// @route   GET /api/complaints/citizen
// @access  Private
router.get('/citizen', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user._id })
      .sort({ createdAt: -1 })
      .populate('worker', 'name email');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get complaint details by ID
// @route   GET /api/complaints/detail/:id
// @access  Private
router.get('/detail/:id', protect, async (req, res) => {
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
});

module.exports = router;
