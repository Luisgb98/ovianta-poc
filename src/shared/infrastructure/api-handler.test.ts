import { describe, it, expect, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from './api-handler';
import { AppError, DatabaseError, NotFoundError, ValidationError } from '../domain/errors';

type RouteContext = { params: Promise<Record<string, string>> };

function makeRequest(url = 'http://localhost/api/test') {
  return new NextRequest(url);
}

function makeCtx(): RouteContext {
  return { params: Promise.resolve({}) };
}

describe('withApiHandler', () => {
  it('returns the handler response when no error is thrown', async () => {
    const handler = vi.fn().mockResolvedValue(NextResponse.json({ success: true }));
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(body.success).toBe(true);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('returns 400 for ValidationError', async () => {
    const handler = vi.fn().mockRejectedValue(new ValidationError('Name is required'));
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Name is required');
    expect(body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 404 for NotFoundError', async () => {
    const handler = vi.fn().mockRejectedValue(new NotFoundError('Patient', 'PT-001'));
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.code).toBe('NOT_FOUND');
  });

  it('returns 503 for DatabaseError', async () => {
    const handler = vi.fn().mockRejectedValue(new DatabaseError('Connection refused'));
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.code).toBe('DATABASE_ERROR');
  });

  it('returns 503 for MongoServerSelectionError', async () => {
    const mongoErr = Object.assign(new Error('timed out'), { name: 'MongoServerSelectionError' });
    const handler = vi.fn().mockRejectedValue(mongoErr);
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.code).toBe('DATABASE_ERROR');
    expect(body.error).toBe('Database unavailable. Try again shortly.');
  });

  it('returns 503 for MongoNetworkError', async () => {
    const mongoErr = Object.assign(new Error('network error'), { name: 'MongoNetworkError' });
    const handler = vi.fn().mockRejectedValue(mongoErr);
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.code).toBe('DATABASE_ERROR');
  });

  it('returns 503 when error message includes MONGODB_URI', async () => {
    const mongoErr = new Error('MONGODB_URI is not set');
    const handler = vi.fn().mockRejectedValue(mongoErr);
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.code).toBe('DATABASE_ERROR');
  });

  it('returns 500 for unknown errors', async () => {
    const handler = vi.fn().mockRejectedValue(new Error('unexpected'));
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Internal server error');
    expect(body.code).toBe('INTERNAL_ERROR');
  });

  it('returns 500 for non-Error thrown values', async () => {
    const handler = vi.fn().mockRejectedValue('string error');
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.code).toBe('INTERNAL_ERROR');
  });

  it('forwards req and ctx to the inner handler', async () => {
    const handler = vi.fn().mockResolvedValue(NextResponse.json({}));
    const wrapped = withApiHandler(handler);
    const req = makeRequest();
    const ctx = makeCtx();

    await wrapped(req, ctx);

    expect(handler).toHaveBeenCalledWith(req, ctx);
  });

  it('handles custom AppError status codes', async () => {
    const handler = vi.fn().mockRejectedValue(new AppError('teapot', 418, 'TEAPOT'));
    const wrapped = withApiHandler(handler);

    const res = await wrapped(makeRequest(), makeCtx());
    const body = await res.json();

    expect(res.status).toBe(418);
    expect(body.code).toBe('TEAPOT');
  });
});
