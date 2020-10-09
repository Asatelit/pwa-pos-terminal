import React, { Fragment, useState } from 'react';
import { Order, Item, AppActions, AppTranslationHelper } from 'common/types';
import { isExist } from 'common/utils';
import { CloseTwoTone, PlusTwoTone, MinusTwoTone } from 'common/icons';
import styles from './itemEditor.module.css';

type EditorProps = {
  translation: AppTranslationHelper;
  order: Order | null;
  orderItemId: string | null;
  products: Item[];
  services: AppActions;
};

const ItemEditor: React.FC<EditorProps> = ({ translation, orderItemId, order, products, services }) => {
  const getCurrentItem = () => {
    const index = orderItemId && order ? order.items.findIndex((items) => orderItemId === items.id) : -1;
    return order && isExist(index)
      ? {
          index,
          order,
          item: order.items[index],
          instance: products.find((product) => orderItemId === product.id) || null,
        }
      : null;
  };

  // Component state
  const [state, setState] = useState(getCurrentItem());

  // Fallback
  if (!state || !state.instance) {
    services.item.select(null);
    return null;
  }

  const { formatFinancial } = translation;
  const { item, instance, index } = state;

  // Helper that returns an updated order
  const getUpdatedOrder = (updItem = item) => {
    const updOrder = { ...state.order };
    if (updItem.quantity) {
      updOrder.items[index] = { ...updItem };
    } else {
      updOrder.items = updOrder.items.filter((item, itemIndex) => itemIndex !== index);
    }
    return updOrder;
  };

  // Handlers
  const handleQtyIncrement = () => setState({ ...state, item: { ...item, quantity: item.quantity + 1 } });
  const handleQtyDecrement = () => setState({ ...state, item: { ...item, quantity: item.quantity - 1 } });
  const handleQtyChange = (quantity: number) => setState({ ...state, item: { ...item, quantity } });
  const handleNotesChange = (notes: string) => setState({ ...state, order: { ...state.order, notes } });
  const handleRemove = () => services.orders.updateSelected(getUpdatedOrder({ ...item, quantity: 0 }));
  const handleApply = () => services.orders.updateSelected(getUpdatedOrder());
  const handleCancel = () => services.item.select(null);

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.dialog}>
          <div className={styles.content}>
            <div className={styles.head}>
              <button className={styles.closeBtn} onClick={handleCancel}>
                <CloseTwoTone fontSize="large" />
              </button>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{instance.name}</span>
                <span className={styles.itemAmount}>{formatFinancial(item.quantity * item.price)}</span>
              </div>
              <button className={styles.saveBtn} onClick={handleApply}>
                Save
              </button>
            </div>
            <div className={styles.body}>
              <div className={styles.label}>Quantity</div>
              <div className={styles.row}>
                <button className={styles.qtyBtn} disabled={!item.quantity} onClick={handleQtyDecrement}>
                  <MinusTwoTone />
                </button>
                <input
                  type="number"
                  className={styles.qtyInput}
                  value={item.quantity}
                  onChange={(evt) => handleQtyChange(parseInt(evt.target.value, 10) || 0)}
                />
                <button className={styles.qtyBtn} onClick={handleQtyIncrement}>
                  <PlusTwoTone />
                </button>
              </div>
              <div className={styles.label}>Notes</div>
              <div className={styles.row}>
                <textarea
                  rows={4}
                  placeholder={'Add Note'}
                  className={styles.noteInput}
                  value={state.order.notes}
                  onChange={(evt) => handleNotesChange(evt.target.value)}
                />
              </div>
              <button className={styles.removeBtn} onClick={handleRemove}>
                Remove Item
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.backdrop} />
    </Fragment>
  );
};

export default ItemEditor;
