# Kentrick AI - SaaS Dashboard

AI-powered document analysis platform built with React, Node.js, and Claude AI.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript, Prisma |
| Database | PostgreSQL |
| Authentication | JWT, bcrypt |
| AI | Anthropic Claude API |
| Storage | AWS S3 (MinIO for local dev) |
| DevOps | Docker, Docker Compose, GitHub Actions |

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Anthropic API key (optional, falls back to mock responses)

## Quick Start

```bash
git clone https://github.com/yourusername/kentrick-ai-saas.git
cd kentrick-ai-saas
cp .env.example .env
make start
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://kentrick:kentrick_secret@postgres:5432/kentrick |
| JWT_SECRET | Secret key for JWT tokens | kentrick-super-secret-jwt-key |
| ANTHROPIC_API_KEY | Anthropic API key for Claude | (optional) |
| AWS_ACCESS_KEY_ID | S3 access key | minioadmin |
| AWS_SECRET_ACCESS_KEY | S3 secret key | minioadmin |
| S3_BUCKET | S3 bucket name | uploads |
| S3_ENDPOINT | S3 endpoint URL | http://minio:9000 |
| VITE_API_URL | Backend API URL for frontend | http://localhost:3000/api |

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Get current user |

### File Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/upload | Yes | Upload file |
| GET | /api/uploads | Yes | List user uploads |
| GET | /api/uploads/:id | Yes | Get upload details |
| DELETE | /api/uploads/:id | Yes | Delete upload |

### AI Insights

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/insights/analyze | Yes | Analyze file with AI |
| GET | /api/insights/:uploadId | Yes | Get insights for upload |
| GET | /api/insights/status | Yes | Get AI service status |

## Development

### Using Make Commands

```bash
make help          # Show all commands
make up-build      # Build and start all services
make logs          # View all logs
make logs-backend  # View backend logs
make shell-backend # Open shell in backend container
make db-studio     # Open Prisma Studio
make lint          # Run linters
make typecheck     # Run TypeScript checks
```

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Local Development (without Docker)

Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
kentrick-ai-saas/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth and error handling
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── __tests__/      # Unit tests
│   └── prisma/             # Database schema
├── frontend/
│   └── src/
│       ├── api/            # API client
│       ├── components/     # React components
│       ├── context/        # Auth context
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Page components
│       └── __tests__/      # Unit tests
├── docs/                   # Documentation
└── .github/workflows/      # CI/CD
```

## Supported File Types

| Category | Types |
|----------|-------|
| Text | TXT, CSV, MD, JSON |
| Images | JPG, PNG, GIF, WEBP |

Maximum file size: 10MB

## AI Analysis Features

### Text Analysis
- Summary generation
- Sentiment analysis (positive/negative/neutral)
- Key insights extraction

### Image Analysis
- Image description
- Object detection
- Theme identification

## Future Improvements

- File preview functionality
- Batch file analysis
- Export to PDF/CSV
- Real-time analysis progress with WebSockets
- User settings and preferences
- Multi-language support
- Rate limiting and usage quotas
- Admin dashboard
