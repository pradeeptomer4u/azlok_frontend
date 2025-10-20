import { NextRequest, NextResponse } from 'next/server';

export const runtime = "edge";

// Get Razorpay credentials from environment variables
const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Check if credentials are available
if (!KEY_ID || !KEY_SECRET) {
  console.error('Razorpay credentials not found in environment variables');
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request
    if (!body.amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    // Ensure amount is a number
    const amount = Number(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Set default currency if not provided
    const currency = body.currency || 'INR';
    
    // Create Razorpay order
    const options = {
      amount,
      currency,
      receipt: body.receipt || `receipt_${Date.now()}`,
      notes: body.notes || {},
      payment_capture: body.payment_capture !== undefined ? body.payment_capture : true
    };

    // Make API request to Razorpay
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64')}`
      },
      body: JSON.stringify(options)
    });

    // Check response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Razorpay API error:', errorData);
      
      return NextResponse.json(
        { error: 'Failed to create Razorpay order' },
        { status: response.status }
      );
    }

    // Return order details
    const orderData = await response.json();
    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
