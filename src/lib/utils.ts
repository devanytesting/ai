// Utility: merge conditional Tailwind class strings safely
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn: Conditional className combiner with Tailwind-aware merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
