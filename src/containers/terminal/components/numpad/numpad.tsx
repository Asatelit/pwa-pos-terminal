import React from 'react';
import { BackspaceOutlineTwoTone } from 'icons/index';
import styles from './numpad.module.css';

export type ValueProps = {
  [inputId: string]: string;
}

type NumpadProps = {
  inputId: string;
  onChange: (data: ValueProps) => void;
}

const Numpad: React.FC<NumpadProps> = ({ inputId, onChange }) => {
  const inputEl = document.getElementById(inputId) as HTMLInputElement | null;

  const handleChangeValue = (val: string) => {
    if (!inputEl || inputEl.value === undefined) return;
    let updValue = inputEl.value;

    if (val === 'Backspace') updValue = updValue.length ? updValue.slice(0, -1) : '0';
    else if (val === '.') updValue = updValue.includes('.') ? updValue : `${updValue}.`;
    else updValue = `${updValue === '0' ? '' : updValue}${val}`;

    inputEl.value = updValue;
    if (val !== '.') onChange({ [inputId]: updValue });
  };

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.col} onClick={() => handleChangeValue('7')}>7</div>
        <div className={styles.col} onClick={() => handleChangeValue('8')}>8</div>
        <div className={styles.col} onClick={() => handleChangeValue('9')}>9</div>
      </div>
      <div className={styles.row}>
        <div className={styles.col} onClick={() => handleChangeValue('4')}>4</div>
        <div className={styles.col} onClick={() => handleChangeValue('5')}>5</div>
        <div className={styles.col} onClick={() => handleChangeValue('6')}>6</div>
      </div>
      <div className={styles.row}>
        <div className={styles.col} onClick={() => handleChangeValue('1')}>1</div>
        <div className={styles.col} onClick={() => handleChangeValue('2')}>2</div>
        <div className={styles.col} onClick={() => handleChangeValue('3')}>3</div>
      </div>
      <div className={styles.row}>
        <div className={styles.col} onClick={() => handleChangeValue('.')}>.</div>
        <div className={styles.col} onClick={() => handleChangeValue('0')}>0</div>
        <div className={styles.col} onClick={() => handleChangeValue('Backspace')}>
          <BackspaceOutlineTwoTone fontSize="inherit" />
        </div>
      </div>
    </div>
  );
};

export default Numpad;
