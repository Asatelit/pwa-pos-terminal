import React, { Fragment } from 'react';
import { AccountDetailsTwoTone, ChevronRightTwoTone } from 'icons';
import styles from './drawer.module.css';

type DrawerProps = {
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ onClose }) => {
  const handleOnClickOnClose = () => onClose();
  const handleOnClickOnBackdrop = () => onClose();

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.head}>
          <button className={styles.menuBtn} onClick={handleOnClickOnClose}>
            <ChevronRightTwoTone />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.menuItem}>
            <div className={styles.menuIcon}>
              <AccountDetailsTwoTone />
            </div>
            <div className={styles.menuLabel}>Admin</div>
          </div>
        </div>
      </div>
      <div className={styles.backdrop} onClick={handleOnClickOnBackdrop} />
    </Fragment>
  );
};

export default Drawer;
