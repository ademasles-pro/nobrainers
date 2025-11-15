import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind CSS classes safely
 * Prevents conflicts between utility classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

