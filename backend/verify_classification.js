require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function testAnalyzeEndpoint() {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  console.log('Using API Key:', geminiApiKey ? geminiApiKey.substring(0, 10) + '...' : 'NONE');

  const testImages = [
    { file: 'photo-1787046036406-995432226.jpeg', expected: 'Plastic' },
    { file: 'photo-1787422597357-344230490.jpg', expected: 'Plastic' }
  ];

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
    'gemini-3.5-flash'
  ];

  for (const item of testImages) {
    const filePath = path.join(__dirname, 'uploads', item.file);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${item.file}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    let apiSuccess = false;
    let result = null;
    let usedModel = '';

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
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
        }
      } catch (e) {
        console.log(`Model ${model} error:`, e.message);
      }
    }

    console.log(`\nResults for ${item.file}:`);
    console.log(`- Success: ${apiSuccess}`);
    console.log(`- Used Model: ${usedModel}`);
    console.log(`- Classified WasteType: ${result?.wasteType}`);
    console.log(`- Severity: ${result?.severity}`);
    console.log(`- Explanation: ${result?.explanation}`);
  }
}

testAnalyzeEndpoint();
