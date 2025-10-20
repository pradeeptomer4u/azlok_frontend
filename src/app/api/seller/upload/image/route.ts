import { NextRequest, NextResponse } from 'next/server';

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'products';
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { detail: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }
    
    if (!file) {
      return NextResponse.json(
        { detail: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Create a new FormData instance for the backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    backendFormData.append('folder', folder);
    
    // Forward the request to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: backendFormData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { detail: errorData.detail || 'Failed to upload image' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
