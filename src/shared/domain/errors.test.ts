import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, ValidationError, DatabaseError } from './errors';

describe('AppError', () => {
  it('sets message, statusCode, code, and name', () => {
    const err = new AppError('something failed', 422, 'UNPROCESSABLE');
    expect(err.message).toBe('something failed');
    expect(err.statusCode).toBe(422);
    expect(err.code).toBe('UNPROCESSABLE');
    expect(err.name).toBe('AppError');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('NotFoundError', () => {
  it('builds message with resource and id', () => {
    const err = new NotFoundError('Patient', 'PT-001');
    expect(err.message).toBe("Patient 'PT-001' not found");
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.name).toBe('NotFoundError');
    expect(err).toBeInstanceOf(AppError);
  });

  it('builds message with resource only when id is omitted', () => {
    const err = new NotFoundError('Record');
    expect(err.message).toBe('Record not found');
  });
});

describe('ValidationError', () => {
  it('sets status 400 and VALIDATION_ERROR code', () => {
    const err = new ValidationError('Name is required');
    expect(err.message).toBe('Name is required');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.name).toBe('ValidationError');
    expect(err).toBeInstanceOf(AppError);
  });
});

describe('DatabaseError', () => {
  it('sets status 503 and DATABASE_ERROR code', () => {
    const err = new DatabaseError('Connection refused');
    expect(err.message).toBe('Connection refused');
    expect(err.statusCode).toBe(503);
    expect(err.code).toBe('DATABASE_ERROR');
    expect(err.name).toBe('DatabaseError');
    expect(err).toBeInstanceOf(AppError);
  });

  it('stores the cause', () => {
    const cause = new Error('underlying');
    const err = new DatabaseError('wrapped', cause);
    expect(err.cause).toBe(cause);
  });

  it('accepts undefined cause', () => {
    const err = new DatabaseError('no cause');
    expect(err.cause).toBeUndefined();
  });
});
