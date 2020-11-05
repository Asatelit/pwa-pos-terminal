import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseTwoTone } from 'common/icons';
import styles from './search.module.css';

type SearchProps = {
  onChange: (searchTerm: string) => void;
};

type SearchState = {
  isExpanded: boolean;
  searchTerm: string;
};

const Search: React.FC<SearchProps> = ({ onChange }) => {
  const [t] = useTranslation();
  const [state, setState] = useState<SearchState>({ isExpanded: false, searchTerm: '' });
  const { searchTerm, isExpanded } = state;

  const expandSearch = () => {
    setState({ isExpanded: true, searchTerm: '' });
    onChange('');
  };

  const clearSearchTerm = () => {
    setState({ isExpanded: false, searchTerm: '' });
    onChange('');
  };

  const updateSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setState({ ...state, searchTerm: term });
    onChange(term);
  };

  const renderCollapsed = (
    <button className="btn btn-light" onClick={expandSearch}>
      {t('common.search')}
    </button>
  );

  const renderExpanded = (
    <Fragment>
      <button className={styles.cancel} onClick={clearSearchTerm}>
        <CloseTwoTone />
      </button>
      <input type="text" autoFocus className="form-control" value={searchTerm} onChange={updateSearchTerm} />
    </Fragment>
  );

  return (
    <div className={`${styles.root} ${isExpanded ? styles.expanded : ''}`}>
      {isExpanded ? renderExpanded : renderCollapsed}
    </div>
  );
};

export default Search;
