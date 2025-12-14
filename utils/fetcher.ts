export async function fetcher<T>(endpoint: string): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  // Construct the full URL, e.g., /api/analytics/dashboard
  const url = `${apiUrl}${endpoint}`; 

  const res = await fetch(url, {
    // Crucial for Next.js to ensure fresh data for analytics
    cache: 'no-store' 
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Fetch error for ${endpoint}: ${res.status} - ${errorText}`);
    throw new Error(`Failed to fetch data from ${endpoint}: ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || `API call to ${endpoint} failed.`);
  }

  return data;
}

// Simple wrapper for data retrieval (you can use this if you need a specific path)
export async function getServerData<T>(endpoint: string): Promise<T> {
    const data = await fetcher<{ success: boolean; dashboardData: T }>(endpoint);
    return data.dashboardData;
}