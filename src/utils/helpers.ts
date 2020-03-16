import { ChangeEvent } from 'react';

export function getTextIdentifier(name: string): string {
  const segments = name.split(' ');
  return segments.length > 1
    ? segments
        .map(n => n[0])
        .slice(0, 2)
        .join('')
    : name.slice(0, 2);
}

export function isExist(findIndex: number): boolean {
  return findIndex > -1;
}

export function getTimestamp(): number {
  return new Date().valueOf();
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Formats a number using fixed-point notation.
export function financial(num: number = 0): string {
  return `${num.toFixed(2)} $`;
}

// Calculate the values in an array of objects
export function calcSum<T>(items: T[], propName: keyof T): number {
  return items.reduce((prev, current) => {
    const prop = current[propName] || 0;
    const propValue = typeof prop === 'number' ? prop : 0;
    return prev + propValue;
  }, 0);
}

// Calculate the average of a set of numbers
export function average(items: number[]): number {
  return items.length > 0 ? items.reduce((prev, curr) => prev + curr, 0) / items.length : 0;
}

// Round a number to a specific number of decimal places
// forked from https://github.com/kret13/bankers-round
export function round(num: number, decimalPlaces: number = 0): number {
  const d = decimalPlaces;
  const m = 10 ** d;
  const n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
  const i = Math.floor(n);
  const f = n - i;
  const e = 1e-8; // Allow for rounding errors in f
  const r = f > 0.5 - e && f < 0.5 + e ? i + (i % 2) : Math.round(n);
  return d ? r / m : r;
}

export function encodeImage(event: ChangeEvent<HTMLInputElement>, cb: (base64: string) => void): void {
  if (!event.currentTarget.files?.length) return;
  const file = event.currentTarget.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    const { result } = reader;
    if (typeof result === 'string') {
      cb(result);
    }
  };
  reader.readAsDataURL(file);
}
