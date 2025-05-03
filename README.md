# DysonASI 5.0

## Overview

DysonASI 5.0 is a web application that provides several AI-powered tools:

1. AI Chat - Chat with an AI assistant
2. Text to Image - Generate images from text prompts
3. Text to Video - Generate videos from text prompts (NEW!)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository

2. Install frontend dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_STABILITY_API_KEY=your_stability_api_key
```

4. Install backend dependencies:
```bash
cd server
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a separate terminal, start the frontend development server:
```bash
npm start
```

3. Open your browser and navigate to http://localhost:3000

Note: You'll need to have both the frontend and backend running simultaneously to use the AI Video Generator feature.

## Features

### AI Chat
- Chat with an AI assistant powered by Google's Gemini API
- Get human-like responses to your questions

### Text to Image
- Generate images from text prompts
- Choose different styles and quality options
- Download and share generated images

### Text to Video (NEW!)
- Generate short videos from text prompts
- Choose different styles, durations, and quality options
- Download and share generated videos

## API Keys

This application requires the following API keys:

1. **Gemini API Key** - For the AI Chat feature
   - Get your key from [Google AI Studio](https://ai.google.dev/)

2. **Stability AI API Key** - For the Text to Video feature
   - Get your key from [Stability AI Platform](https://platform.stability.ai/account/keys)

## Troubleshooting

- If you encounter CORS issues when making API requests, make sure the backend server is running
- If the Text to Video feature doesn't work, check that your Stability AI API key is valid and has sufficient credits

