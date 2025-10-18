import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    // In a real application, you would check if the user is authenticated
    // For this example, we'll assume the user is authenticated
    
    // Extract order ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const orderId = pathParts[pathParts.length - 2]; // Get the ID from the URL path
    
    // Parse request body
    const body = await request.json();
    
    // Validate request body
    if (!body.payment_status || !body.payment_method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate payment status
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(body.payment_status)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      );
    }
    
    // In a real application, you would update the order in your database
    // For this example, we'll just return a success response
    
    // Construct payment update data
    const paymentUpdateData = {
      payment_status: body.payment_status,
      payment_method: body.payment_method,
      payment_id: body.payment_id || null,
      payment_details: body.payment_details || {},
      updated_at: new Date().toISOString()
    };
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: `Payment status updated to ${body.payment_status}`,
      order_id: orderId,
      ...paymentUpdateData
    });
    
  } catch (error) {
    console.error('Error updating payment status:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
