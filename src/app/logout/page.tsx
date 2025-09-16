// src/app/logout/page.tsx
'use client';

import { useEffect } from 'react';

export default function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
        });
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        // Always redirect to login page
        window.location.href = '/';
      }
    };

    logout();
  }, []);

  return <p>Logging out...</p>;
}