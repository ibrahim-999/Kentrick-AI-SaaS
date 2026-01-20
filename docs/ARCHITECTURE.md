# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                     │
│                     http://localhost:5173                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  LoginPage  │  │ DashboardPage│  │     Components          │ │
│  └─────────────┘  └─────────────┘  │  - Login                │ │
│                                     │  - FileUpload           │ │
│  ┌─────────────────────────────┐   │  - InsightsDisplay      │ │
│  │     AuthContext (JWT)       │   └─────────────────────────┘ │
│  └─────────────────────────────┘                                │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express + Node.js)                  │
│                     http://localhost:3000                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      Middleware                          │   │
│  │  ┌──────────────┐  ┌──────────────┐                     │   │
│  │  │     Auth     │  │ ErrorHandler │                     │   │
│  │  └──────────────┘  └──────────────┘                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                       Routes                             │   │
│  │  /api/auth/*    /api/upload/*    /api/insights/*        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      Services                            │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │   │
│  │  │ AuthService│  │StorageServ │  │    AIService       │ │   │
│  │  │  (bcrypt)  │  │   (S3)     │  │ (Anthropic Claude) │ │   │
│  │  └────────────┘  └────────────┘  └────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────┬─────────────────────┬─────────────────────┬─────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────────┐
│  PostgreSQL   │    │     MinIO     │    │  Anthropic API    │
│   Database    │    │  (S3 Storage) │    │  (Claude AI)      │
│  :5432        │    │  :9000/:9001  │    │  External         │
└───────────────┘    └───────────────┘    └───────────────────┘
```

## Data Flow

### Authentication Flow

```
1. User submits login/register form
2. Frontend sends POST /api/auth/login or /register
3. Backend validates credentials
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Subsequent requests include Bearer token
7. Auth middleware validates token on protected routes
```

### File Upload Flow

```
1. User drops file on FileUpload component
2. Frontend validates file type and size
3. Frontend sends POST /api/upload with multipart form data
4. Backend validates file
5. Backend uploads to S3/MinIO
6. Backend creates Upload record in PostgreSQL
7. Frontend receives upload details
```

### AI Analysis Flow

```
1. User clicks "Analyze with AI" button
2. Frontend sends POST /api/insights/analyze
3. Backend fetches file from S3
4. Backend sends content to Anthropic Claude API
5. Claude returns analysis (summary, sentiment, insights)
6. Backend stores insights in PostgreSQL
7. Frontend displays results
```

## Database Schema

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      User        │       │      Upload      │       │     Insight      │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id: UUID (PK)    │──┐    │ id: UUID (PK)    │──┐    │ id: UUID (PK)    │
│ email: String    │  │    │ userId: UUID (FK)│◄─┘    │ uploadId: UUID   │◄─┘
│ password: String │  │    │ filename: String │       │ type: String     │
│ name: String?    │  └───►│ fileType: String │       │ content: JSON    │
│ createdAt: Date  │       │ fileSize: Int    │       │ createdAt: Date  │
│ updatedAt: Date  │       │ fileUrl: String  │       └──────────────────┘
└──────────────────┘       │ createdAt: Date  │
                           │ updatedAt: Date  │
                           └──────────────────┘
```

## Component Architecture

### Frontend Components

```
App
├── AuthProvider (Context)
│   ├── LoginPage
│   │   └── Login (Form)
│   └── DashboardPage
│       ├── FileUpload (Dropzone)
│       ├── FileList
│       └── InsightsDisplay
```

### Backend Layers

```
Routes (Express Router)
    │
    ▼
Controllers (Request/Response handling)
    │
    ▼
Services (Business logic)
    │
    ▼
Data Layer (Prisma ORM / S3 Client / Anthropic SDK)
```

## Security Measures

| Layer | Security Measure |
|-------|------------------|
| Authentication | JWT tokens with expiration |
| Password | bcrypt hashing (12 rounds) |
| API | CORS configuration |
| File Upload | Type and size validation |
| Database | Parameterized queries (Prisma) |
| Secrets | Environment variables |

## Scalability Considerations

### Horizontal Scaling

- Stateless backend allows multiple instances
- JWT tokens eliminate server-side sessions
- S3/MinIO provides scalable file storage
- PostgreSQL supports read replicas

### Performance Optimizations

- Database indexes on userId and uploadId
- Lazy loading of insights
- File size limits (10MB)
- Connection pooling (Prisma)

### Future Scaling Options

- Redis for caching and rate limiting
- Message queue for async AI processing
- CDN for static assets
- Database sharding for large datasets
