// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './global.module.css';

// Create a reusable Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // This is crucial for sending cookies
});

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // This useEffect hook runs once when the component loads
  useEffect(() => {
    // Make the initial request to get the CSRF cookie
    apiClient.get('/sanctum/csrf-cookie').catch(err => {
      console.error('CSRF cookie fetch failed:', err);
      setError('Could not connect to the server. Is it running?');
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Now, make the login request. Axios will automatically handle the CSRF token.
      await apiClient.post('/api/login', {
        email,
        password,
      });

      // If login is successful, redirect to the dashboard
      window.location.href = '/dashboard';

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
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