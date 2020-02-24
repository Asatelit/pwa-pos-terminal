import React, { useEffect, useState } from 'react';
import { ArrowLeftTwoTone } from 'icons';
import { Category, TerminalServices } from 'types';
import { newCategory, NewCategory, getCategoryById } from 'hooks';
import CategoryPicker from '../categoryPicker/categoryPicker';
import styles from './categoryEditor.module.css';

type CreateItemFormProps = {
  categories: Category[];
  services: TerminalServices;
  onClose: () => void;
  itemId?: number;
};

const CategoryEditor: React.FC<CreateItemFormProps> = ({ categories, services, onClose, itemId }) => {
  const initialState: NewCategory = {
    name: '',
    parentId: 0,
    color: null,
    picture: null,
  };

  const [state, setState] = useState<NewCategory>(initialState);
  const [isPickerShown, togglePicker] = useState(false);
  const updateState = (data: Partial<NewCategory>) => setState({ ...state, ...data });

  // helpers
  const isEditor = !!itemId;
  const hasInvalidData = !state.name;
  const selectedCategoryName = categories.find(item => item.id === state.parentId)?.name || 'Home Screen';
  const createCategory = () => services.addCategory(newCategory(state));
  const editCategory = (category: Category) => services.updateCategory(category);

  useEffect(() => {
    if (!itemId) return;
    const { name, parentId, color, picture } = getCategoryById(categories, itemId);
    setState({ name, parentId, color, picture });
  }, [itemId]);

  // handlers
  const handleOnChangeCategoryPicker = (categoryId: number) => updateState({ parentId: categoryId });
  const handleOnClickOnClose = () => onClose();
  const handleOnClickOnPrimaryAction = () => {
    if (isEditor && itemId) {
      const category = getCategoryById(categories, itemId);
      editCategory({ ...category, ...state });
    } else {
      createCategory();
    }
    onClose();
  };

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <button className={styles.closeBtn} onClick={handleOnClickOnClose}>
          <ArrowLeftTwoTone />
          <span>Back</span>
        </button>
        <div className={styles.itemInfo}>
          <span className={styles.itemName}>{isEditor ? 'Edit Category' : 'New Category'}</span>
        </div>
      </div>
      <div className={styles.form}>
        <div className={styles.control}>
          <label className={styles.controlLabel} htmlFor="ItemFormName">
            Name
          </label>
          <input
            id="ItemFormName"
            type="text"
            className={styles.controlInput}
            value={state.name}
            onChange={evt => updateState({ name: evt.target.value })}
          />
        </div>
        <div className={styles.control}>
          <label className={styles.controlLabel} htmlFor="ItemFormName">
            Category
          </label>
          <div className={styles.controlGroup}>
            <input
              readOnly
              type="text"
              id="CreateCategoryFormCategoryNameField"
              className={`${styles.controlInput} ${isPickerShown ? 'focus' : ''}`}
              value={selectedCategoryName}
              onClick={() => togglePicker(!isPickerShown)}
            />
            {isPickerShown && (
              <CategoryPicker
                removeMode
                className={styles.picker}
                categories={categories}
                selected={itemId}
                onChange={handleOnChangeCategoryPicker}
                onClose={() => togglePicker(false)}
              />
            )}
          </div>
        </div>
        <div className={styles.control}>
          <label className={styles.controlLabel} htmlFor="ItemFormName">
            Color
          </label>
          <select
            className={styles.controlInput}
            value={state.color || 'transparent'}
            onChange={evt => updateState({ color: evt.target.value })}
          >
            <optgroup label="Please specify the color">
              <option value="transparent">Default</option>
              <option value="salmon">Salmon</option>
              <option value="red">Red</option>
              <option value="coral">Coral</option>
              <option value="tomato">Tomato</option>
              <option value="gold">Gold</option>
              <option value="orange">Orange</option>
            </optgroup>
          </select>
        </div>
        <div className={styles.control}>
          <div className={styles.controlLabel} />
          <button className={styles.primaryAction} disabled={hasInvalidData} onClick={handleOnClickOnPrimaryAction}>
            { isEditor ? 'Update' : 'Add' }
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;
