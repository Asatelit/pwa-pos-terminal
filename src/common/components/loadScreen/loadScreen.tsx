import React from 'react';
import styles from './loadScreen.module.css';

const LoadScreen: React.FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.load}>
        <div className={styles.loadItem} />
        <div className={styles.loadItem} />
        <div className={styles.loadItem} />
      </div>
    </div>
  );
};

export default LoadScreen;
