# Easify

A full-stack web application that:

1. Extracts public company website content
2. Uses OpenAI to build a structured company profile
3. Runs overlap analysis between a program and company
4. Generates a customized sponsorship letter
5. Displays token usage and estimated cost

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- AI: OpenAI API
- Website Parsing: Axios + Cheerio

## Project Structure

```txt
sponsorship-letter-generator/
  frontend/
  backend/
  .github/workflows/
  docker-compose.yml
  README.md
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   npm install --workspace backend
   npm install --workspace frontend
   ```
2. Configure environment files:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
3. Set your `OPENAI_API_KEY` in `backend/.env`
4. Start both apps:
   ```bash
   npm run dev
   ```
5. Open frontend at `http://localhost:5173`

## Backend Endpoints

- `GET /api/health`
- `POST /api/sponsorship/analyze`

Example payload:

```json
{
  "programData": {
    "name": "Tech Education Summit 2026",
    "type": "Event",
    "description": "Annual tech event for students and educators.",
    "goals": "Mentorship, networking, and career support.",
    "targetAudience": "Students, educators"
  },
  "websiteUrl": "https://example.com"
}
```

## Build

```bash
npm run build
```

## Deployment Notes

- Frontend: Vercel
- Backend: Railway/Render
- Keep API keys only in environment variables
