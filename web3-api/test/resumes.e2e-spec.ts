import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Resumes (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let adminToken: string;
  let testUserId: string;
  let testAdminId: string;

  const testUser = {
    email: 'resume_test_user@test.com',
    password: 'password123',
    name: 'Resume Test User',
  };

  const testAdmin = {
    email: 'resume_test_admin@test.com',
    password: 'password123',
    name: 'Resume Test Admin',
  };

  const createResumeDto = {
    fullName: 'John Doe',
    title: 'Senior Developer',
    summary: 'Experienced developer with 5+ years of experience',
    email: 'john@example.com',
    phone: '+1234567890',
    location: 'New York, NY',
    website: 'https://johndoe.com',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    githubUrl: 'https://github.com/johndoe',
    skills: ['TypeScript', 'Node.js', 'React'],
    isPublic: false,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // Create test user
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const user = await prisma.user.upsert({
      where: { email: testUser.email },
      update: {},
      create: {
        email: testUser.email,
        passwordHash: hashedPassword,
        name: testUser.name,
        role: 'USER',
      },
    });
    testUserId = user.id;

    // Create test admin
    const adminHashedPassword = await bcrypt.hash(testAdmin.password, 10);
    const admin = await prisma.user.upsert({
      where: { email: testAdmin.email },
      update: {},
      create: {
        email: testAdmin.email,
        passwordHash: adminHashedPassword,
        name: testAdmin.name,
        role: 'ADMIN',
      },
    });
    testAdminId = admin.id;

    // Login to get tokens
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    authToken = loginResponse.body.data.token;

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testAdmin.email, password: testAdmin.password });
    adminToken = adminLoginResponse.body.data.token;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.resume.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.user.delete({ where: { id: testAdminId } });
    await app.close();
  });

  describe('/api/resumes (POST)', () => {
    it('should create a new resume', () => {
      return request(app.getHttpServer())
        .post('/api/resumes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createResumeDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.fullName).toBe(createResumeDto.fullName);
          expect(res.body.data.userId).toBe(testUserId);
        });
    });

    it('should return 403 when user already has a resume', () => {
      return request(app.getHttpServer())
        .post('/api/resumes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createResumeDto)
        .expect(403);
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .post('/api/resumes')
        .send(createResumeDto)
        .expect(401);
    });
  });

  describe('/api/resumes (GET)', () => {
    it('should get my resume', () => {
      return request(app.getHttpServer())
        .get('/api/resumes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.fullName).toBe(createResumeDto.fullName);
        });
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .get('/api/resumes')
        .expect(401);
    });
  });

  describe('/api/resumes (PUT)', () => {
    it('should update my resume', () => {
      const updateData = {
        title: 'Lead Developer',
        skills: ['TypeScript', 'Node.js', 'React', 'Python'],
      };

      return request(app.getHttpServer())
        .put('/api/resumes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.title).toBe(updateData.title);
        });
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .put('/api/resumes')
        .send({ title: 'Updated' })
        .expect(401);
    });
  });

  describe('/api/resumes (DELETE)', () => {
    it('should delete my resume', async () => {
      // First create a new resume for deletion test
      const deleteTestUser = await prisma.user.create({
        data: {
          email: 'delete_test@test.com',
          passwordHash: await bcrypt.hash('password123', 10),
          name: 'Delete Test',
        },
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'delete_test@test.com', password: 'password123' });

      const deleteToken = loginResponse.body.data.token;

      // Create resume
      await request(app.getHttpServer())
        .post('/api/resumes')
        .set('Authorization', `Bearer ${deleteToken}`)
        .send(createResumeDto);

      // Delete resume
      return request(app.getHttpServer())
        .delete('/api/resumes')
        .set('Authorization', `Bearer ${deleteToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });
  });

  describe('/api/resumes/public/:userId (GET)', () => {
    it('should get public resume', async () => {
      // Make resume public first
      await prisma.resume.update({
        where: { userId: testUserId },
        data: { isPublic: true },
      });

      return request(app.getHttpServer())
        .get(`/api/resumes/public/${testUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.isPublic).toBe(true);
        });
    });

    it('should return error for non-public resume', async () => {
      // Make resume private
      await prisma.resume.update({
        where: { userId: testUserId },
        data: { isPublic: false },
      });

      return request(app.getHttpServer())
        .get(`/api/resumes/public/${testUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(false);
        });
    });

    it('should work without authentication', () => {
      return request(app.getHttpServer())
        .get(`/api/resumes/public/${testUserId}`)
        .expect(200);
    });
  });

  describe('/api/resumes/me (GET)', () => {
    it('should get my resume with user info', () => {
      return request(app.getHttpServer())
        .get('/api/resumes/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.id).toBe(testUserId);
        });
    });
  });

  describe('/api/resumes/admin/all (GET)', () => {
    it('should return all resumes for admin', () => {
      return request(app.getHttpServer())
        .get('/api/resumes/admin/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toBeDefined();
          expect(res.body.metadata).toBeDefined();
        });
    });

    it('should reject non-admin user', () => {
      return request(app.getHttpServer())
        .get('/api/resumes/admin/all')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error).toBe('Admin access required');
        });
    });
  });
});
