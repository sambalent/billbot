# Bi11bot - Interactive 3D Fountain Garden

An immersive 3D environment built with Three.js where users can explore a fountain garden and interact with bi11bot, an AI-powered character using the Grok API.

## Overview

Bi11bot is an interactive experience that combines first-person 3D exploration with conversational AI. Users navigate through a detailed garden environment featuring a central fountain, stone walls, trees, and flower beds. The main attraction is bi11bot, a friendly character who responds to user messages using the xAI Grok API.

## Features

### 3D Environment
- First-person exploration with WASD movement controls
- Central multi-tiered fountain with animated water particles
- Inner and outer stone ring walls with gates and towers
- Decorative elements including trees, benches, flower beds, and lamp posts
- Dynamic sky with drifting clouds
- Realistic lighting with shadows

### AI Character - bi11bot
- 3D character model positioned near the fountain
- Always faces the player as they move around
- Speech bubble display above the character
- Click-to-chat interaction system
- Powered by the xAI Grok API for conversational responses

### Controls
- W/A/S/D - Movement
- Mouse - Look around
- Space - Jump
- Shift - Run
- ESC - Release mouse control
- Click on bi11bot - Open chat interface

## Project Structure

```
billbot/
├── src/
│   └── main.js              # Main Three.js application
├── index.html               # Entry HTML with chat UI styles
├── package.json             # Node.js dependencies
├── vite.config.js           # Vite configuration with env handling
├── .env                     # API keys (not committed)
├── Dockerfile               # Production Docker image
├── Dockerfile.dev           # Development Docker image
├── docker-compose.yml       # Docker Compose configuration
└── nginx.conf               # Nginx configuration for production
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- An xAI API key for Grok

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sambalent/billbot.git
   cd billbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   VITE_XAI_API_KEY=your_xai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

### Docker Deployment

Development with hot reload:
```bash
docker-compose up dev
```

Production build:
```bash
docker-compose up prod --build
```

## API Configuration

The application uses the xAI Grok API for bi11bot's responses. The API is called directly from the frontend using the endpoint `https://api.x.ai/v1/chat/completions` with the `grok-3-latest` model.

If the API is unavailable, the application falls back to predefined responses.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- Three.js - 3D graphics rendering
- Vite - Frontend build tool and development server
- xAI Grok API - Conversational AI
- Docker - Containerization
- Nginx - Production web server

## License

MIT
