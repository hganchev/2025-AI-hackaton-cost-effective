'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Star } from 'lucide-react';
import type { Book } from '@/types/api.types';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="aspect-[2/3] relative mb-4 overflow-hidden rounded-lg">
            <img
              src={book.cover_image}
              alt={book.title}
              className="object-cover w-full h-full"
            />
          </div>
          <CardTitle className="text-lg font-semibold line-clamp-2">{book.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {book.author}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{book.category.name}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{book.reading_time} min</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {book.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="default">
            <BookOpen className="w-4 h-4 mr-2" />
            Read Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
} 