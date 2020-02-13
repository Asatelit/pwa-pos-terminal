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

// formats a number using fixed-point notation.
export function financial(num: number): string {
  return `${num.toFixed(2)} $`;
}
