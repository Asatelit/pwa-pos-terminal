import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const [t] = useTranslation();
  return (
    <div className={styles.root}>
      <div className={styles.left} />
      <div className={styles.right}>
        <button className={styles.menuBtn} onClick={() => onOpenReport()}>
          {t('terminal.dailyReport.menuLabel')}
        </button>
        <button className={styles.menuBtn} onClick={() => onOpenDrawer()}>
          <MenuTwoTone />
        </button>
      </div>
    </div>
  );
};

export default Menu;
