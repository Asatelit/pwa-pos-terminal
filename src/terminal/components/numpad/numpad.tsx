import React, { useEffect, useCallback } from 'react';
import { formatMoney, toFixed } from 'accounting';
import { BackspaceOutlineTwoTone } from 'common/icons/index';
import styles from './numpad.module.css';

type NumpadProps = {
  value?: string;
  expected?: number;
  onChange: (value: string) => void;
};

const Numpad: React.FC<NumpadProps> = ({ onChange, value = '0.00', expected = 0 }) => {
  const denominations = [
    { amount: 1, value: '100' },
    { amount: 2, value: '200' },
    { amount: 5, value: '500' },
    { amount: 10, value: '1000' },
    { amount: 20, value: '2000' },
    { amount: 50, value: '5000' },
    { amount: 100, value: '10000' },
  ];

  const suggestion = expected === 0 ? [] : denominations.filter((item) => item.amount >= expected);

  const handleChangeValue = useCallback((key: string) => {
    let result;
    const pure = value.split('.').join('');

    if (key === 'Backspace') {
      result = pure.length && pure !== '000' ? pure.slice(0, -1) : '000';
    } else {
      result = pure + key;
    }

    const integers = result.slice(0, -2);
    const tenths = result.substring(result.length - 2);

    onChange(`${integers}.${tenths}`);
  }, [onChange, value]);

  useEffect(() => {
    const allowedKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'];
    const onKeyPress = (e: KeyboardEvent) => {
      if (allowedKeys.includes(e.key)) handleChangeValue(e.key);
    };

    document.addEventListener('keydown', onKeyPress, false);

    return () => {
      document.removeEventListener('keydown', onKeyPress, false);
    };
  }, [value, handleChangeValue]);

  const onClickOnSuggestion = (amount: string) => {
    const integers = amount.slice(0, -2);
    const tenths = amount.substring(amount.length - 2);

    onChange(`${integers}.${tenths}`);
  };

  return (
    <div className={styles.root}>
      <div className="row mb-4">
        {suggestion.map((item, index) => (
          <div
            key={`${index}_${item.value}`}
            className="col-sm m-1 btn btn-outline-primary text-nowrap"
            onClick={() => onClickOnSuggestion(item.value)}
          >
            {formatMoney(item.amount)}
          </div>
        ))}
        {!!expected && (
          <div
            className="col-sm m-1 btn btn-outline-primary text-nowrap"
            onClick={() => onClickOnSuggestion(toFixed(expected).toString().split('.').join(''))}
          >
            {formatMoney(expected)}
          </div>
        )}
      </div>
      <div className="row">
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('7')}>
          7
        </div>
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('8')}>
          8
        </div>
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('9')}>
          9
        </div>
      </div>
      <div className="row">
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('4')}>
          4
        </div>
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('5')}>
          5
        </div>
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('6')}>
          6
        </div>
      </div>
      <div className="row">
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('1')}>
          1
        </div>
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('2')}>
          2
        </div>
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('3')}>
          3
        </div>
      </div>
      <div className="row">
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('0')}>
          0
        </div>
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('00')}>
          00
        </div>
        <div className={`col ${styles.button}`} onClick={() => handleChangeValue('Backspace')}>
          <BackspaceOutlineTwoTone fontSize="inherit" />
        </div>
      </div>
    </div>
  );
};

export default Numpad;
