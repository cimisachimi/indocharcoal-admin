// src/app/logout/page.tsx
'use client';

import { useEffect } from 'react';
import apiClient from '@/lib/apiCLient';

export default function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      try {
        await apiClient.post('/api/logout');
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        // Always remove token and redirect to login page
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    };

    logout();
  }, []);

  return <p>Logging out...</p>;
}