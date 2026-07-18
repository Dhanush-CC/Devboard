const axios = require('axios');

const generateInsight = async (req, res) => {
  try {
    // 1. Ensure the API key is present
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key is missing from .env" });
    }

    // 2. Extract the profile data sent from the React frontend
    const { profileData, languagesData } = req.body;

    if (!profileData) {
      return res.status(400).json({ message: "Profile data is required for analysis" });
    }

    // 3. Format the top languages into a readable string
    const topLanguages = languagesData 
      ? languagesData.slice(0, 3).map(l => l.name).join(', ')
      : 'Unknown';

    // 4. Construct the Prompt
    const prompt = `
      Act as a Senior Engineering Manager evaluating a developer's GitHub profile. 
      Analyze the following data and provide a concise, 3-sentence summary of their technical focus, experience level, and primary ecosystem.

      Name: ${profileData.name || profileData.login}
      Bio: ${profileData.bio || 'No bio provided'}
      Followers: ${profileData.followers}
      Public Repositories: ${profileData.public_repos}
      Top Languages: ${topLanguages}

      Keep the tone professional, insightful, and strictly focused on their engineering profile. Do not use markdown headers.
    `;

    // 5. Call the Gemini REST API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await axios.post(geminiUrl, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    // 6. Extract the text from the response
    const insightText = response.data.candidates[0].content.parts[0].text;

    res.json({ insight: insightText });

  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error generating AI insight' });
  }
};

module.exports = { generateInsight };