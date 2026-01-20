describe('AI Service Mock Analysis', () => {
  const getMockTextAnalysis = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());

    return {
      summary: `This document contains ${wordCount} words and ${sentences.length} sentences.`,
      sentiment: {
        label: 'neutral',
        score: 0.65,
        explanation: 'Mock sentiment analysis.',
      },
      keyInsights: [
        'Mock insight 1',
        'Mock insight 2',
        'Mock insight 3',
      ],
    };
  };

  const getMockImageAnalysis = () => {
    return {
      imageDescription: 'Mock image analysis description.',
      objects: ['Object 1', 'Object 2'],
      themes: ['Theme 1', 'Theme 2'],
    };
  };

  describe('Text Analysis', () => {
    it('should return summary with word count', () => {
      const content = 'This is a test. It has multiple sentences.';
      const result = getMockTextAnalysis(content);

      expect(result.summary).toContain('words');
      expect(result.summary).toContain('sentences');
    });

    it('should return sentiment analysis', () => {
      const content = 'Test content for sentiment analysis.';
      const result = getMockTextAnalysis(content);

      expect(result.sentiment).toBeDefined();
      expect(result.sentiment.label).toBe('neutral');
      expect(result.sentiment.score).toBeGreaterThanOrEqual(0);
      expect(result.sentiment.score).toBeLessThanOrEqual(1);
    });

    it('should return key insights array', () => {
      const content = 'Test content.';
      const result = getMockTextAnalysis(content);

      expect(Array.isArray(result.keyInsights)).toBe(true);
      expect(result.keyInsights.length).toBeGreaterThan(0);
    });

    it('should count words correctly', () => {
      const content = 'one two three four five';
      const result = getMockTextAnalysis(content);

      expect(result.summary).toContain('5 words');
    });

    it('should count sentences correctly', () => {
      const content = 'First sentence. Second sentence! Third sentence?';
      const result = getMockTextAnalysis(content);

      expect(result.summary).toContain('3 sentences');
    });
  });

  describe('Image Analysis', () => {
    it('should return image description', () => {
      const result = getMockImageAnalysis();

      expect(result.imageDescription).toBeDefined();
      expect(typeof result.imageDescription).toBe('string');
    });

    it('should return objects array', () => {
      const result = getMockImageAnalysis();

      expect(Array.isArray(result.objects)).toBe(true);
      expect(result.objects.length).toBeGreaterThan(0);
    });

    it('should return themes array', () => {
      const result = getMockImageAnalysis();

      expect(Array.isArray(result.themes)).toBe(true);
      expect(result.themes.length).toBeGreaterThan(0);
    });
  });
});

describe('File Type Detection', () => {
  const isImageType = (mimeType: string) => mimeType.startsWith('image/');
  const isTextType = (mimeType: string) => {
    const textTypes = ['text/plain', 'text/csv', 'text/markdown', 'application/json'];
    return textTypes.includes(mimeType);
  };

  describe('Image Types', () => {
    it('should detect JPEG as image', () => {
      expect(isImageType('image/jpeg')).toBe(true);
    });

    it('should detect PNG as image', () => {
      expect(isImageType('image/png')).toBe(true);
    });

    it('should detect GIF as image', () => {
      expect(isImageType('image/gif')).toBe(true);
    });

    it('should detect WEBP as image', () => {
      expect(isImageType('image/webp')).toBe(true);
    });

    it('should not detect text as image', () => {
      expect(isImageType('text/plain')).toBe(false);
    });
  });

  describe('Text Types', () => {
    it('should detect plain text', () => {
      expect(isTextType('text/plain')).toBe(true);
    });

    it('should detect CSV', () => {
      expect(isTextType('text/csv')).toBe(true);
    });

    it('should detect Markdown', () => {
      expect(isTextType('text/markdown')).toBe(true);
    });

    it('should detect JSON', () => {
      expect(isTextType('application/json')).toBe(true);
    });

    it('should not detect image as text', () => {
      expect(isTextType('image/jpeg')).toBe(false);
    });
  });
});
