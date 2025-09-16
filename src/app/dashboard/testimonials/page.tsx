// src/app/dashboard/testimonials/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Testimonial } from '@/types';
import styles from '../../global.module.css';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all testimonials when the component loads
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`);
        if (!res.ok) throw new Error('Failed to fetch testimonials.');
        const data = await res.json();
        setTestimonials(data);
      } catch (err: any) {
        setError(err.message);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ author_name: authorName, quote }),
      });

      if (!res.ok) throw new Error('Failed to create testimonial.');

      const newTestimonial = await res.json();
      setTestimonials([newTestimonial, ...testimonials]); // Add to the top of the list
      setAuthorName('');
      setQuote('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete testimonial.');

      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message);
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