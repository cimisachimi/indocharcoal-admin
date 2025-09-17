// src/app/dashboard/gallery/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { GalleryImage } from '@/types';
import styles from '../../global.module.css';
import apiClient from '@/lib/apiCLient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await apiClient.get<GalleryImage[]>('/api/galleries');
        setImages(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Failed to fetch images.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchImages();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image to upload.');
      return;
    }
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);

    try {
      const response = await apiClient.post<GalleryImage>('/api/galleries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImages([response.data, ...images]);
      setTitle('');
      setImageFile(null);
      // Clear file input
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError('Failed to upload image.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await apiClient.delete(`/api/galleries/${id}`);
      setImages(images.filter((img) => img.id !== id));
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError('Failed to delete image.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Manage Gallery</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>Upload New Image</h3>
        <div className={styles.formGroup}>
          <label htmlFor="title">Image Title (optional)</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Image File</label>
          <input
            id="image"
            type="file"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Upload Image
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <h2>Existing Images</h2>
      <div className={styles.galleryGrid}>
        {images.map((image) => (
          <div key={image.id} className={styles.galleryItem}>
            <img src={`${API_URL}/storage/${image.image_path}`} alt={image.title} />
            <div className={styles.galleryItemCaption}>
              <p>{image.title}</p>
              <button
                onClick={() => handleDelete(image.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}