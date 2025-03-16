import Link from 'next/link';
import { BookCard } from '@/components/book-card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/footer';

export default function Home() {
  // Mock data for featured books
  const featuredBooks = [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverImage: '/images/great-gatsby.jpg',
      description: 'A story of wealth, love, and the American Dream in the 1920s.',
    },
    {
      id: '2',
      title: '1984',
      author: 'George Orwell',
      coverImage: '/images/1984.jpg',
      description: 'A dystopian novel about totalitarianism and surveillance.',
    },
    {
      id: '3',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      coverImage: '/images/mockingbird.jpg',
      description: 'A story about racial injustice and moral growth in the American South.',
    },
    {
      id: '4',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      coverImage: '/images/pride.jpg',
      description: 'A romantic novel about the societal expectations of women in the early 19th century.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/90 to-primary py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-4">Discover and Read Books Online</h1>
              <p className="text-xl mb-8">
                Access thousands of books from your browser. Read, bookmark, and enjoy literature from around the world.
              </p>
              <Link 
                href="/library" 
                className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-white/90 transition-colors"
              >
                Browse Library
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Books Section */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Fantasy', 'Mystery', 'Romance', 'Self-Help', 'Poetry', 'Drama', 'Children'].map((category) => (
                <Link 
                  key={category} 
                  href={`/category/${category.toLowerCase()}`}
                  className="bg-card hover:bg-card/90 text-card-foreground p-6 rounded-lg text-center shadow-sm transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 