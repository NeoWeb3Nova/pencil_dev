# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo with two applications:
- **web3-api/** - NestJS 11 backend API with Prisma ORM
- **web3-job-app/** - React Native (Expo) frontend with NativeWind/Tailwind

## Commands

### Backend (web3-api)

```bash
cd web3-api

# Development
npm run start:dev        # Start dev server on port 3000
npm run start:debug      # Start with debug mode
npm run build            # Build for production

# Database
docker-compose up -d     # Start PostgreSQL container
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed test data
npm run prisma:studio    # Open Prisma Studio GUI

# Testing
npm run test             # Run unit tests
npm run test:cov         # Run with coverage
npm run test:e2e         # Run E2E tests

# Code quality
npm run format           # Format with Prettier
npm run lint             # Lint with ESLint
```

### Frontend (web3-job-app)

```bash
cd web3-job-app

npm start                # Start Expo dev server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run on web
```

## Architecture

### Backend Structure (web3-api/src)

NestJS modular architecture with domain-based modules:

```
src/
├── app.module.ts        # Root module
├── main.ts              # Entry point
├── auth/                # JWT authentication, Passport, SIWE
├── users/               # User management
├── jobs/                # Job postings
├── applications/        # Job applications
├── messages/            # Messaging system
├── wallet-profiles/     # Web3 wallet profiles
├── web3/                # Blockchain integration (ethers.js)
└── database/            # Prisma service
```

**Key patterns:**
- Module-based organization with Controller/Service/DTO structure
- Prisma repository pattern for data access
- JWT guards with role-based authorization
- class-validator for DTO validation

### Frontend Structure (web3-job-app)

Expo Router with file-based routing:

```
app/
├── (tabs)/              # Tab navigation
│   ├── index.tsx        # Home
│   ├── jobs.tsx         # Job listings
│   ├── post.tsx         # Post job form
│   ├── messages.tsx     # Messages
│   └── profile.tsx      # User profile
├── job/[id].tsx         # Job detail route
└── _layout.tsx          # Root layout

components/
├── ui/                  # Reusable UI (Button, Card, Input, Badge)
├── job/                 # Job-specific components
├── home/                # Home screen components
├── messages/            # Message components
├── profile/             # Profile components
└── post/                # Post job components

lib/
├── api.ts               # API client
├── utils.ts             # Utilities
└── constants.ts         # App constants
```

**Key patterns:**
- NativeWind for Tailwind styling
- Zustand for state management
- React Query for data fetching
- Expo Router for navigation

## Database Schema

Core entities in Prisma (`web3-api/prisma/schema.prisma`):

- **User** - Auth with email/password or wallet address
- **WalletProfile** - Web3 wallet connections
- **Job** - Job postings with crypto payment options
- **Application** - Job applications with on-chain proof
- **Message** - User messaging

## API Endpoints

Base URL: `http://localhost:3000/api`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | - | Register user |
| `/auth/login` | POST | - | Login |
| `/auth/profile` | GET/POST | Yes | User profile |
| `/jobs` | GET/POST | -/Yes | List/Create jobs |
| `/jobs/:id` | GET/PUT/DELETE | -/Yes | Job CRUD |
| `/applications` | POST | Yes | Apply for job |
| `/messages` | GET/POST | Yes | Messaging |

Default test accounts (after seeding):
- `admin@web3jobs.com` / `password123` (admin)
- `user@web3jobs.com` / `password123` (user)

## Environment Setup

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/web3-job-app?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRATION="7d"
```

### Frontend
Update `lib/api.ts` if backend URL changes from default `http://localhost:3000`.

---

## Common Errors & Solutions (常见错误与解决方案)

### 1. Frontend Network Error ("Network error")

**Problem**: App cannot connect to backend API

**Cause**: Android emulator's `localhost` points to the emulator itself, not the host machine

**Solution** - Already fixed in `lib/api.ts`:
```typescript
const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';  // Android emulator
  }
  return 'http://localhost:3000/api';   // iOS/Web
};
```

**Verify backend is running**:
```bash
netstat -ano | findstr ":3000"
curl http://localhost:3000/api/auth/login
```

### 2. React Hooks "Cannot access before initialization"

**Problem**: `ReferenceError: Cannot access 'formatDate' before initialization`

**Cause**: `const` arrow functions are not hoisted. Helper functions used in hooks callbacks must be defined BEFORE the hooks.

**Wrong pattern**:
```typescript
// ❌ WRONG
const { data } = useQuery({ select: (d) => formatDate(d.date) });
const formatDate = () => { ... };
```

**Correct pattern**:
```typescript
// ✅ CORRECT
const formatDate = () => { ... };  // Define first
const { data } = useQuery({ select: (d) => formatDate(d.date) });
```

**Rule**: All helper functions used in hooks callbacks MUST be defined before the hooks.

### 3. Prisma Database Connection Failed

**Problem**: `PrismaClientInitializationError`

**Solution**:
```bash
cd web3-api
docker-compose up -d          # Start database
npm run prisma:generate       # Generate Prisma Client
npm run prisma:migrate        # Run migrations
```

---

## Quick Start Commands

```bash
# 1. Start database
cd web3-api && docker-compose up -d

# 2. Start backend (new terminal)
cd web3-api && npm run start:dev

# 3. Start frontend (new terminal)
cd web3-job-app && npm start
```
