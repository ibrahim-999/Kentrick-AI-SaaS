import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('Auth Utils', () => {
  const JWT_SECRET = 'test-secret';

  describe('JWT Token', () => {
    it('should generate a valid JWT token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should verify a valid JWT token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      const decoded = jwt.verify(token, JWT_SECRET) as typeof payload;

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it('should reject an invalid JWT token', () => {
      expect(() => {
        jwt.verify('invalid-token', JWT_SECRET);
      }).toThrow();
    });

    it('should reject a token with wrong secret', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow();
    });
  });

  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hashed = await bcrypt.hash(password, 12);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
    });

    it('should verify a correct password', async () => {
      const password = 'testpassword123';
      const hashed = await bcrypt.hash(password, 12);

      const isValid = await bcrypt.compare(password, hashed);

      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'testpassword123';
      const hashed = await bcrypt.hash(password, 12);

      const isValid = await bcrypt.compare('wrongpassword', hashed);

      expect(isValid).toBe(false);
    });
  });
});

describe('Validation', () => {
  describe('Email Validation', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'user+tag@example.co.uk',
      ];

      validEmails.forEach((email) => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@domain.com',
        'invalid@domain',
      ];

      invalidEmails.forEach((email) => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('Password Validation', () => {
    it('should accept passwords with 6+ characters', () => {
      const validPasswords = ['123456', 'password', 'longerpassword123'];

      validPasswords.forEach((password) => {
        expect(password.length >= 6).toBe(true);
      });
    });

    it('should reject passwords with less than 6 characters', () => {
      const invalidPasswords = ['12345', 'short', 'abc'];

      invalidPasswords.forEach((password) => {
        expect(password.length >= 6).toBe(false);
      });
    });
  });
});
