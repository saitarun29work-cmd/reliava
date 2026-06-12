import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/ingest/[tokenId]
 *
 * Webhook endpoint for n8n workflows.
 * Each workflow has a unique ingest token and webhook URL.
 * In production, this would:
 *   1. Validate the ingest token from the URL path or Authorization header
 *   2. Parse the request body (outcome, message, metadata)
 *   3. Create a WorkflowEvent record in the database
 *   4. Evaluate issue rules and create alerts if needed
 *   5. Update workflow health score and status
 *
 * For MVP, this returns a success response for valid payloads.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Missing workflow token ID in URL path.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { outcome, message } = body;

    if (!outcome || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: outcome and message.' },
        { status: 400 }
      );
    }

    if (!['success', 'failure'].includes(outcome)) {
      return NextResponse.json(
        { error: 'Invalid outcome. Must be "success" or "failure".' },
        { status: 400 }
      );
    }

    // In production: validate token against database, create event, evaluate rules
    return NextResponse.json({
      status: 'ok',
      received: {
        tokenId,
        outcome,
        message,
        metadata: body.metadata ?? null,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body. Expected JSON.' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Reliava Ingest API',
    version: '1.0.0-mvp',
    description: 'Webhook endpoint for n8n workflow event ingestion.',
  });
}