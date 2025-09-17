// src/app/dashboard/layout.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = async () => {
    window.location.href = '/logout';
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Menu</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard">Home</Link>
          <Link href="/dashboard/testimonials">Testimonials</Link>
          <Link href="/dashboard/gallery">Gallery</Link>
        </nav>
        <div className="mt-auto">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}