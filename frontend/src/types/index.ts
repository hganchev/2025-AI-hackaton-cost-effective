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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
} 