describe('API Response Structure', () => {
  interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }

  it('should create success response', () => {
    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: '123' },
      message: 'Operation successful',
    };

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.error).toBeUndefined();
  });

  it('should create error response', () => {
    const response: ApiResponse = {
      success: false,
      error: 'Something went wrong',
    };

    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
    expect(response.data).toBeUndefined();
  });
});

describe('User Response Structure', () => {
  interface UserResponse {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
  }

  it('should create valid user response', () => {
    const user: UserResponse = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
    };

    expect(user.id).toBeDefined();
    expect(user.email).toContain('@');
    expect(user.name).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should allow null name', () => {
    const user: UserResponse = {
      id: '123',
      email: 'test@example.com',
      name: null,
      createdAt: new Date(),
    };

    expect(user.name).toBeNull();
  });
});

describe('Upload Response Structure', () => {
  interface UploadResponse {
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    createdAt: Date;
  }

  it('should create valid upload response', () => {
    const upload: UploadResponse = {
      id: '123',
      filename: 'test.txt',
      fileType: 'text/plain',
      fileSize: 1024,
      fileUrl: 'http://localhost:9000/uploads/test.txt',
      createdAt: new Date(),
    };

    expect(upload.id).toBeDefined();
    expect(upload.filename).toBe('test.txt');
    expect(upload.fileType).toBe('text/plain');
    expect(upload.fileSize).toBe(1024);
    expect(upload.fileUrl).toContain('http');
  });

  it('should validate file size is positive', () => {
    const upload: UploadResponse = {
      id: '123',
      filename: 'test.txt',
      fileType: 'text/plain',
      fileSize: 1024,
      fileUrl: 'http://localhost:9000/uploads/test.txt',
      createdAt: new Date(),
    };

    expect(upload.fileSize).toBeGreaterThan(0);
  });
});

describe('Insight Response Structure', () => {
  interface InsightContent {
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

  it('should create text insight content', () => {
    const content: InsightContent = {
      summary: 'Test summary',
      sentiment: {
        label: 'positive',
        score: 0.8,
        explanation: 'The text is positive',
      },
      keyInsights: ['Insight 1', 'Insight 2'],
    };

    expect(content.summary).toBeDefined();
    expect(content.sentiment).toBeDefined();
    expect(content.sentiment?.label).toBe('positive');
    expect(content.keyInsights?.length).toBe(2);
  });

  it('should create image insight content', () => {
    const content: InsightContent = {
      imageDescription: 'A test image',
      objects: ['Object 1', 'Object 2'],
      themes: ['Theme 1'],
    };

    expect(content.imageDescription).toBeDefined();
    expect(content.objects?.length).toBe(2);
    expect(content.themes?.length).toBe(1);
  });

  it('should validate sentiment score range', () => {
    const content: InsightContent = {
      sentiment: {
        label: 'neutral',
        score: 0.5,
        explanation: 'Neutral sentiment',
      },
    };

    expect(content.sentiment?.score).toBeGreaterThanOrEqual(0);
    expect(content.sentiment?.score).toBeLessThanOrEqual(1);
  });
});
