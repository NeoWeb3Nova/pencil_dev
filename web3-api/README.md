# Web3 Job App API

NestJS backend API for the Web3 Job Application platform.

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL 15
- **ORM**: Prisma 7
- **Authentication**: JWT with Passport
- **Validation**: class-validator, class-transformer

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or Docker for local development)
- npm or yarn

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Start PostgreSQL (using Docker)**

```bash
docker-compose up -d
```

3. **Configure environment variables**

The `.env` file contains the database connection string and JWT configuration:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/web3-job-app?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRATION="7d"
```

4. **Generate Prisma Client**

```bash
npm run prisma:generate
```

5. **Run database migrations**

> Note: Make sure PostgreSQL is running before running migrations

```bash
npm run prisma:migrate
```

6. **Seed the database (optional)**

```bash
npm run prisma:seed
```

7. **Start the development server**

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| POST | `/api/auth/profile` | Update user profile | Yes |

### Jobs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/jobs` | List all jobs | No |
| GET | `/api/jobs/:id` | Get job details | No |
| POST | `/api/jobs` | Create new job | Yes |
| PUT | `/api/jobs/:id` | Update job | Yes (owner only) |
| DELETE | `/api/jobs/:id` | Delete job | Yes (owner only) |
| GET | `/api/jobs/user/me` | Get user's posted jobs | Yes |

**Query Parameters for GET /api/jobs:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search keyword
- `type` - Filter by job type (FULL_TIME, CONTRACT, PART_TIME)
- `status` - Filter by status (draft, published, closed)

### Applications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/applications` | Apply for a job | Yes |
| GET | `/api/applications/my-applications` | Get user's applications | Yes |
| GET | `/api/applications/:id` | Get application details | Yes |
| GET | `/api/applications/job/:jobId` | Get all applications for a job | Yes (owner only) |
| POST | `/api/applications/:id/status` | Update application status | Yes (job owner only) |

### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/messages` | Get user's messages | Yes |
| GET | `/api/messages/unread-count` | Get unread message count | Yes |
| GET | `/api/messages/:id` | Get message details | Yes |
| POST | `/api/messages` | Send a message | Yes |
| POST | `/api/messages/:id/read` | Mark message as read | Yes |

## Default Users (after seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@web3jobs.com | password123 | admin |
| user@web3jobs.com | password123 | user |

## Development Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Start development server
npm run start:dev

# Build for production
npm run build

# Run production server
npm run start:prod

# Run tests
npm run test
npm run test:e2e
```

## Database Schema

```
users
├── id (UUID, PK)
├── email (unique)
├── password_hash
├── name
├── role (user | admin)
└── created_at, updated_at

jobs
├── id (UUID, PK)
├── title
├── company
├── location
├── salary_min, salary_max
├── description
├── requirements (TEXT[])
├── skills (TEXT[])
├── type (FULL_TIME | CONTRACT | PART_TIME)
├── status (draft | published | closed)
├── posted_by (FK → users)
└── created_at, updated_at

messages
├── id (UUID, PK)
├── job_id (FK → jobs)
├── sender_id (FK → users)
├── receiver_id (FK → users)
├── content
├── is_read
└── created_at

applications
├── id (UUID, PK)
├── job_id (FK → jobs)
├── user_id (FK → users)
├── status (pending | reviewed | accepted | rejected)
├── resume_url
├── cover_letter
└── created_at, updated_at
```

## Security Notes

- Change the `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting for production
- Rotate secrets regularly
