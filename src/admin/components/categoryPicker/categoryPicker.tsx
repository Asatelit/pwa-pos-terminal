import React, { useState, Fragment } from 'react';
import { FolderTwoTone, MenuRightTwoTone, MenuDownTwoTone } from 'common/icons';
import { Category } from 'common/types';
import { getCategoryById } from 'common/assets';
import styles from './categoryPicker.module.css';

type CategoryPickerProps = {
  categories: Category[];
  onChange: (categoryId: string | null) => void;
  onClose: () => void;
  className?: string;
  selected?: string | null;
  removeMode?: boolean;
};

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  onChange,
  onClose,
  className = '',
  selected = null,
  removeMode = false,
}) => {
  const getInitialExpandedNodes = () => {
    const nodes: any[] = [null];
    const getExpandedNode = (nodeId: string | null) => {
      if (nodeId === null) return;
      const parentId = categories.find(entry => nodeId === entry.id);
      if (parentId) {
        nodes.push(parentId.id);
        getExpandedNode(parentId.parentId);
      }
    };
    getExpandedNode(selected);
    return nodes;
  };

  const [expandedNodes, setExpandedNodes] = useState<any[]>(getInitialExpandedNodes());
  const parentNode = selected ? getCategoryById(categories, selected).parentId : null;

  const handleOnClickOnToggle = (event: React.MouseEvent<HTMLDivElement>, categoryId: string | null) => {
    event.stopPropagation();
    const isExpanded = expandedNodes.includes(categoryId);
    setExpandedNodes(isExpanded ? expandedNodes.filter(i => i !== categoryId) : [...expandedNodes, categoryId]);
  };

  const handleOnClickOnItem = (event: React.MouseEvent<HTMLDivElement>, categoryId: string | null) => {
    event.stopPropagation();
    if (categoryId !== selected) onChange(categoryId);
    onClose();
  };

  const getCategories = (id: string | null = null, level: number = 0) => {
    const data = categories.filter(cat => id === cat.parentId && !cat.isDeleted);
    if (!data.length) return null;
    return <Fragment>{data.map(entity => renderItem(entity.id, entity.name, level))}</Fragment>;
  };

  const renderItem = (id: string | null, name: string, level: number = 0) => {
    const child = getCategories(id, level + 1);
    const isExpanded = expandedNodes.includes(id);
    const isDisabled = id === selected;
    const toggleIcon = isExpanded ? <MenuDownTwoTone /> : <MenuRightTwoTone />;
    const activeClass = id === parentNode ? styles.infoActive : '';
    if (removeMode && isDisabled) return null;
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

  return <div className={`${styles.root} ${className}`}>{renderItem(null, 'Home Screen')}</div>;
};

export default CategoryPicker;
