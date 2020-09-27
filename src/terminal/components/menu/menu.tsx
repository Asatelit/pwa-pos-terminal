import React from 'react';
import { MenuTwoTone } from 'common/icons';
import styles from './menu.module.css';

type MenuProps = {
  onOpenDrawer?: () => void;
  onOpenReport?: () => void;
};

const Menu: React.FC<MenuProps> = ({
  onOpenDrawer = () => null,
  onOpenReport = () => null,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.left} />
      <div className={styles.right}>
        <button className={styles.menuBtn} onClick={() => onOpenReport()}>
          Daily Report
        </button>
        <button className={styles.menuBtn} onClick={() => onOpenDrawer()}>
          <MenuTwoTone />
        </button>
      </div>
    </div>
  );
};

export default Menu;
