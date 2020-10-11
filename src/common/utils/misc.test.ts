import { getTextIdentifier, isExist, capitalizeFirstLetter, average, calcSum, mergeAndSum } from './misc';

describe('Test "getTextIdentifier" helper:', () => {
  test.each([
    ['coffee latte', 'cl'],
    ['coffee', 'co'],
    ['coffee latte cappuccino', 'cl'],
  ])('given %p as argument, returns %p', (str, expected) => {
    expect(getTextIdentifier(str)).toBe(expected);
  });
});

describe('Test "isExist" helper:', () => {
  test.each`
    arg    | expected
    ${10}  | ${true}
    ${0}   | ${true}
    ${-1}  | ${false}
    ${-10} | ${false}
  `('given $arg as argument, returns $expected', ({ arg, expected }) => {
    expect(isExist(arg)).toBe(expected);
  });
});

describe('Test "capitalizeFirstLetter" helper:', () => {
  test.each`
    arg               | expected
    ${'test'}         | ${'Test'}
    ${'Test'}         | ${'Test'}
    ${'first letter'} | ${'First letter'}
  `('given "$arg" as argument, returns "$expected"', ({ arg, expected }) => {
    expect(capitalizeFirstLetter(arg)).toBe(expected);
  });
});

describe('Test "calcSum" helper:', () => {
  const arr = [
    { a: 1, b: 2, c: 3 },
    { a: 1.1, b: 2.2, c: '3.3' },
  ];
  test.each`
    array  | prop   | expected
    ${arr} | ${''}  | ${0}
    ${arr} | ${'b'} | ${4.2}
    ${arr} | ${'a'} | ${2.1}
    ${arr} | ${'c'} | ${3}
    ${[]}  | ${'a'} | ${0}
    ${[]}  | ${''}  | ${0}
  `(
    'given "$array" as array of objects and "$prop" as a property name, returns "$expected"',
    ({ array, prop, expected }) => {
      expect(calcSum<{ a: number; b: number; c: unknown }>(array, prop)).toBe(expected);
    },
  );
});

describe('Test "average" helper:', () => {
  test.each`
    arg                            | expected
    ${[0]}                         | ${0}
    ${[0, 0, 0]}                   | ${0}
    ${[0, 10, 20]}                 | ${10}
    ${[0, 10.25, 20.76]}           | ${10.336666666666668}
    ${[10, 2, 38, 23, 38, 23, 21]} | ${22.142857142857142}
  `('given "$arg" as argument, returns "$expected"', ({ arg, expected }) => {
    expect(average(arg)).toBe(expected);
  });
});

describe('Test "mergeAndSum" helper:', () => {
  const arr = [
    { id: 1, other: 'a', val1: 10, val2: 10 },
    { id: 1, other: 'a', val1: 5, val2: 10  },
    { id: 2, other: 'a', val1: 20, val2: 10 },
    { id: 2, other: 'd', val1: 0, val2: 10 },
    { id: 3, other: 'e', val1: 0, val2: 10 },
  ];
  test.each`
    arg1    | arg2        | arg3       | expected
    ${arr}  | ${'id'}     | ${'val1'}  | ${[{ id: 1, sum: 15 }, { id: 2, sum: 20 }, { id: 3, sum: 0 }]}
    ${arr}  | ${'id'}     | ${'val2'}  | ${[{ id: 1, sum: 20 }, { id: 2, sum: 20 }, { id: 3, sum: 10 }]}
    ${arr}  | ${'other'}  | ${'val1'}  | ${[{ other: 'a', sum: 35 }, { other: 'd', sum: 0 }, { other: 'e', sum: 0 }]}
    ${arr}  | ${'other'}  | ${'val2'}  | ${[{ other: 'a', sum: 30 }, { other: 'd', sum: 10 }, { other: 'e', sum: 10 }]}
    ${[]}   | ${'id'}     | ${'val1'}  | ${[]}
  `(
    'given "$arg1" as array of objects with "$arg2" and "$arg3" as a property name, returns "$expected"',
    ({ arg1, arg2, arg3, expected }) => {
      expect(mergeAndSum<any, any>(arg1, arg2, arg3)).toMatchObject(expected);
    },
  );
});
