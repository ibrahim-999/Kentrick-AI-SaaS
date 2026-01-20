import { AppError } from '../middleware/errorHandler';

describe('AppError', () => {
  it('should create an error with message and status code', () => {
    const error = new AppError('Not found', 404);

    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  it('should be an instance of Error', () => {
    const error = new AppError('Test error', 400);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should create different error types', () => {
    const badRequest = new AppError('Bad request', 400);
    const unauthorized = new AppError('Unauthorized', 401);
    const forbidden = new AppError('Forbidden', 403);
    const notFound = new AppError('Not found', 404);
    const serverError = new AppError('Internal server error', 500);

    expect(badRequest.statusCode).toBe(400);
    expect(unauthorized.statusCode).toBe(401);
    expect(forbidden.statusCode).toBe(403);
    expect(notFound.statusCode).toBe(404);
    expect(serverError.statusCode).toBe(500);
  });

  it('should have a stack trace', () => {
    const error = new AppError('Test error', 400);

    expect(error.stack).toBeDefined();
  });
});
