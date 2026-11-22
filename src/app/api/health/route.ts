import { NextResponse } from 'next/server';
import { client } from '@/db';

export async function GET() {
  const hasDbUrl = Boolean(process.env.DATABASE_URL);

  if (!hasDbUrl || !client) {
    return NextResponse.json({
      status: 'warning',
      message: 'Database URL is not configured yet. Add DATABASE_URL to your .env.local file.',
      database: {
        connected: false,
        provider: 'Neon Serverless PostgreSQL',
      },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const result = await client`SELECT 1 as connected;`;
    return NextResponse.json({
      status: 'healthy',
      message: 'Neon PostgreSQL connected successfully via Drizzle ORM.',
      database: {
        connected: true,
        provider: 'Neon Serverless PostgreSQL',
        pingResult: result,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to Neon PostgreSQL database.',
        error: message,
        database: {
          connected: false,
          provider: 'Neon Serverless PostgreSQL',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
