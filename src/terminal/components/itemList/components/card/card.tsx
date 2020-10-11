import React from 'react';
import { AppTranslationHelper } from 'common/types';
import { getTextIdentifier } from 'common/utils';
import styles from './card.module.css';

type CardProps = {
  color: string | null;
  translation: AppTranslationHelper;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  picture: string | null;
  price?: number;
};

const Card: React.FC<CardProps> = ({ translation, label, picture, color, price, onClick }) => {
  const { formatFinancial } = translation;
  const presentation = picture ? (
    <div className={styles.presentation} style={{ backgroundImage: `url(${picture})` }} />
  ) : (
    <div className={styles.presentation} style={{ backgroundColor: color || 'inherit' }}>
      {getTextIdentifier(label)}
    </div>
  );

  return (
    <div className={styles.root} onClick={onClick}>
      {presentation}
      <div className={styles.info}>
        <div className={styles.name}>{label}</div>
        {price !== undefined && <div className={styles.price}>{formatFinancial(price)}</div>}
      </div>
    </div>
  );
};

export default Card;
