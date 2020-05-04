export type Table = {
  id: string;
  seats: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'square' | 'rectangle' | 'triangle' | 'diamond' | 'circle' | 'oval';
  hallId: number;
  isHidden: boolean;
  lastModifiedTime: number;
};
