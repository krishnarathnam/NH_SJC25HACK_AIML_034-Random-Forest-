# SortIt
(Local LLM and NLP microservice pipeline)

An interactive, gamified learning platform that teaches sorting algorithms with an AI tutor, visualizations, adaptive milestones, XP/levels, and a global leaderboard. SortIt blends hands-on learning (visualizers, puzzles) with an AI tutor that adapts to your progress, detects frustration, and supports bilingual learning (English/Kannada).

## Highlights
- **AI Tutor ("Sorty")**: Short, focused guidance that adapts to your level and recent answers
- **Emotion-aware coaching**: Incorporates emotion signals (e.g., frustration) to adjust tone and pacing
- **Bilingual learning**: Responses and history are stored in English and Kannada to support both languages
- **Adaptive milestones**: Structured learning path per algorithm with progress tracking and XP rewards
- **XP, Levels, Leaderboard**: Earn XP each turn and for milestones/puzzles; compete globally
- **Visualizers**: Step-by-step visualizations for popular sorting algorithms
- **Puzzle Mode**: Implement code solutions and get instant AI feedback and XP
- **Authentication**: JWT-based auth with refresh tokens (httpOnly cookies)

## Architecture
- **Frontend**: React + Vite app with protected routes, learning flows, visualizers, puzzle mode, and leaderboard UI
- **Backend**: Node.js + Express + MongoDB providing auth, chat tutoring, milestones, emotion proxy, puzzle evaluation, and XP/leaderboard
- **Models**: `User`, `Session` (chat, XP, adaptive stats), `Progress` (milestones, puzzles)
- **LLM Integration**: Talks to a local LLM endpoint (default Ollama at `http://localhost:11434/api/generate`)
- **Emotion Service**: Proxies to `EMOTION_URL` (default `http://localhost:8000`) for text+timing-based emotion inference

## Tech Stack
- **Frontend**: React, Vite, React Router
- **Backend**: Node.js, Express, Mongoose (MongoDB)
- **Auth**: JWT access tokens (Authorization: Bearer), refresh via httpOnly cookie
- **LLM**: Configured for local Ollama by default; 

## Directory Structure
```
/ (project root)
  backend/           # Express API server
  frontend/          # React + Vite client app
```
Key backend files:
- `backend/server.js` — API entrypoint and routes registration
- `backend/routes/auth.js` — signup/login/refresh/me/logout
- `backend/middleware/requireAuth.js` — access token guard
- `backend/models/{User.js,sessions.js,progress.js}` — core data models
- `backend/utils/{jwt.js,evaluator.js,scoring.js}` — auth + adaptive scoring helpers
- `backend/milestones.js` and `backend/mileStoneEngine.js` — milestone definitions/logic

Key frontend files:
- `frontend/src/App.jsx` — routes and protected layout
- `frontend/src/pages/{Login.jsx,Signup.jsx}` — auth pages
- `frontend/src/LearningPage.jsx` — core learning experience
- `frontend/src/components/*Visualizer.jsx` — algorithm visualizers
- `frontend/src/components/PuzzleMode.jsx` — code puzzles with AI checking
- `frontend/src/utils/auth.js` — token handling + refresh

## Features in Detail
- **Tutor chat**: POST `/api/chat` stores bilingual messages, evaluates answers, updates adaptive score, awards per-turn XP, and advances milestones when ready
- **Milestones**: Each algorithm has ordered milestones with minimum “quality turns” before completion; milestone XP awarded on completion
- **XP/Leveling**: Level curve increases XP required per level; endpoints expose total/user session XP and levels
- **Leaderboard**: Aggregates XP across sessions per user and returns top users with computed levels
- **Puzzle Mode**: Submits user code and expected solution to LLM for functional comparison; awards XP and tracks completed puzzles
- **Emotion-aware**: `/api/emotion/predict` proxies to `EMOTION_URL` with student text + response latency to infer emotion and adapt tutor tone
- **Bilingual**: Background translation ensures both English and Kannada content are available for stored messages and retrieval

## Getting Started
### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or hosted)
- Optional: Ollama running locally with a model like `llama3.1:8b` for tutoring and evaluations
- Optional: An emotion service at `EMOTION_URL` (see Environment)

### 1) Backend Setup
```bash
cd backend
npm install
```
Create `.env` in `backend/`:
```
PORT=3001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/sortit
ACCESS_TOKEN_SECRET=replace-me
REFRESH_TOKEN_SECRET=replace-me
EMOTION_URL=http://localhost:8000
# LLM endpoint defaults are in code, e.g., http://localhost:11434/api/generate
```
Run the server:
```bash
npm run dev    # or: npm start
```
The API will be on `http://localhost:3001`.

### 2) Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The app will start (default Vite) on `http://localhost:5173` and call the backend at `http://localhost:3001`.

## Key API Endpoints (Backend)
- `GET /` — Welcome
- `GET /api/health` — Health probe
- `POST /api/auth/signup` — create account; returns access token and user
- `POST /api/auth/login` — authenticate; returns access token and user
- `POST /api/auth/refresh` — refresh access token (reads httpOnly cookie)
- `POST /api/auth/logout` — clears refresh cookie
- `GET /api/auth/me` — current user (requires Authorization)
- `GET /api/session/:contextId` — returns session XP/level (requires Authorization)
- `GET /api/user/total-xp` — returns aggregated XP and level (requires Authorization)
- `GET /api/history/:contextId` — returns bilingual message history (requires Authorization)
- `POST /api/chat` — core tutoring endpoint; updates XP/milestones and returns response + progress (requires Authorization)
- `GET /api/progress/:algorithm` — milestone progress (requires Authorization)
- `GET /api/leaderboard` — top users by XP
- `POST /api/generate-hint` — short coaching hint (requires Authorization)
- `GET /api/user/sessions` — list sessions for user (requires Authorization)
- `GET /api/puzzle/completed/:algorithm` — completed puzzles (requires Authorization)
- `POST /api/puzzle/check` — LLM evaluation of user code vs expected (requires Authorization)
- `POST /api/emotion/predict` — emotion inference proxy (no auth)

## Data Models (Simplified)
- `User` — email, password (hashed), name, tokenVersion
- `Session` — userId, contextId, algorithm, messages[role, content, en/kn], adaptive score/level/stats, xp/xpLevel
- `Progress` — algorithm milestones (status/xp), qualityTurns, puzzles completed, total milestone XP


