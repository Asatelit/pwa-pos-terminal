import React, { useState, useEffect, Fragment } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftTwoTone } from 'common/icons';
import { Category, AppActions } from 'common/types';
import { Routes } from 'common/enums';
import { encodeImage, setDocumentTitle } from 'common/utils';
import { getCategoryEntity, getCategoryById } from 'common/assets';
import CategoryPicker from '../../components/categoryPicker/categoryPicker';
import { CommonLayout } from '../index';
import styles from './categoryEditor.module.css';

type CategoryEditorProps = {
  createMode?: boolean;
  categories: Category[];
  actions: AppActions;
};

const CategoryEditor: React.FC<CategoryEditorProps> = ({ categories, actions, createMode = false }) => {
  const { id: contextCategoryId } = useParams<{ id: string }>();
  const [t] = useTranslation();

  useEffect(() => {
    const title = [
      t('admin.title'),
      t(contextCategoryId ? 'admin.categoryEditor.editTitle' : 'admin.categoryEditor.addTitle'),
    ];
    setDocumentTitle(title);
  }, [t, contextCategoryId]);

  const defaultCategory: Category = getCategoryEntity();
  const [isPickerShown, togglePicker] = useState(false);
  const [redirect, setRedirect] = useState('');
  const updateData = (upd: Partial<Category>) => setData({ ...data, ...upd });

  const category = contextCategoryId ? getCategoryById(categories, contextCategoryId) : defaultCategory;
  const updData: Category = createMode ? { ...defaultCategory, parentId: category.id } : category;
  const [data, setData] = useState<Category>(updData);

  if (!contextCategoryId) setRedirect(Routes.PageBadRequest);

  // handle redirect
  if (redirect) return <Redirect to={redirect} />;

  // helpers
  const hasInvalidData = !data.name;
  const getParentCategory = (id: string | null) => getCategoryById(categories, id);
  const createCategory = () => actions.category.add(getCategoryEntity(data));
  const editCategory = (category: Category) => actions.category.update(category);
  const closeEditor = () =>
    setRedirect(Routes.AdminCategoryList.replace(':id', contextCategoryId ? contextCategoryId.toString() : 'root'));

  // handlers
  const handleOnChangeCategoryPicker = (categoryId: string | null) => updateData({ parentId: categoryId });
  const handleOnClickOnClose = () => closeEditor();
  const handleOnClickOnPrimaryAction = () => {
    if (!createMode && contextCategoryId) {
      const category = getCategoryById(categories, contextCategoryId);
      editCategory({ ...category, ...data });
    } else {
      createCategory();
    }
    closeEditor();
  };

  const renderHead = (
    <Fragment>
      <button className="btn btn-link" onClick={handleOnClickOnClose}>
        <ArrowLeftTwoTone />
      </button>
      <div className={styles.title}>
        {t(createMode ? 'admin.categoryEditor.addTitle' : 'admin.categoryEditor.editTitle')}
      </div>
    </Fragment>
  );

  const renderBody = (
    <form>
      <div className="mb-4">
        <label className="form-label" htmlFor="CategoryEditorName">
          {t('admin.categoryEditor.nameLabel')}
        </label>
        <input
          id="CategoryEditorName"
          type="text"
          className="form-control"
          value={data.name}
          onChange={(evt) => updateData({ name: evt.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="CategoryEditorCategory">
          {t('admin.categoryEditor.categoryLabel')}
        </label>
        <div className={styles.controlGroup}>
          <input
            readOnly
            type="text"
            id="CategoryEditorCategory"
            className={`form-control ${isPickerShown ? 'focus' : ''}`}
            value={getParentCategory(data.parentId).name}
            onClick={() => togglePicker(!isPickerShown)}
          />
          {isPickerShown && (
            <CategoryPicker
              removeMode={!createMode}
              className={styles.picker}
              categories={categories}
              parent={data.parentId}
              selected={data.id}
              onChange={handleOnChangeCategoryPicker}
              onClose={() => togglePicker(false)}
            />
          )}
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="CategoryEditorColor">
          {t('admin.categoryEditor.colorLabel')}
        </label>
        <select
          id="CategoryEditorColor"
          className="form-select w-auto"
          value={data.color || 'transparent'}
          onChange={(evt) => updateData({ color: evt.target.value })}
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
      <div className="mb-4">
        <label className="form-label" htmlFor="CategoryEditorPicture">
          {t('admin.categoryEditor.imageLabel')}
        </label>
        {!data.picture && (
          <input
            id="CategoryEditorPicture"
            type="file"
            className="form-control"
            onChange={(evt) => encodeImage(evt, (picture) => updateData({ picture }))}
          />
        )}
        {!!data.picture && (
          <button className="btn btn-secondary" onClick={() => updateData({ picture: '' })}>
            {t('common.remove')}
          </button>
        )}
      </div>
      <div className="mb-4">
        <button className="btn btn-primary" disabled={hasInvalidData} onClick={handleOnClickOnPrimaryAction}>
          {!createMode ? t('common.update') : t('common.add')}
        </button>
      </div>
    </form>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default CategoryEditor;
