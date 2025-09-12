import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import prisma from '../../../../../../lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const requestId = params.requestId;
    
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get admin user from database
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get the deletion request
    const deletionRequest = await prisma.accountDeletionRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!deletionRequest) {
      return NextResponse.json(
        { error: 'Deletion request not found' },
        { status: 404 }
      );
    }

    if (deletionRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'This request has already been processed' },
        { status: 400 }
      );
    }

    // Update the deletion request status
    await prisma.accountDeletionRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
        processedById: adminUser.id,
      },
    });

    // Anonymize the user data
    await prisma.user.update({
      where: { id: deletionRequest.userId },
      data: {
        email: `deleted_user_${deletionRequest.userId}@deleted.com`,
        name: 'Deleted User',
        phone: null,
        isActive: false,
        metadata: {
          ...deletionRequest.user.metadata,
          deletedAt: new Date().toISOString(),
          deletedBy: adminUser.id,
        },
      },
    });

    // Send email notification to user
    // This would be implemented with your email service
    // await sendEmail({
    //   to: deletionRequest.user.email,
    //   subject: 'Your Account Deletion Request Has Been Approved',
    //   message: 'Your account has been deleted as requested.',
    // });

    return NextResponse.json(
      { message: 'Account deletion request approved and user data anonymized' },
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
