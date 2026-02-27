# Web3 Job App - Quick Start Guide

## Overview

This project consists of two parts:
1. **web3-api/** - NestJS backend API
2. **web3-job-app/** - React Native frontend

## Backend Setup (web3-api)

### 1. Install Dependencies

```bash
cd web3-api
npm install
```

### 2. Setup Database

**Option A: Using Docker (Recommended)**

```bash
# Start PostgreSQL
docker-compose up -d

# Wait for database to be ready (about 10 seconds)
# Then run migrations
npm run prisma:migrate

# Seed the database with test data
npm run prisma:seed
```

**Option B: Using Existing PostgreSQL**

If you have PostgreSQL installed locally, update the `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://your-user:your-password@localhost:5432/web3-job-app"
```

Then run:
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 3. Start the API Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### 4. Verify the API

```bash
# Test health check
curl http://localhost:3000/api

# Get jobs list
curl http://localhost:3000/api/jobs

# Login with test user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@web3jobs.com","password":"password123"}'
```

## Frontend Setup (web3-job-app)

### 1. Install Dependencies

```bash
cd web3-job-app
npm install
```

### 2. Start the Development Server

```bash
npm start
```

Then press `a` to open on Android or `i` for iOS.

## Default Test Accounts

After running the seed command, you can use these accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@web3jobs.com | password123 | admin |
| user@web3jobs.com | password123 | user |

## API Documentation

See [web3-api/README.md](./web3-api/README.md) for full API documentation.

## Common Commands

### Backend

```bash
# Generate Prisma Client
npm run prisma:generate

# Run new migrations
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npm run prisma:migrate reset

# Seed database
npm run prisma:seed

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Build for production
npm run build

# Run production server
npm run start:prod
```

### Frontend

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Troubleshooting

### Database Connection Error

If you see `P1001: Can't reach database server`:

1. Make sure Docker is running
2. Run `docker-compose up -d` in the `web3-api/` directory
3. Check if PostgreSQL is running: `docker ps | grep postgres`

### Port Already in Use

If port 3000 is already in use, either:
1. Stop the process using port 3000
2. Or change the port in `web3-api/src/main.ts`:
   ```typescript
   await app.listen(3001); // Change to different port
   ```
   Then update `API_BASE_URL` in `web3-job-app/lib/api.ts`

### Prisma Client Errors

If you see Prisma client errors:
```bash
npm run prisma:generate
```

## Next Steps

1. Customize the JWT secret in `.env` for production
2. Add more test data as needed
3. Implement additional features per the development plan
4. Set up CI/CD for deployment
