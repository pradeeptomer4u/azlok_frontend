import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const size = parseInt(searchParams.get('size') || '20');
    const categoryId = searchParams.get('category_id');
    
    // Construct the backend API URL
    let backendUrl = `https://api.azlok.com/api/products/search/?query=${encodeURIComponent(query)}&page=${page}&size=${size}`;
    
    if (categoryId) {
      backendUrl += `&category_id=${categoryId}`;
    }
    
    
    try {
      // Forward the request to the backend API
      const response = await fetch(backendUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhemxva19hZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTk0MDg3MzEyM30.4TAbjU8BtP9TxwFbTSXwZ1IbUOlelscggK45g3eULuw'
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        
        // Return error response
        return NextResponse.json(
          { error: 'Failed to fetch search results from backend', items: [] },
          { status: response.status }
        );
      }
      
      // Get the response data
      const data = await response.json();
      
      // Transform the response structure to match what our frontend expects
      const transformedData = {
        items: data.results || [],
        total: data.total || 0,
        page: data.page || page,
        size: data.limit || size,
        pages: data.pages || 1,
        query: query
      };
      

      // Return the transformed response
      return NextResponse.json(transformedData);
    } catch (error) {
    
      // Return error response
      return NextResponse.json(
        { error: 'Failed to connect to backend API', items: [] },
        { status: 503 } // Service Unavailable
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
