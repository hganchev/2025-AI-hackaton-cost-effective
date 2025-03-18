import { BookDetails } from '@/components/books/BookDetails';

interface BookPageProps {
  params: {
    id: string;
  };
}

export default function BookPage({ params }: BookPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <BookDetails bookId={params.id} />
    </main>
  );
} 