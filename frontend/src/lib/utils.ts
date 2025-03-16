import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Комбинира CSS класове с помощта на clsx и tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Форматира дата до локализиран стринг
 */
export function formatDate(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Съкращава текст до определена дължина
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Генерира уникално ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Удобна функция за забавяне (sleep)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Форматира година до текст (напр. "1984 г.")
 */
export function formatYear(year: number): string {
  return `${year} г.`;
} 