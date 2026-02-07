# Three.js Docker Sample Project

A sample Three.js project with Docker support featuring an animated 3D scene with rotating geometric shapes.

## 🎮 Features

- Rotating cube, torus knot, and sphere
- Responsive design
- Vite for fast development
- Docker support for both development and production

## 📁 Project Structure

```
billbot/
├── src/
│   └── main.js          # Main Three.js scene
├── index.html           # Entry HTML file
├── package.json         # Node.js dependencies
├── vite.config.js       # Vite configuration
├── Dockerfile           # Production Docker image
├── Dockerfile.dev       # Development Docker image
├── docker-compose.yml   # Docker Compose configuration
├── nginx.conf           # Nginx configuration for production
├── .dockerignore        # Docker ignore file
└── .gitignore           # Git ignore file
```

## 🚀 Getting Started

### Without Docker

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

### With Docker (Development)

1. Start the development container with hot reload:
   ```bash
   docker-compose up dev
   ```

2. Open http://localhost:5173 in your browser

### With Docker (Production)

1. Build and start the production container:
   ```bash
   docker-compose up prod --build
   ```

2. Open http://localhost:8080 in your browser

## 🐳 Docker Commands

```bash
# Build development image
docker build -f Dockerfile.dev -t threejs-dev .

# Build production image
docker build -t threejs-prod .

# Run development container
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules threejs-dev

# Run production container
docker run -p 8080:80 threejs-prod
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🛠️ Tech Stack

- [Three.js](https://threejs.org/) - 3D Graphics Library
- [Vite](https://vitejs.dev/) - Frontend Build Tool
- [Docker](https://www.docker.com/) - Containerization
- [Nginx](https://nginx.org/) - Web Server (Production)
