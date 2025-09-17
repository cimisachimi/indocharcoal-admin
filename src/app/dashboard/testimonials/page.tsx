// src/app/dashboard/testimonials/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Testimonial } from '@/types';
import styles from '../../global.module.css';
import apiClient from '@/lib/apiCLient'; // <-- Impor apiClient

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiClient.get<Testimonial[]>('/api/testimonials', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTestimonials(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Failed to fetch testimonials.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTestimonials();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post<Testimonial>(
        '/api/testimonials',
        { author_name: authorName, quote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTestimonials([response.data, ...testimonials]);
      setAuthorName('');
      setQuote('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError('Failed to create testimonial.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await apiClient.delete(`/api/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError('Failed to delete testimonial.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Manage Testimonials</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>Add New Testimonial</h3>
        <div className={styles.formGroup}>
          <label htmlFor="authorName">Author Name</label>
          <input
            id="authorName"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="quote">Quote</label>
          <textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Add Testimonial
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <h2>Existing Testimonials</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Author</th>
            <th>Quote</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((testimonial) => (
            <tr key={testimonial.id}>
              <td>{testimonial.author_name}</td>
              <td>{testimonial.quote}</td>
              <td>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
