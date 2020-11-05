/** Make only some properties optional */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type DateRange = { start: Date; end: Date };
