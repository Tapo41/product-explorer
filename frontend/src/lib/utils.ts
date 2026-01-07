import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

export function saveToHistory(path: Record<string, any>, title?: string, url?: string): void {
  if (typeof window === 'undefined') return;
  
  const history = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
  history.unshift({
    path,
    title,
    url,
    timestamp: new Date().toISOString(),
  });
  
  // Keep only last 50 items
  localStorage.setItem('browsingHistory', JSON.stringify(history.slice(0, 50)));
}

export function getHistory(): any[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('browsingHistory') || '[]');
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('browsingHistory');
}