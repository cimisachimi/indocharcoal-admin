// src/components/EditModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Testimonial } from '@/types';
import styles from '../app/global.module.css';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: Testimonial | null;
  onSave: (testimonial: Testimonial) => void;
}

export default function EditModal({ isOpen, onClose, testimonial, onSave }: EditModalProps) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (testimonial) {
      setName(testimonial.name);
      setTitle(testimonial.title);
      setMessage(testimonial.message);
    }
  }, [testimonial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testimonial) {
      onSave({ ...testimonial, name, title, message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Edit Testimonial</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="edit-name">Author Name</label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-message">Message</label>
            <textarea
              id="edit-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.buttonSecondary}>
              Cancel
            </button>
            <button type="submit" className={styles.button}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}