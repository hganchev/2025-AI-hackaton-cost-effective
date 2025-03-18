'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/hooks';
import { Book } from '@/types/api.types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, BookOpen, MessageSquare, ThumbsUp, ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { BookReader } from './BookReader';
import { BookComments } from './BookComments';
import { useSearchParams } from 'next/navigation';

interface BookDetailsProps {
  bookId: string;
}

export function BookDetails({ bookId }: BookDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getBook } = useBooks();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(searchParams.get('reading') === 'true');

  useEffect(() => {
    const loadBook = async () => {
      try {
        const bookData = await getBook(bookId);
        if (bookData) {
          setBook(bookData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId, getBook]);

  const handleStartReading = () => {
    router.push(`/books/${bookId}?reading=true`);
    setIsReading(true);
  };

  const handleStopReading = () => {
    router.push(`/books/${bookId}`);
    setIsReading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !book) {
    return <div>Error: {error || 'Book not found'}</div>;
  }

  if (isReading) {
    return <BookReader book={book} onClose={handleStopReading} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/library')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Button>
        <h1 className="text-3xl font-bold">{book.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Image */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <Image
              src={book.cover_image || '/placeholder-book.jpg'}
              alt={book.title}
              width={400}
              height={600}
              className="w-full h-auto object-cover"
            />
          </Card>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-4">by {book.author}</p>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">{book.category.name}</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{book.rating?.toFixed(1) || 'No rating'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{book.reading_time} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{book.pages} pages</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(book.created_at).getFullYear()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{book.author}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{book.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {book.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleStartReading}
          >
            Read Now
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <BookComments
          bookId={book.id}
          initialComments={book.comments}
          initialRating={book.rating}
        />
      </div>
    </div>
  );
} 