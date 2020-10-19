import { Theme } from '@nivo/core';

export const chartTheme: Theme = {
  axis: { ticks: { line: { strokeWidth: 1 }, text: { fontSize: 12 } } },
  grid: { line: { stroke: 'var(--palette-grey-300)', strokeWidth: 1, strokeDasharray: '1 3' } },
  markers: { lineStrokeWidth: 1 },
};
