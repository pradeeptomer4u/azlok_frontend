import { NextRequest, NextResponse } from 'next/server';

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

    // Check authentication from cookies
    const cookieStore = req.cookies;
    const userCookie = cookieStore.get('azlok-user');
    
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse user data
    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 401 }
      );
    }

    // In a real implementation, this would verify the password and create a deletion request
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
  try {
    // Check authentication from cookies
    const cookieStore = req.cookies;
    const userCookie = cookieStore.get('azlok-user');
    
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse user data
    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // In a real implementation, this would fetch deletion requests from the database
    // For now, just return an empty array
    return NextResponse.json(
      { requests: [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching account deletion requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
