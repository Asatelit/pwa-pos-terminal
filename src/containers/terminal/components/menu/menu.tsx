import React from 'react';
import { MenuTwoTone } from 'icons';
import styles from './menu.module.css';

type MenuProps = {
  onOpenDrawer: () => void;
}

const Menu: React.FC<MenuProps> = ({ onOpenDrawer }) => {
  const handleOnClickOnDrawerBtn = () => onOpenDrawer();
  return (
    <div className={styles.root}>
      <div className={styles.left} />
      <div className={styles.right}>
        <button className={styles.menuBtn} onClick={handleOnClickOnDrawerBtn}>
          <MenuTwoTone />
        </button>
      </div>
    </div>
  );
};

export default Menu;
