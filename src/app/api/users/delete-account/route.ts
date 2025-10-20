import { NextRequest, NextResponse } from 'next/server';

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { reason, password } = body;

    // Validate input
    if (!reason || !password) {
      return NextResponse.json(
        { error: 'Reason and password are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would verify the user and create a deletion request
    // For now, just return a success response
    return NextResponse.json(
      { message: 'Account deletion request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing account deletion request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // This endpoint would be used by admins to get deletion requests
  // For now, just return a success response with empty data
  return NextResponse.json(
    { requests: [] },
    { status: 200 }
  );
}
