import {getTextIdentifier, isExist, capitalizeFirstLetter, average, calcSum} from './helpers';

describe('Test "getTextIdentifier" helper:', () => {
  test.each([['coffee latte', 'cl'], ['coffee', 'co'], ['coffee latte cappuccino', 'cl']])(
    'given %p as argument, returns %p',
    (str, expected) => {
      expect(getTextIdentifier(str)).toBe(expected);
    },
  );
});

describe('Test "isExist" helper:', () => {
  test.each`
    arg     | expected
    ${10}   | ${true}
    ${0}    | ${true}
    ${-1}   | ${false}
    ${-10}  | ${false}
  `('given $arg as argument, returns $expected', ({ arg, expected }) => {
    expect(isExist(arg)).toBe(expected);
  });
});

describe('Test "capitalizeFirstLetter" helper:', () => {
  test.each`
    arg                 | expected
    ${'test'}           | ${'Test'}
    ${'Test'}           | ${'Test'}
    ${'first letter'}   | ${'First letter'}
  `('given "$arg" as argument, returns "$expected"', ({ arg, expected }) => {
    expect(capitalizeFirstLetter(arg)).toBe(expected);
  });
});

describe('Test "calcSum" helper:', () => {
  const arr = [{ a: 1, b: 2, c: 3 }, { a: 1.1, b: 2.2, c: '3.3' }];
  test.each`
    array   | prop           | expected
    ${arr}  | ${''}                  | ${0}
    ${arr}  | ${'b'}        | ${4.2}
    ${arr}  | ${'a'}        | ${2.1}
    ${arr}  | ${'c'}        | ${3}
    ${[]}   | ${'a'}        | ${0}
    ${[]}   | ${''}         | ${0}
  `('given "$array" as array of objects and "$prop" as a property name, returns "$expected"', ({ array, prop, expected }) => {
    expect(calcSum<{a: number, b: number, c: unknown}>(array, prop)).toBe(expected);
  });
});

describe('Test "average" helper:', () => {
  test.each`
    arg                                 | expected
    ${[0]}                              | ${0}
    ${[0, 0, 0]}                        | ${0}
    ${[0, 10, 20]}                      | ${10}
    ${[0, 10.25, 20.76]}                | ${10.336666666666668}
    ${[10, 2, 38, 23, 38, 23, 21]}      | ${22.142857142857142}
  `('given "$arg" as argument, returns "$expected"', ({ arg, expected }) => {
    expect(average(arg)).toBe(expected);
  });
});
