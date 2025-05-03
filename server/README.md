# DysonASI AI Video Generator Server

This is a simple Express server that handles API requests to the Stability AI API for the DysonASI AI Video Generator.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file in the root directory with your Stability AI API key:
```
REACT_APP_STABILITY_API_KEY=your_stability_ai_api_key
```

3. Start the server:
```bash
npm run dev
```

The server will run on port 5000 by default.

## API Endpoints

### POST /api/video/generate

Generates a video based on the provided text prompt.

#### Request Body

```json
{
  "prompt": "Your text prompt",
  "style": "default|cinematic|3d-animation|anime",
  "duration": 2,
  "quality": "standard|high"
}
```

#### Response

```json
{
  "video_url": "https://example.com/video.mp4"
}
```

## Frontend Integration

The frontend React application will make requests to this server to generate videos. Make sure the server is running before using the AI Video Generator feature in the frontend application. 