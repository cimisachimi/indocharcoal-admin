// src/app/dashboard/gallery/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { GalleryImage } from '@/types';
import styles from '../../global.module.css';
import apiClient from '@/lib/apiCLient';

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
        const response = await apiClient.get<GalleryImage[]>('/api/gallery', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImages(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Failed to fetch gallery.');
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
      setError('Please select an image file.');
      return;
    }
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);

    try {
      const response = await apiClient.post<GalleryImage>('/api/gallery', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setImages([response.data, ...images]);
      setTitle('');
      setImageFile(null);
      (e.target as HTMLFormElement).reset();
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
      await apiClient.delete(`/api/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
          <label htmlFor="title">Image Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Image File</label>
          <input
            id="image"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) =>
              e.target.files && setImageFile(e.target.files[0])
            }
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Upload Image
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <h2>Existing Images</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            style={{
              border: '1px solid #ccc',
              padding: '0.5rem',
              borderRadius: '4px',
            }}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image.image_path}`}
              alt={image.alt_text}
              width={150}
              height={150}
              style={{ objectFit: 'cover' }}
            />
            <p>{image.title}</p>
            <button
              onClick={() => handleDelete(image.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
