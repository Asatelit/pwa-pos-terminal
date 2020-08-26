import { curry, indexBy, chain, merge } from 'ramda';

export const joinInner = curry(<L1, L2>(fn1: any, fn2: any, list1: L1[], list2: L2[]): (L1 & L2)[] => {
  const indexed = indexBy(fn1, list1);
  return chain((t2row) => {
    const corresponding = indexed[fn2(t2row)];
    return corresponding ? [merge(t2row, corresponding)] : [];
  }, list2);
});
