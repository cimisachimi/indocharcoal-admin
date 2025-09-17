// src/app/page.tsx
'use client';

import { useState } from 'react';
import apiClient from '../lib/apiCLient'; // Impor apiClient
import styles from './global.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Indocharsupply123'); // Ganti dengan password Anda
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Langkah 1: Minta CSRF cookie dari Sanctum
      await apiClient.get('/sanctum/csrf-cookie');

      // Langkah 2: Lakukan request login
      await apiClient.post('/api/login', {
        email,
        password,
      });

      // Jika berhasil, alihkan ke dasbor
      window.location.href = '/dashboard';

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}