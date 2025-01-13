import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAreas() {
  const response = fetch(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/areas'
      : 'https://spot-sales-prediction-1.onrender.com/areas',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => data.areas);

  return response;
}
