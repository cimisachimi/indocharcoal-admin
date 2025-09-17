// src/app/dashboard/testimonials/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Testimonial } from '@/types';
import styles from '../../global.module.css';
import apiClient from '@/lib/apiCLient';
import EditModal from '@/components/EditModal';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for modals
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiClient.get<Testimonial[]>('/api/testimonials');
        setTestimonials(response.data);
      } catch (err: any) {
        setError(err.response?.status === 401 ? 'Unauthorized. Please login again.' : 'Failed to fetch testimonials.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTestimonials();
  }, [token]);

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setEditModalOpen(true);
  };

  const handleSave = async (updatedTestimonial: Testimonial) => {
    if (!selectedTestimonial) return;
    try {
      const response = await apiClient.put<Testimonial>(`/api/testimonials/${selectedTestimonial.id}`, {
        name: updatedTestimonial.name,
        title: updatedTestimonial.title,
        message: updatedTestimonial.message,
      });
      setTestimonials(
        testimonials.map((t) => (t.id === selectedTestimonial.id ? response.data : t))
      );
      setEditModalOpen(false);
      setSelectedTestimonial(null);
    } catch (err: any) {
      setError(err.response?.status === 401 ? 'Unauthorized. Please login again.' : 'Failed to update testimonial.');
    }
  };

  const openConfirmModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTestimonial) return;
    try {
      await apiClient.delete(`/api/testimonials/${selectedTestimonial.id}`);
      setTestimonials(testimonials.filter((t) => t.id !== selectedTestimonial.id));
      setConfirmModalOpen(false);
      setSelectedTestimonial(null);
    } catch (err: any) {
      setError(err.response?.status === 401 ? 'Unauthorized. Please login again.' : 'Failed to delete testimonial.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post<Testimonial>('/api/testimonials', { name, title, message });
      setTestimonials([response.data, ...testimonials]);
      setName('');
      setTitle('');
      setMessage('');
    } catch (err: any) {
      setError(err.response?.status === 401 ? 'Unauthorized. Please login again.' : 'Failed to create testimonial.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Manage Testimonials</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>Add New Testimonial</h3>
        <div className={styles.formGroup}>
          <label htmlFor="name">Author Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
            <th>Title</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((testimonial) => (
            <tr key={testimonial.id}>
              <td>{testimonial.name}</td>
              <td>{testimonial.title}</td>
              <td>{testimonial.message}</td>
              <td className={styles.actionsCell}>
                <button onClick={() => handleEdit(testimonial)} className={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => openConfirmModal(testimonial)} className={styles.deleteButton}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        testimonial={selectedTestimonial}
        onSave={handleSave}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this testimonial?"
      />
    </div>
  );
}