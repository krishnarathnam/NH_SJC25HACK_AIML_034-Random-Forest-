# SortIt Backend

Backend API server for the SortIt learning platform.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Start the production server:
```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check

## Environment Variables

Create a `.env` file in the backend directory:
```
PORT=3001
NODE_ENV=development
```

## Development

The server runs on port 3001 by default. You can change this by setting the PORT environment variable.
