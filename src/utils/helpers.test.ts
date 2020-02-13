import { getTextIdentifier, isExist, capitalizeFirstLetter } from './helpers';

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
