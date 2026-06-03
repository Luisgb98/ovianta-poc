import { NextRequest, NextResponse } from 'next/server';
import { AppError, DatabaseError } from '@/src/shared/domain/errors';

type RouteContext = { params: Promise<Record<string, string>> };
type Handler = (req: NextRequest, ctx: RouteContext) => Promise<NextResponse>;

function toResponse(err: unknown): NextResponse {
  if (err instanceof AppError) {
    console.error(`[${err.code}] ${err.message}`, err instanceof DatabaseError ? err.cause : '');
    return NextResponse.json(
      { success: false, error: err.message, code: err.code },
      { status: err.statusCode }
    );
  }

  if (isMongoConnectionError(err)) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[DATABASE_ERROR]', msg);
    return NextResponse.json(
      { success: false, error: 'Database unavailable. Try again shortly.', code: 'DATABASE_ERROR' },
      { status: 503 }
    );
  }

  console.error('[INTERNAL_ERROR]', err);
  return NextResponse.json(
    { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
}

function isMongoConnectionError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return (
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoError' ||
    err.message.includes('MONGODB_URI')
  );
}

export function withApiHandler(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      return toResponse(err);
    }
  };
}
