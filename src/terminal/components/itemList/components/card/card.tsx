import React from 'react';
import { getTextIdentifier, financial } from 'common/utils';
import styles from './card.module.css';

type CardProps = {
  label: string;
  color: string | null;
  picture: string | null;
  price?: number;
  onClick?: (e: React.MouseEvent) => void
};

const Card: React.FC<CardProps> = ({ label, children, picture, color, price, onClick }) => {
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
        {price !== undefined && <div className={styles.price}>{financial(price)}</div>}
      </div>
    </div>
  );
};

export default Card;
