import { useState, useEffect } from 'react';
import { BooksService } from '@/services/books.service';
import type {
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  ReadingProgress,
  Comment,
  CreateCommentRequest,
  UpdateReadingProgressRequest,
  BookContent,
  GetBookContentRequest,
} from '@/types/api.types';

const booksService = new BooksService();

interface GetBooksParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await booksService.getBooks();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch books'));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const getBook = async (id: string): Promise<Book> => {
    return booksService.getBook(id);
  };

  const getReadingProgress = async (bookId: string): Promise<ReadingProgress> => {
    return booksService.getReadingProgress(bookId);
  };

  const updateReadingProgress = async (bookId: string, data: UpdateReadingProgressRequest): Promise<ReadingProgress> => {
    return booksService.updateReadingProgress(bookId, data);
  };

  const getComments = async (bookId: string): Promise<Comment[]> => {
    return booksService.getComments(bookId);
  };

  const createComment = async (bookId: string, data: CreateCommentRequest): Promise<Comment> => {
    return booksService.createComment(bookId, data);
  };

  const likeComment = async (bookId: string, commentId: string): Promise<Comment> => {
    return booksService.likeComment(bookId, commentId);
  };

  const getBooks = async (params?: GetBooksParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.getBooks(params);
      if (response.data) {
        setBooks(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch books'));
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (book: CreateBookRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.createBook(book);
      if (response.data) {
        setBooks(prev => [...prev, response.data]);
        return response.data;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create book'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, book: UpdateBookRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.updateBook(id, book);
      if (response.data) {
        setBooks(prev => prev.map(b => b.id === id ? response.data : b));
        return response.data;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update book'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await booksService.deleteBook(id);
      setBooks(prev => prev.filter(b => b.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete book'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rateBook = async (bookId: string, rating: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.rateBook(bookId, rating);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to rate book'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBookRating = async (bookId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.getBookRating(bookId);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch book rating'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBookContent = async (bookId: string, params?: GetBookContentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.getBookContent(bookId, params);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch book content'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBookChapter = async (bookId: string, chapter: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.getBookChapter(bookId, chapter);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch book chapter'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBookTableOfContents = async (bookId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await booksService.getBookTableOfContents(bookId);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch table of contents'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    books,
    loading,
    error,
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getReadingProgress,
    updateReadingProgress,
    getComments,
    createComment,
    likeComment,
    rateBook,
    getBookRating,
    getBookContent,
    getBookChapter,
    getBookTableOfContents,
  };
} 