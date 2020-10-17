import React from 'react';

export type PercentageChangeProps = {
  base: number; // First and original number
  peak: number; // Second new number to differentiate
  className?: string;
};

export const PercentageChange: React.FC<PercentageChangeProps> = ({ base, peak, className = '' }) => {
  const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;
  const render = (value: string, color = 'inherit') => <span style={{ color }} className={className}>{value}</span>;
  if (base === peak) return render(`0.0%`);
  if (base !== 0 && base < peak) return render(`↑ ${round(((peak - base) / base) * 100)}%`, 'var(--palette-success-dark)');
  if (base !== 0 && base > peak) return render(`↓ ${round(((base - peak) / base) * 100)}%`, 'var(--palette-error-dark)');
  return render(' – ');
};
