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
      const res = await apiClient.post('/api/login', { email, password });

      // Save token to localStorage
      localStorage.setItem('token', res.data.access_token);

      // Redirect
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error("Login error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage =
        err.response?.data?.message ||
        `Login gagal (status: ${err.response?.status})`;
      setError(errorMessage);
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