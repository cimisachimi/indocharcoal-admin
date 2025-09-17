// src/app/dashboard/gallery/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { GalleryImage } from '@/types';
import apiClient from '@/lib/apiCLient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Gallery</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload New Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Image Title (optional)</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image File</Label>
              <Input
                id="image"
                type="file"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                required
              />
            </div>
            <Button type="submit">Upload Image</Button>
          </form>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <h2 className="text-xl font-bold mb-4">Existing Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img src={`${API_URL}/storage/${image.image_path}`} alt={image.title} className="rounded-lg object-cover w-full h-full" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p>{image.title}</p>
                <Button
                  onClick={() => handleDelete(image.id)}
                  variant="destructive"
                  size="sm"
                  className="mt-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}