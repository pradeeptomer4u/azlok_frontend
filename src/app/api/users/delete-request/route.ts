import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { verifyPassword } from '../../../../utils/auth';
import prisma from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create deletion request
    await prisma.accountDeletionRequest.create({
      data: {
        userId: user.id,
        reason,
        status: 'PENDING',
        requestedAt: new Date(),
      },
    });

    // Update user metadata to mark deletion requested
    await prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          ...user.metadata,
          deletionRequested: true,
          deletionRequestedAt: new Date().toISOString(),
        },
      },
    });

    // Send email notification to admin
    // This would be implemented with your email service
    // await sendAdminNotification({
    //   subject: 'Account Deletion Request',
    //   message: `User ${user.email} has requested account deletion. Reason: ${reason}`,
    // });

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
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database to check role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get all deletion requests
    const deletionRequests = await prisma.accountDeletionRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        processedBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });

    return NextResponse.json(deletionRequests, { status: 200 });
  } catch (error) {
    console.error('Error fetching account deletion requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
