'use client';

import { useState, useEffect } from 'react';
import { Book, BookContent } from '@/types/api.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useBooks } from '@/hooks';
import { ChevronLeft, ChevronRight, Settings, ArrowLeft } from 'lucide-react';

interface BookReaderProps {
  book: Book;
  onClose: () => void;
}

export function BookReader({ book, onClose }: BookReaderProps) {
  const { getBookChapter, getBookTableOfContents, updateReadingProgress } = useBooks();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const [content, setContent] = useState<string>('');
  const [tableOfContents, setTableOfContents] = useState<{ chapter: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const [chapterResponse, tocResponse] = await Promise.all([
          getBookChapter(book.id, currentChapter),
          getBookTableOfContents(book.id),
        ]);

        if (chapterResponse?.data) {
          setContent(chapterResponse.data.content);
        }
        if (tocResponse?.data) {
          setTableOfContents(tocResponse.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load book content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [book.id, currentChapter, getBookChapter, getBookTableOfContents]);

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(prev => prev - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < book.pages) {
      setCurrentChapter(prev => prev + 1);
    }
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  const handleLineHeightChange = (value: number[]) => {
    setLineHeight(value[0]);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'sepia');
  };

  const currentChapterTitle = tableOfContents.find(toc => toc.chapter === currentChapter)?.title || `Chapter ${currentChapter}`;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : theme === 'sepia' ? 'bg-amber-50 text-gray-900' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Details
          </Button>
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        {/* Content */}
        <Card className="p-8 mb-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div
              className="prose max-w-none"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
              }}
            >
              <h2 className="text-2xl font-bold mb-8">{currentChapterTitle}</h2>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={handlePrevChapter}
            disabled={currentChapter === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Chapter
          </Button>
          <span className="text-sm text-gray-500">
            Chapter {currentChapter} of {book.pages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextChapter}
            disabled={currentChapter === book.pages}
          >
            Next Chapter
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Settings */}
        <Card className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Settings className="w-4 h-4" />
            <h3 className="font-semibold">Reading Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Font Size</Label>
              <Slider
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                min={12}
                max={24}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Line Height</Label>
              <Slider
                value={[lineHeight]}
                onValueChange={handleLineHeightChange}
                min={1}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Theme</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </Button>
                <Button
                  variant={theme === 'sepia' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('sepia')}
                >
                  Sepia
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <Card className="p-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label>Reading Progress</Label>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${(currentChapter / book.pages) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round((currentChapter / book.pages) * 100)}% complete
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 