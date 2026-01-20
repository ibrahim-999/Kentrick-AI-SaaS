import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { storageService } from '../services/storage.service.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthenticatedRequest, ApiResponse, UploadResponse } from '../types/index.js';

const prisma = new PrismaClient();

export const uploadFile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response<ApiResponse<UploadResponse>>) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const allowedMimeTypes = [
      'text/plain',
      'text/csv',
      'text/markdown',
      'application/json',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      throw new AppError('File type not allowed', 400);
    }

    const maxSize = 10 * 1024 * 1024;
    if (req.file.size > maxSize) {
      throw new AppError('File too large. Maximum size is 10MB', 400);
    }

    const { url } = await storageService.uploadFile(req.file, req.user.userId);

    const upload = await prisma.upload.create({
      data: {
        userId: req.user.userId,
        filename: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        fileUrl: url,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: upload.id,
        filename: upload.filename,
        fileType: upload.fileType,
        fileSize: upload.fileSize,
        fileUrl: upload.fileUrl,
        createdAt: upload.createdAt,
      },
      message: 'File uploaded successfully',
    });
  }
);

export const listUploads = asyncHandler(
  async (req: AuthenticatedRequest, res: Response<ApiResponse<UploadResponse[]>>) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const uploads = await prisma.upload.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        insights: {
          select: { id: true, type: true, createdAt: true },
        },
      },
    });

    res.json({
      success: true,
      data: uploads.map((u) => ({
        id: u.id,
        filename: u.filename,
        fileType: u.fileType,
        fileSize: u.fileSize,
        fileUrl: u.fileUrl,
        createdAt: u.createdAt,
        hasInsights: u.insights.length > 0,
      })),
    });
  }
);

export const getUpload = asyncHandler(
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const upload = await prisma.upload.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
      include: {
        insights: true,
      },
    });

    if (!upload) {
      throw new AppError('Upload not found', 404);
    }

    res.json({
      success: true,
      data: upload,
    });
  }
);

export const deleteUpload = asyncHandler(
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const upload = await prisma.upload.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!upload) {
      throw new AppError('Upload not found', 404);
    }

    const key = upload.fileUrl.split('/').slice(-2).join('/');
    await storageService.deleteFile(key);

    await prisma.upload.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Upload deleted successfully',
    });
  }
);
