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

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiClient.get<Testimonial[]>('/api/testimonials');
        setTestimonials(response.data);
      } catch (err: any) {
        setError('Gagal mengambil data testimonials. Apakah Anda sudah login?');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post<Testimonial>('/api/testimonials', {
        author_name: authorName,
        quote,
      });
      setTestimonials([response.data, ...testimonials]);
      setAuthorName('');
      setQuote('');
    } catch (err: any) {
      setError('Gagal membuat testimonial.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin?')) return;
    try {
      await apiClient.delete(`/api/testimonials/${id}`);
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err: any) {
      setError('Gagal menghapus testimonial.');
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
          <input id="authorName" type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="quote">Quote</label>
          <textarea id="quote" value={quote} onChange={(e) => setQuote(e.target.value)} required />
        </div>
        <button type="submit" className={styles.button}>Add Testimonial</button>
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
              <td><button onClick={() => handleDelete(testimonial.id)} className={styles.deleteButton}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}