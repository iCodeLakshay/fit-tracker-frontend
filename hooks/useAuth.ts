'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthProtection() {
  const router = useRouter();
  
  // Function to decode JWT token
  const getDecodedToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Split the token and get the payload part
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          // Decode the payload
          const payload = JSON.parse(window.atob(base64));
          return payload;
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
    return null;
  };

  useEffect(() => {
    // Check if token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      // Redirect to login page if no token
      router.push('/auth');
    }
  }, [router]);
  
  const decodedToken = getDecodedToken();
  const userId = decodedToken?.userId || '';

  // Return whether user is authenticated and their userId
  return {
    isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('token'),
    userId
  };
}

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      // Redirect to dashboard if already authenticated
      router.push('/');
    }
  }, [router]);
}
