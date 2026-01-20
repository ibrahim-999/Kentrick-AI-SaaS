import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface UploadResponse {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: Date;
}

export interface InsightResponse {
  id: string;
  uploadId: string;
  type: string;
  content: InsightContent;
  createdAt: Date;
}

export interface InsightContent {
  summary?: string;
  sentiment?: {
    label: string;
    score: number;
    explanation: string;
  };
  keyInsights?: string[];
  imageDescription?: string;
  objects?: string[];
  themes?: string[];
}

export interface AnalysisRequest {
  uploadId: string;
  analysisTypes?: ('summary' | 'sentiment' | 'key_insights' | 'image_description')[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}
