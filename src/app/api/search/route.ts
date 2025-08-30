import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Search API route called');
  try {
    // Get search parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = searchParams.get('page') || '1';
    const size = searchParams.get('size') || '20';
    const categoryId = searchParams.get('category_id');
    
    // Construct the backend API URL
    let backendUrl = `http://localhost:8000/api/products/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`;
    
    if (categoryId) {
      backendUrl += `&category_id=${categoryId}`;
    }
    
    console.log(`Proxying search request to: ${backendUrl}`);
    
    // Forward the request to the backend API
    console.log('Sending request to backend:', backendUrl);
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Backend API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      
      return NextResponse.json(
        { error: 'Failed to fetch search results from backend' },
        { status: response.status }
      );
    }
    
    // Get the response data
    const data = await response.json();
    console.log(`Search results: ${data.items?.length || 0} items found`);
    
    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in search API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
