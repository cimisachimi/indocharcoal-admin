// src/app/dashboard/gallery/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { GalleryImage } from '@/types';
import styles from '../../global.module.css';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`);
        if (!res.ok) throw new Error('Failed to fetch images.');
        const data = await res.json();
        setImages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData, // Use FormData for file uploads
      });

      if (!res.ok) throw new Error('Failed to upload image.');

      const newImage = await res.json();
      setImages([newImage, ...images]);
      setTitle('');
      setImageFile(null);
      (e.target as HTMLFormElement).reset(); // Reset file input
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete image.');

      setImages(images.filter((img) => img.id !== id));
    } catch (err: any) {
      setError(err.message);
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
            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Upload Image</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <h2>Existing Images</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        {images.map((image) => (
          <div key={image.id} style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
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