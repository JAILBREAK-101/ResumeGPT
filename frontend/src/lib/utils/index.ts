import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ReCaptcha Helper Function
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

// Input and Style Functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Constant Utilities
export function formatTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds();
  const ms = Math.floor(date.getUTCMilliseconds() / 10);

  return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')},${ms.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  const yy = date.getUTCFullYear();
  const mm = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const dd = date.getUTCDate().toString().padStart(2, '0');

  return `${yy}-${mm}-${dd}`;
}