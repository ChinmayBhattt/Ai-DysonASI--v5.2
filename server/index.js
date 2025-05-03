const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Stability AI API Key from environment variables
const STABILITY_API_KEY = process.env.REACT_APP_STABILITY_API_KEY;

if (!STABILITY_API_KEY) {
  console.warn('Warning: REACT_APP_STABILITY_API_KEY is not set in .env file');
}

// Route to handle text-to-video API calls
app.post('/api/video/generate', async (req, res) => {
  try {
    const { prompt, style, duration, quality } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const response = await axios.post(
      'https://api.stability.ai/v2beta/video/text-to-video',
      {
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        height: 576,
        width: 1024,
        output_format: "mp4",
        generation_quality: quality === "high" ? "HD" : "STANDARD",
        duration_in_seconds: duration || 4,
        seed: Math.floor(Math.random() * 2147483647),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STABILITY_API_KEY}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error generating video:', error.response?.data || error.message);
    
    // Forward the error message from the Stability API if available
    if (error.response?.data) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 