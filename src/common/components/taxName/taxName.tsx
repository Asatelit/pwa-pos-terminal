import React from 'react';
import { Tax } from 'common/types';

export type TaxNameProps = {
  taxId: string; // Nodes passed into the SVG element.
  taxes: Tax[];
  className?: string; // Add a custom class name
};

export default function TaxName({ taxId, taxes, className = '' }: TaxNameProps) {
  const tax = taxes.find((tax) => tax.id === taxId);
  if (!tax) return null;
  return <span className={className}>{`${tax.name} (${tax.precentage}%)`}</span>;
}
