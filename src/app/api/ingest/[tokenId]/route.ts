import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/ingest/[tokenId]
 *
 * Webhook endpoint for n8n workflows.
 * Each workflow has a unique ingest token and webhook URL.
 * In production, this would:
 *   1. Validate the ingest token from the URL path or Authorization header
 *   2. Parse the request body (event_type, payload_summary)
 *   3. Create a WorkflowEvent record in the database
 *   4. Evaluate payload_summary against issue rules (detect silent issues)
 *   5. Create alerts if needed
 *   6. Update workflow health score and status
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
    const { event_type, payload_summary } = body;

    if (!event_type || !payload_summary) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type and payload_summary.' },
        { status: 400 }
      );
    }

    if (!['success', 'failure', 'silent_issue'].includes(event_type)) {
      return NextResponse.json(
        { error: 'Invalid event_type. Must be "success", "failure", or "silent_issue".' },
        { status: 400 }
      );
    }

    // In production: validate token against database, create event, evaluate rules
    return NextResponse.json({
      status: 'ok',
      received: {
        tokenId,
        event_type,
        payload_summary,
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