// Get access token from localStorage
export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

// Get current user from localStorage
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Failed to parse user data:', e);
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getAccessToken() && !!getCurrentUser();
}

// Logout user
export async function logout() {
  try {
    // Call backend logout endpoint
    await fetch('http://localhost:3001/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Logout error:', err);
  }
  
  // Clear localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  
  // Redirect to login
  window.location.href = '/login';
}

// Refresh access token
export async function refreshAccessToken() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.accessToken;
    } else {
      // Refresh token expired, logout
      logout();
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    logout();
    return null;
  }
}

// Authenticated fetch wrapper
export async function authenticatedFetch(url, options = {}) {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No access token');
  }

  // Add Authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // If 401, try to refresh token and retry
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry with new token
        headers.Authorization = `Bearer ${newToken}`;
        return await fetch(url, { ...options, headers });
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}

