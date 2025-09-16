// src/types/index.ts

export interface Testimonial {
  id: number;
  author_name: string;
  quote: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  alt_text: string;
  image_path: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}