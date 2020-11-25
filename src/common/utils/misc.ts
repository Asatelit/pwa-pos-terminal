import { ChangeEvent } from 'react';
import { APP_NAME } from 'config';

export function setDocumentTitle(names: string[]): void {
  document.title = `${APP_NAME} | ${names.join(' | ')}`;
}

export function getTextIdentifier(name: string): string {
  const segments = name.split(' ');
  return segments.length > 1
    ? segments
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
    : name.slice(0, 2);
}

export function isExist(findIndex: number): boolean {
  return findIndex > -1;
}

/** Getting a random integer between two values.
 *  The maximum is inclusive and the minimum is inclusive.
 *  */
export function getRandomInt(min: number, max: number) {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);
  return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
}

export function getTimestamp(date: Date = new Date()): number {
  return date.valueOf();
}

export function generateId(): string {
  const seed = new Uint32Array(4);
  const cryptoObj = window?.crypto || ((window as any).msCrypto as Crypto);
  return cryptoObj.getRandomValues(seed).join('-');
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate the values in an array of objects
export function calcSum<T>(items: T[], propName: keyof T): number {
  return items.reduce((prev, current) => {
    const prop = current[propName] || 0;
    const propValue = typeof prop === 'number' ? prop : 0;
    return prev + propValue;
  }, 0);
}

// Merge array of objects with sum of values;
export function mergeAndSum<T, K extends keyof T>(
  items: T[],
  groupKey: K,
  sumKey: keyof T,
): (Pick<T, K> & { sum: number })[] {
  const result: any = [];
  items.forEach((item) => {
    const updItem = { [groupKey]: item[groupKey], sum: 0 };
    const index = result.findIndex((entity: T) => entity[groupKey] === item[groupKey]);
    if (isExist(index)) return;
    updItem.sum = calcSum<T>(
      items.filter((entity) => entity[groupKey] === item[groupKey]),
      sumKey,
    );
    result.push(updItem);
  });
  return result;
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

export function exportToJsonFile(jsonData: any) {
  const dataStr = JSON.stringify(jsonData);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

  const exportFileDefaultName = 'items.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  linkElement.remove();
}
