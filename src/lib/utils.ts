import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function range(n: number, spacing?: number | undefined) {
  return new Array(n).fill(0).map((_, i) => i + (spacing ? spacing - 1 : 0));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
