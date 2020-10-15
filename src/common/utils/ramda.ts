import { sum, pluck, median } from 'ramda';

export const sumByProp = <T>(prop: string, list: T[]): number => sum(pluck(prop, list)) || 0;

export const medianByProp = <T>(prop: string, list: T[]): number => median(pluck(prop, list)) || 0;
