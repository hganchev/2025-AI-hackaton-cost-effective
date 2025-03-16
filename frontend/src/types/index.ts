import { ReactNode } from "react";

// Auth types
export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: number;
}

// Book types
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  category?: string;
  year?: number;
}

export interface BookData extends Book {
  content: string[];
  totalPages: number;
}

export interface FavoriteBook {
  userId: string;
  bookId: string;
  addedAt: Date;
}

// Component types
export interface BookCardProps {
  book: Book;
}

export interface BookReaderProps {
  params: {
    id: string;
  }
}

// UI types
export type ViewMode = 'grid' | 'list';
export type SortOption = 'title' | 'author' | 'year';
export type SortDirection = 'asc' | 'desc';

export interface NavItem {
  name: string;
  href: string;
  icon?: ReactNode;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
} 