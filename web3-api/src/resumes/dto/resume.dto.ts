import { IsString, IsOptional, IsArray, IsBoolean, IsEmail, IsUrl } from 'class-validator';

/**
 * Experience input type
 */
export class ExperienceInput {
  @IsString()
  company: string;

  @IsString()
  position: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * Education input type
 */
export class EducationInput {
  @IsString()
  school: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  gpa?: string;
}

/**
 * Project input type
 */
export class ProjectInput {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

/**
 * Certification input type
 */
export class CertificationInput {
  @IsString()
  name: string;

  @IsString()
  issuer: string;

  @IsOptional()
  @IsString()
  issueDate?: string;

  @IsOptional()
  @IsString()
  expireDate?: string;

  @IsOptional()
  @IsString()
  credentialId?: string;
}

/**
 * Language input type
 */
export class LanguageInput {
  @IsString()
  language: string;

  @IsString()
  proficiency: string;
}

/**
 * DTO for creating a new resume
 */
export class CreateResumeDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsArray()
  experiences?: ExperienceInput[];

  @IsOptional()
  @IsArray()
  education?: EducationInput[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  projects?: ProjectInput[];

  @IsOptional()
  @IsArray()
  certifications?: CertificationInput[];

  @IsOptional()
  @IsArray()
  languages?: LanguageInput[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

/**
 * DTO for updating an existing resume
 */
export class UpdateResumeDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsArray()
  experiences?: ExperienceInput[];

  @IsOptional()
  @IsArray()
  education?: EducationInput[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  projects?: ProjectInput[];

  @IsOptional()
  @IsArray()
  certifications?: CertificationInput[];

  @IsOptional()
  @IsArray()
  languages?: LanguageInput[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

/**
 * Full resume response type
 */
export class ResumeResponse {
  id: string;
  userId: string;
  fullName: string;
  title?: string;
  summary?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  experiences?: any[];
  education?: any[];
  skills: string[];
  projects?: any[];
  certifications?: any[];
  languages?: any[];
  isPublic: boolean;
  lastViewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
