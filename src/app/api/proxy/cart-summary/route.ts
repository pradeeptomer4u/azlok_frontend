import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the shipping_method_id from the URL
    const { searchParams } = new URL(request.url);
    const shippingMethodId = searchParams.get('shipping_method_id');
    
    if (!shippingMethodId) {
      return NextResponse.json(
        { error: 'Shipping method ID is required' },
        { status: 400 }
      );
    }
    
    // Forward the request to the actual API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/cart-summary/?shipping_method_id=${shippingMethodId}`;
    
    // Get token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    // Make the request to the API
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      }
    });
    
    // If the cart is empty, return a default empty summary
    if (response.status === 400) {
      try {
        const errorData = await response.json();
        if (errorData?.detail === 'Cart is empty') {
          return NextResponse.json({
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0
          });
        }
      } catch (e) {
        // If we can't parse the error, continue with the normal error handling
      }
    }
    
    // If there's an error, return the error
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch cart summary' },
        { status: response.status }
      );
    }
    
    // Return the response data
    const data = await response.json();
    
    // Log the response for debugging
    
    // Transform the response if needed to match the expected format
    const transformedData = {
      subtotal: data.subtotal || 0,
      shipping_amount: data.shipping_amount || 0,
      tax_amount: data.tax_amount || 0,
      total: data.total || 0,
      cgst_amount: data.cgst_amount || 0,
      sgst_amount: data.sgst_amount || 0,
      igst_amount: data.igst_amount || 0,
      shipping_tax_amount: data.shipping_tax_amount || 0
    };
    
    return NextResponse.json(transformedData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
