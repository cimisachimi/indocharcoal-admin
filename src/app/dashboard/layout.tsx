// src/app/dashboard/layout.tsx
'use client';

import Link from 'next/link';
import styles from '../global.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const handleLogout = async () => {
    // We just redirect to a "logout" page which will handle the API call.
    // This is a reliable pattern for static sites.
    window.location.href = '/logout';
  };

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <h2>Menu</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/dashboard">Home</Link>
          <Link href="/dashboard/testimonials">Testimonials</Link>
          <Link href="/dashboard/gallery">Gallery</Link>
          <button onClick={handleLogout} className={styles.button}>Logout</button>
        </nav>
      </aside>
      <main className={styles.container}>
        {children}
      </main>
    </div>
  );
}