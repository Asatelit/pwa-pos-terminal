import React, { useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { ArrowLeftTwoTone } from 'common/icons';
import { Category, AppActions } from 'common/types';
import { Routes } from 'common/const';
import { encodeImage } from 'common/utils';
import { getCategoryById } from 'common/helpers';
import { newCategory, NewCategory } from 'common/prototypes';
import CategoryPicker from '../../components/categoryPicker/categoryPicker';
import styles from './categoryEditor.module.css';

type CategoryEditorProps = {
  createMode?: boolean;
  categories: Category[];
  actions: AppActions;
};

const CategoryEditor: React.FC<CategoryEditorProps> = ({ categories, actions, createMode = false }) => {
  const initialState: NewCategory = { name: '', parentId: 0, color: null, picture: null };
  const { id: contextCategoryId } = useParams();

  const [isPickerShown, togglePicker] = useState(false);
  const [redirect, setRedirect] = useState('');
  const updateData = (upd: Partial<NewCategory>) => setData({ ...data, ...upd });

  const { id, name, parentId, color, picture } = contextCategoryId
    ? getCategoryById(categories, Number(contextCategoryId))
    : { ...initialState, id: 0 };
  const updData: NewCategory = createMode ? { ...initialState, parentId: id } : { name, parentId, color, picture };
  const [data, setData] = useState<NewCategory>(updData);

  if (!contextCategoryId) setRedirect(Routes.PageBadRequest);

  // handle redirect
  if (redirect) return <Redirect to={redirect} />;

  // helpers
  const hasInvalidData = !data.name;
  const getParentCategory = (id: number) => getCategoryById(categories, id);
  const createCategory = () => actions.category.add(newCategory(data));
  const editCategory = (category: Category) => actions.category.update(category);
  const closeEditor = () =>
    setRedirect(Routes.AdminCategoryList.replace(':id', contextCategoryId ? contextCategoryId.toString() : 'root'));

  // handlers
  const handleOnChangeCategoryPicker = (categoryId: number) => updateData({ parentId: categoryId });
  const handleOnClickOnClose = () => closeEditor();
  const handleOnClickOnPrimaryAction = () => {
    if (!createMode && contextCategoryId) {
      const category = getCategoryById(categories, Number(contextCategoryId));
      editCategory({ ...category, ...data });
    } else {
      createCategory();
    }
    closeEditor();
  };

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <button className={styles.closeBtn} onClick={handleOnClickOnClose}>
          <ArrowLeftTwoTone />
          <span>Back</span>
        </button>
        <div className={styles.itemInfo}>
          <span className={styles.itemName}>{!createMode ? 'Edit Category' : 'New Category'}</span>
        </div>
      </div>
      <div className={styles.form}>
        <div className={styles.control}>
          <label className={styles.controlLabel} htmlFor="CategoryEditorName">
            Name
          </label>
          <input
            id="CategoryEditorName"
            type="text"
            className={styles.controlInput}
            value={data.name}
            onChange={evt => updateData({ name: evt.target.value })}
          />
        </div>
        <div className={styles.control}>
          <label className={styles.controlLabel} htmlFor="CategoryEditorCategory">
            Category
          </label>
          <div className={styles.controlGroup}>
            <input
              readOnly
              type="text"
              id="CategoryEditorCategory"
              className={`${styles.controlInput} ${isPickerShown ? 'focus' : ''}`}
              value={getParentCategory(data?.parentId || 0).name}
              onClick={() => togglePicker(!isPickerShown)}
            />
            {isPickerShown && (
              <CategoryPicker
                removeMode
                className={styles.picker}
                categories={categories}
                selected={Number(contextCategoryId)}
                onChange={handleOnChangeCategoryPicker}
                onClose={() => togglePicker(false)}
              />
            )}
          </div>
        </div>
        <div className={styles.control}>
          <label className={styles.controlLabel} htmlFor="CategoryEditorColor">
            Color
          </label>
          <select
            id="CategoryEditorColor"
            className={styles.controlInput}
            value={data.color || 'transparent'}
            onChange={evt => updateData({ color: evt.target.value })}
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
          <label className={styles.controlLabel} htmlFor="CategoryEditorPicture">
            Picture
          </label>
          {!data.picture && <input
            id="CategoryEditorPicture"
            type="file"
            className={styles.controlInput}
            onChange={evt => encodeImage(evt, (picture) => updateData({ picture }))}
          />}
          {!!data.picture && (
            <button className={styles.secondaryAction} onClick={() => updateData({ picture: '' })}>
              Remove
            </button>
          )}
        </div>
        <div className={styles.control}>
          <div className={styles.controlLabel} />
          <button className={styles.primaryAction} disabled={hasInvalidData} onClick={handleOnClickOnPrimaryAction}>
            {!createMode ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;
