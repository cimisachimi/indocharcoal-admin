// src/types/index.ts

export interface Testimonial {
  id: number;
  name: string;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  image_path: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}