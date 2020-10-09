import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderTwoTone, MenuRightTwoTone, MenuDownTwoTone } from 'common/icons';
import { Entities } from 'common/enums';
import { Category } from 'common/types';
import styles from './categoryPicker.module.css';

type CategoryPickerProps = {
  categories: Category[];
  onChange: (categoryId: string) => void;
  onClose: () => void;
  selected: string;
  parent?: string | null;
  className?: string;
  removeMode?: boolean;
};

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  onChange,
  onClose,
  className = '',
  selected,
  parent = Entities.RootCategoryId,
  removeMode = false,
}) => {
  const [t] = useTranslation();

  const getInitialExpandedNodes = () => {
    const nodes: string[] = [Entities.RootCategoryId];

    const findExpandedNode = (nodeId: string | null) => {
      if (!nodeId || nodeId === Entities.RootCategoryId) return;
      const parent = categories.find(entry => nodeId === entry.id);
      if (!parent) return;
      nodes.push(parent.id);
      findExpandedNode(parent.parentId);
    };

    findExpandedNode(selected);
    return nodes;
  };

  const [expandedNodes, setExpandedNodes] = useState<any[]>(getInitialExpandedNodes());

  const handleOnClickOnToggle = (event: React.MouseEvent<HTMLDivElement>, categoryId: string) => {
    event.stopPropagation();
    const isExpanded = expandedNodes.includes(categoryId);
    setExpandedNodes(isExpanded ? expandedNodes.filter(i => i !== categoryId) : [...expandedNodes, categoryId]);
  };

  const handleOnClickOnItem = (event: React.MouseEvent<HTMLDivElement>, categoryId: string) => {
    event.stopPropagation();
    if (categoryId !== selected) onChange(categoryId);
    onClose();
  };

  const getCategories = (id: string = Entities.RootCategoryId, level: number = 0) => {
    const data = categories.filter(cat => id === cat.parentId && !cat.isDeleted);
    if (!data.length) return null;
    return <Fragment>{data.map(entity => renderItem(entity.id, entity.name, level))}</Fragment>;
  };

  const renderItem = (id: string, name: string, level: number = 0) => {
    const child = getCategories(id, level + 1);
    const isExpanded = expandedNodes.includes(id);
    const isDisabled = removeMode && id !== Entities.RootCategoryId && id === selected;
    const toggleIcon = isExpanded ? <MenuDownTwoTone /> : <MenuRightTwoTone />;
    const activeClass = id === parent ? styles.infoActive : '';

    if (isDisabled) return null;

    return (
      <div key={`${id}`} className={styles.item} onClick={event => handleOnClickOnItem(event, id)}>
        <div className={`${styles.info} ${activeClass}`} style={{ paddingLeft: `${level}rem` }}>
          <div className={styles.toggle} onClick={event => handleOnClickOnToggle(event, id)}>
            {!!React.Children.count(child) && toggleIcon}
          </div>
          <div className={styles.icon}>
            <FolderTwoTone />
          </div>
          <div className={styles.name}>{name}</div>
        </div>
        {isExpanded && <div className={styles.children}>{child}</div>}
      </div>
    );
  };

  return <div className={`${styles.root} ${className}`}>{renderItem(Entities.RootCategoryId, t('common.homeScreen'))}</div>;
};

export default CategoryPicker;
