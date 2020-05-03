import { Tax } from 'common/types';
import { getTimestamp } from 'common/utils';

export default function NewTax(tax?: Tax): Tax {
  return {
    id: getTimestamp(),
    name: tax?.name ?? 'Tax',
    applyToCustomAmounts: tax?.applyToCustomAmounts ?? false,
    isDeleted: tax?.isDeleted ?? false,
    isEnabled: tax?.isEnabled ?? false,
    isIncludedInPrice: tax?.isIncludedInPrice ?? false,
    precentage: tax?.precentage ?? 5,
  };
}
