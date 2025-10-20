import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = "edge";

// Get Razorpay secret key from environment variables
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Check if secret key is available
if (!KEY_SECRET) {
  console.error('Razorpay secret key not found in environment variables');
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request
    if (!body.razorpay_payment_id || !body.razorpay_order_id || !body.razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;
    
    // Create signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', KEY_SECRET || '')
      .update(payload)
      .digest('hex');
    
    // Compare signatures
    const isValid = expectedSignature === razorpay_signature;
    
    if (!isValid) {
      return NextResponse.json(
        { verified: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Return verification result
    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    
    return NextResponse.json(
      { verified: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
