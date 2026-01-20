import Anthropic from '@anthropic-ai/sdk';
import { config, hasAnthropicKey } from '../config/env.js';
import { InsightContent } from '../types/index.js';

export class AIService {
  private anthropic: Anthropic | null = null;
  private useMock: boolean;

  constructor() {
    this.useMock = !hasAnthropicKey();

    if (!this.useMock) {
      this.anthropic = new Anthropic({
        apiKey: config.anthropic.apiKey,
      });
      console.log('🤖 AI Service initialized with Anthropic Claude API');
    } else {
      console.log('🤖 AI Service initialized with mock responses (no API key)');
    }
  }

  async analyzeText(content: string): Promise<InsightContent> {
    if (this.useMock) {
      return this.getMockTextAnalysis(content);
    }

    try {
      const response = await this.anthropic!.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Analyze the following text and provide a comprehensive analysis. Return your response as a valid JSON object with this exact structure:
{
  "summary": "A concise 2-3 sentence summary of the text",
  "sentiment": {
    "label": "positive" or "negative" or "neutral",
    "score": a number between 0.0 and 1.0,
    "explanation": "Brief explanation of the sentiment"
  },
  "keyInsights": ["insight 1", "insight 2", "insight 3", "insight 4"]
}

Text to analyze:
${content}

Respond ONLY with the JSON object, no additional text.`,
          },
        ],
      });

      const textContent = response.content[0];
      if (textContent.type !== 'text') {
        return this.getMockTextAnalysis(content);
      }

      try {
        const result = JSON.parse(textContent.text);
        return {
          summary: result.summary || 'Unable to generate summary',
          sentiment: result.sentiment || { label: 'neutral', score: 0.5, explanation: 'Unable to analyze sentiment' },
          keyInsights: result.keyInsights || [],
        };
      } catch {
        // If JSON parsing fails, try to extract meaningful content
        return {
          summary: textContent.text.substring(0, 500),
          sentiment: { label: 'neutral', score: 0.5, explanation: 'Analysis completed' },
          keyInsights: ['Analysis completed - see summary for details'],
        };
      }
    } catch (error) {
      console.error('Anthropic API error:', error);
      return this.getMockTextAnalysis(content);
    }
  }

  async analyzeImage(imageBase64: string, mimeType: string): Promise<InsightContent> {
    if (this.useMock) {
      return this.getMockImageAnalysis();
    }

    try {
      const mediaType = mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

      const response = await this.anthropic!.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: `Analyze this image and provide a detailed analysis. Return your response as a valid JSON object with this exact structure:
{
  "imageDescription": "A detailed description of what you see in the image",
  "objects": ["object1", "object2", "object3"],
  "themes": ["theme1", "theme2", "theme3"]
}

Respond ONLY with the JSON object, no additional text.`,
              },
            ],
          },
        ],
      });

      const textContent = response.content[0];
      if (textContent.type !== 'text') {
        return this.getMockImageAnalysis();
      }

      try {
        return JSON.parse(textContent.text);
      } catch {
        return {
          imageDescription: textContent.text,
          objects: [],
          themes: [],
        };
      }
    } catch (error) {
      console.error('Anthropic Vision API error:', error);
      return this.getMockImageAnalysis();
    }
  }

  private getMockTextAnalysis(content: string): InsightContent {
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());

    return {
      summary: `This document contains ${wordCount} words and ${sentences.length} sentences. It appears to be a ${wordCount > 500 ? 'detailed' : 'brief'} text that covers various topics. [Mock analysis - provide ANTHROPIC_API_KEY for real insights]`,
      sentiment: {
        label: 'neutral',
        score: 0.65,
        explanation: 'Mock sentiment analysis. The text appears to have a neutral tone with professional language. [Provide ANTHROPIC_API_KEY for accurate analysis]',
      },
      keyInsights: [
        'This is a mock insight - the document structure appears well-organized',
        'Key themes include the main topics discussed in the text',
        'The content provides valuable information on the subject matter',
        'Further analysis available with Anthropic API integration',
      ],
    };
  }

  private getMockImageAnalysis(): InsightContent {
    return {
      imageDescription: 'This is a mock image analysis. The image appears to contain various visual elements. [Provide ANTHROPIC_API_KEY for real image analysis using Claude Vision]',
      objects: ['Visual elements', 'Colors and shapes', 'Potential subjects'],
      themes: ['Photography', 'Visual content', 'Digital media'],
    };
  }

  isUsingMock(): boolean {
    return this.useMock;
  }
}

export const aiService = new AIService();
