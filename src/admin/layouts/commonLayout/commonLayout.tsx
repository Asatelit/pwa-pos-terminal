import React, { ReactNode } from 'react';
import styles from './commonLayout.module.css';

type CommonLayoutProps = {
  head: ReactNode;
  body: ReactNode;
};

const CommonLayout: React.FC<CommonLayoutProps> = ({ head, body }) => {
  return (
    <div>
      <div className={styles.head}>{head}</div>
      <div className="container">
        <div className={styles.form}>{body}</div>
      </div>
    </div>
  );
};

export default CommonLayout;
