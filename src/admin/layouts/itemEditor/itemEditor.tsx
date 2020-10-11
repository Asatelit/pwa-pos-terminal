import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Routes } from 'common/enums';
import { encodeImage, setDocumentTitle } from 'common/utils';
import { ArrowLeftTwoTone } from 'common/icons';
import { Category, Item, Tax, AppActions } from 'common/types';
import { getItemEntity, getItemById } from 'common/assets';
import { CategoryPicker } from '../../components';
import { CommonLayout } from '../index';
import styles from './itemEditor.module.css';

type ItemEditorProps = {
  items: Item[];
  categories: Category[];
  taxes: Tax[];
  actions: AppActions;
};

const ItemEditor: React.FC<ItemEditorProps> = ({ items, categories, taxes, actions }) => {
  const { id } = useParams<{ id: string }>();
  const [t] = useTranslation();

  useEffect(() => {
    const title = [t('admin.title'), t(id ? 'admin.itemEditor.editItemTitle' : 'admin.itemEditor.addItemTitle')];
    setDocumentTitle(title);
  }, [t, id]);

  const initialState = id ? getItemById(items, id) : getItemEntity();

  const [item, setItem] = useState<Item>(initialState);
  const [redirect, setRedirect] = useState('');
  const [isPickerShown, togglePicker] = useState(false);

  // Helpers
  const selectedCategoryName = categories.find((entity) => entity.id === item.parentId)?.name || t('common.homeScreen');
  const updateItem = (data: Partial<Item>) => setItem({ ...item, ...data });
  const isInvalid = !item.name;

  const handleOnChangeCategoryPicker = (categoryId: string | null) => updateItem({ parentId: categoryId });

  const handleOnClickOnPrimaryBtn = () => {
    actions.item.update(item);
    setRedirect(Routes.AdminItemList);
  };

  if (redirect) return <Redirect to={redirect} />;

  const renderTaxList = () => {
    const taxList = taxes.filter((tax) => tax.isEnabled);
    if (!taxList.length) return null;
    return (
      <div className="mb-4">
        <div className="form-label">{t('admin.itemEditor.taxesLabel')}</div>
        {taxList.map((tax) => (
          <div key={`ItemEditorTax_${tax.id}`} className={styles.switch}>
            <input
              type="checkbox"
              id={`ItemEditorTax_${tax.id}`}
              checked={item.taxes.includes(tax.id)}
              onChange={(evt) =>
                updateItem({
                  taxes: evt.target.checked
                    ? [...item.taxes, tax.id]
                    : [...item.taxes.filter((item) => item !== tax.id)],
                })
              }
            />
            <label htmlFor={`ItemEditorTax_${tax.id}`}>{`${tax.name} (${tax.precentage}%)`}</label>
          </div>
        ))}
      </div>
    );
  };

  const renderHead = (
    <Fragment>
      <Link className="btn btn-link" to={Routes.AdminItemList}>
        <ArrowLeftTwoTone />
      </Link>
      <div className={styles.title}>
        {id ? t('admin.itemEditor.editItemTitle') : t('admin.itemEditor.addItemTitle')}
      </div>
    </Fragment>
  );

  const renderBody = (
    <form>
      <div className="mb-4">
        <label className="form-label" htmlFor="ItemEditorName">
          {t('admin.itemEditor.nameLabel')}
        </label>
        <input
          id="ItemEditorName"
          type="text"
          className="form-control"
          value={item.name}
          onChange={(evt) => updateItem({ name: evt.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="ItemEditorCategory">
          {t('admin.itemEditor.categoryLabel')}
        </label>
        <div className={styles.controlGroup}>
          <input
            readOnly
            type="text"
            id="ItemEditorCategory"
            className={`${styles.controlInput} ${isPickerShown ? 'focus' : ''}`}
            value={selectedCategoryName}
            onClick={() => togglePicker(true)}
          />
          {isPickerShown && (
            <CategoryPicker
              className={styles.picker}
              categories={categories}
              parent={item.parentId}
              selected={item.id}
              onChange={handleOnChangeCategoryPicker}
              onClose={() => togglePicker(false)}
            />
          )}
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="ItemEditorPrice">
          {t('admin.itemEditor.priceLabel')}
        </label>
        <input
          type="number"
          className="form-control"
          id="ItemEditorPrice"
          placeholder={t('admin.itemEditor.priceLabel')}
          value={item.price}
          onChange={(evt) => updateItem({ price: parseFloat(evt.target.value) })}
        />
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="ItemEditorCostPrice">
          {t('admin.itemEditor.costPriceLabel')}
        </label>
        <input
          type="number"
          className="form-control"
          id="ItemEditorCostPrice"
          placeholder={t('admin.itemEditor.costPriceLabel')}
          value={item.costPrice}
          onChange={(evt) => updateItem({ costPrice: parseFloat(evt.target.value) })}
        />
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="ItemEditorColor">
          {t('admin.itemEditor.colorLabel')}
        </label>
        <select
          id="ItemEditorColor"
          className="form-control"
          value={item.color || 'transparent'}
          onChange={(evt) => updateItem({ color: evt.target.value })}
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
        <label className="form-label" htmlFor="ItemEditorColor">
          {t('admin.itemEditor.imageLabel')}
        </label>
        {!item.picture && (
          <input
            type="file"
            className="form-control"
            onChange={(evt) => encodeImage(evt, (picture) => updateItem({ picture }))}
          />
        )}
        {!!item.picture && (
          <button className={styles.secondaryAction} onClick={() => updateItem({ picture: '' })}>
            {t('common.remove')}
          </button>
        )}
      </div>
      {renderTaxList()}
      <div className="mb-4">
        <div className="form-label" />
        <button className={styles.primaryAction} disabled={isInvalid} onClick={handleOnClickOnPrimaryBtn}>
          {id ? t('common.update') : t('common.add')}
        </button>
      </div>
    </form>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default ItemEditor;
