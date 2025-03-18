'use client';

import { useState, useEffect } from 'react';
import { Comment, User } from '@/types/api.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { useBooks } from '@/hooks';
import { useAuth } from '@/hooks';

interface BookCommentsProps {
  bookId: string;
  initialComments: Comment[];
  initialRating: number;
}

export function BookComments({ bookId, initialComments, initialRating }: BookCommentsProps) {
  const { user } = useAuth();
  const { getComments, createComment, likeComment, rateBook, getBookRating } = useBooks();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [rating, setRating] = useState(initialRating);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const response = await createComment(bookId, { content: newComment });
      if (response.data) {
        setComments([response.data, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    try {
      await likeComment(bookId, commentId);
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes_count: comment.likes_count + 1 }
          : comment
      ));
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleRateBook = async (newRating: number) => {
    if (!user) return;
    try {
      await rateBook(bookId, newRating);
      setRating(newRating);
    } catch (error) {
      console.error('Failed to rate book:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Rating Section */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Rate this book</h3>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => handleRateBook(star)}
            >
              <Star
                className={`w-6 h-6 ${
                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </Button>
          ))}
        </div>
      </Card>

      {/* Comments Section */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Comments</h3>
        
        {/* Comment Form */}
        {user && (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="mb-2"
            />
            <Button type="submit" disabled={isSubmitting}>
              Post Comment
            </Button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">
                    {comment.user.first_name} {comment.user.last_name}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{comment.content}</p>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handleLikeComment(comment.id)}
              >
                <ThumbsUp className="w-4 h-4" />
                {comment.likes_count}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 