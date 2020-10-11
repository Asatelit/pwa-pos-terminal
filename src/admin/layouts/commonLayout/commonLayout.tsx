import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchTwoTone } from 'common/icons';
import styles from './commonLayout.module.css';

export type CommonLayoutProps = {
  head: ReactNode;
  body: ReactNode;
  isFilterable?: boolean;
  filterValue?: string;
  onChangeFilterValue?: (value: string) => void;
};

export const CommonLayout: React.FC<CommonLayoutProps> = ({
  head,
  body,
  isFilterable = false,
  filterValue = '',
  onChangeFilterValue = () => null,
}) => {
  const [t] = useTranslation();
  return (
    <div className="container px-5">
      <div className={styles.head}>
        <div className={styles.primary}>{head}</div>
        <div className={styles.secondary}>
          {isFilterable && (
            <div className="input-group mb-4">
              <span className="input-group-text">
                <SearchTwoTone color="inherit" />
              </span>
              <input
                type="text"
                className="form-control"
                aria-label={t('common.searchLabel')}
                placeholder={t('common.searchProperyPlaceholder')}
                value={filterValue}
                onChange={(evt) => onChangeFilterValue(evt.target.value)}
              />
              {filterValue && (
                <button className="btn btn-outline-secondary" type="button" onClick={() => onChangeFilterValue('')}>
                  {t('common.clear')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.body}>{body}</div>
    </div>
  );
};
