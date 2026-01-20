import { describe, it, expect } from 'vitest';

describe('File Size Formatting', () => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  it('should format bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('should format kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(2048)).toBe('2.0 KB');
  });

  it('should format megabytes correctly', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});

describe('Date Formatting', () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  it('should format date string', () => {
    const result = formatDate('2024-01-15T10:30:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
  });
});

describe('Email Validation', () => {
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.org')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });
});

describe('Password Validation', () => {
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  it('should accept valid passwords', () => {
    expect(isValidPassword('password123')).toBe(true);
    expect(isValidPassword('123456')).toBe(true);
  });

  it('should reject short passwords', () => {
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('abc')).toBe(false);
  });
});

describe('File Type Validation', () => {
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

  const isAllowedFileType = (mimeType: string) => {
    return allowedMimeTypes.includes(mimeType);
  };

  it('should allow text files', () => {
    expect(isAllowedFileType('text/plain')).toBe(true);
    expect(isAllowedFileType('text/csv')).toBe(true);
    expect(isAllowedFileType('application/json')).toBe(true);
  });

  it('should allow image files', () => {
    expect(isAllowedFileType('image/jpeg')).toBe(true);
    expect(isAllowedFileType('image/png')).toBe(true);
    expect(isAllowedFileType('image/gif')).toBe(true);
  });

  it('should reject unsupported files', () => {
    expect(isAllowedFileType('application/pdf')).toBe(false);
    expect(isAllowedFileType('video/mp4')).toBe(false);
    expect(isAllowedFileType('audio/mp3')).toBe(false);
  });
});

describe('File Size Validation', () => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const isValidFileSize = (size: number) => {
    return size <= MAX_FILE_SIZE;
  };

  it('should accept files under 10MB', () => {
    expect(isValidFileSize(1024)).toBe(true);
    expect(isValidFileSize(5 * 1024 * 1024)).toBe(true);
  });

  it('should accept files exactly 10MB', () => {
    expect(isValidFileSize(10 * 1024 * 1024)).toBe(true);
  });

  it('should reject files over 10MB', () => {
    expect(isValidFileSize(11 * 1024 * 1024)).toBe(false);
  });
});
