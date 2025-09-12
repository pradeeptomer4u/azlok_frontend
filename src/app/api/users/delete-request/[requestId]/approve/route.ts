import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const requestId = params.requestId;
    
    // Check authentication from cookies
    const cookieStore = req.cookies;
    const userCookie = cookieStore.get('azlok-user');
    const tokenCookie = cookieStore.get('azlok-token');
    
    if (!userCookie || !tokenCookie) {
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
    
    // In a real implementation, this would update the database
    // For now, just return a success response
    return NextResponse.json(
      { 
        message: 'Account deletion request approved and user data anonymized',
        requestId: requestId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error approving account deletion request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
