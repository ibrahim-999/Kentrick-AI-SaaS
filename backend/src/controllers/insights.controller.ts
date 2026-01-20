import { Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { aiService } from '../services/ai.service.js';
import { storageService } from '../services/storage.service.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthenticatedRequest, ApiResponse, InsightResponse } from '../types/index.js';

const prisma = new PrismaClient();

export const analyzeUpload = asyncHandler(
  async (req: AuthenticatedRequest, res: Response<ApiResponse<InsightResponse[]>>) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { uploadId } = req.body;

    if (!uploadId) {
      throw new AppError('Upload ID is required', 400);
    }

    const upload = await prisma.upload.findFirst({
      where: {
        id: uploadId,
        userId: req.user.userId,
      },
    });

    if (!upload) {
      throw new AppError('Upload not found', 404);
    }

    // Check if insights already exist
    const existingInsights = await prisma.insight.findMany({
      where: { uploadId },
    });

    if (existingInsights.length > 0) {
      res.json({
        success: true,
        data: existingInsights.map((i) => ({
          id: i.id,
          uploadId: i.uploadId,
          type: i.type,
          content: i.content as InsightResponse['content'],
          createdAt: i.createdAt,
        })),
        message: 'Insights already generated',
      });
      return;
    }

    // Get file content
    const key = upload.fileUrl.split('/').slice(-2).join('/');
    let analysisResult;

    if (upload.fileType.startsWith('image/')) {
      // Image analysis
      const fileBuffer = await storageService.getFileContent(key);
      const base64 = fileBuffer.toString('base64');
      analysisResult = await aiService.analyzeImage(base64, upload.fileType);
    } else {
      // Text analysis
      const fileBuffer = await storageService.getFileContent(key);
      const textContent = fileBuffer.toString('utf-8');
      analysisResult = await aiService.analyzeText(textContent);
    }

    // Store insights
    const insightTypes = upload.fileType.startsWith('image/')
      ? ['image_analysis']
      : ['text_analysis'];

    const insights = await Promise.all(
      insightTypes.map((type) =>
        prisma.insight.create({
          data: {
            uploadId,
            type,
            content: analysisResult as Prisma.InputJsonValue,
          },
        })
      )
    );

    res.status(201).json({
      success: true,
      data: insights.map((i) => ({
        id: i.id,
        uploadId: i.uploadId,
        type: i.type,
        content: i.content as InsightResponse['content'],
        createdAt: i.createdAt,
      })),
      message: aiService.isUsingMock()
        ? 'Analysis completed (mock mode - provide ANTHROPIC_API_KEY for real insights)'
        : 'Analysis completed successfully',
    });
  }
);

export const getInsights = asyncHandler(
  async (req: AuthenticatedRequest, res: Response<ApiResponse<InsightResponse[]>>) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { uploadId } = req.params;

    // Verify upload belongs to user
    const upload = await prisma.upload.findFirst({
      where: {
        id: uploadId,
        userId: req.user.userId,
      },
    });

    if (!upload) {
      throw new AppError('Upload not found', 404);
    }

    const insights = await prisma.insight.findMany({
      where: { uploadId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: insights.map((i) => ({
        id: i.id,
        uploadId: i.uploadId,
        type: i.type,
        content: i.content as InsightResponse['content'],
        createdAt: i.createdAt,
      })),
    });
  }
);

export const getAIStatus = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    res.json({
      success: true,
      data: {
        usingMock: aiService.isUsingMock(),
        message: aiService.isUsingMock()
          ? 'Running in mock mode. Provide ANTHROPIC_API_KEY environment variable for real AI analysis.'
          : 'Connected to Anthropic Claude API',
      },
    });
  }
);
