import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// https://github.com/sindresorhus/classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
