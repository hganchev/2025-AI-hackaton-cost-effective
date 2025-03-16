import Image from "next/image"
import Link from "next/link"

// Define the Book interface for better type safety
export interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  description: string
  category?: string
  year?: number
}

export interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="group bg-card rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md">
      <Link href={`/book/${book.id}`} className="block">
        <div className="relative h-[240px] w-full">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
          <p className="text-muted-foreground text-sm mb-2">{book.author}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
          {book.category && (
            <div className="mt-2">
              <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
                {book.category}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 pt-0 flex justify-between">
        <Link 
          href={`/book/${book.id}`} 
          className="text-sm font-medium text-primary hover:underline"
        >
          Read Now
        </Link>
        <button 
          className="text-sm text-muted-foreground hover:text-primary"
          aria-label="Save this book"
        >
          Save
        </button>
      </div>
    </div>
  )
} 