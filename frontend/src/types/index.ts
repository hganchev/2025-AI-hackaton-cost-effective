import { ReactNode } from "react";

// Типове за книги
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

// Типове за потребители
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
  confirmPassword: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: number;
}

export interface FavoriteBook {
  userId: string;
  bookId: string;
  addedAt: Date;
}

// Типове за компоненти
export interface BookCardProps {
  book: Book;
}

export interface BookReaderProps {
  params: {
    id: string;
  }
}

// Типове за филтриране и сортиране
export type ViewMode = 'grid' | 'list';
export type SortOption = 'title' | 'author' | 'year';
export type SortDirection = 'asc' | 'desc';

// Други типове
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