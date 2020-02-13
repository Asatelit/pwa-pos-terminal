import React from 'react';
import { Order, Product, TerminalServices } from 'types';
import styles from './receipt.module.css';

type ReceiptProps = {
  items: Product[];
  order: Order | null;
  orderId: number;
  services: TerminalServices;
  onShowReceipts: () => void;
};

const Receipt: React.FC<ReceiptProps> = ({ orderId, order, items, services, onShowReceipts }) => {
  // helpers
  const getItemName = (id: number) => items.find(item => item.id === id)?.name || id;

  // handlers
  const handleShowReceipts = () => onShowReceipts();
  const handleEditOrderItem = (orderItemId: number) => services.setCurrentItem(orderItemId);
  const handleOrderCharge = () => services.setChargingOrder(orderId);

  // assets
  const renderOrderItems = () => {
    if (!order) return null;
    return (
      <tbody>
        {order.items.map(item => (
          <tr key={`item-${item.id}`} className={styles.row} onClick={() => handleEditOrderItem(item.id)}>
            <td className={`${styles.cell} ${styles.name}`}>{getItemName(item.id)}</td>
            <td className={`${styles.cell} ${styles.qty}`}>{item.quantity}</td>
            <td className={`${styles.cell} ${styles.price}`}>{item.price}</td>
            <td className={`${styles.cell} ${styles.total}`}>{item.quantity * item.price}</td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        <button className={styles.receiptsBtn} onClick={handleShowReceipts}>
          Receipt #1
        </button>
      </div>
      <div className={styles.head}>
        <img src="" alt="" />
        <h1 className="place-name">Place Name</h1>
        <dl>
          <dt>Receipt #</dt>
          <dd>2</dd>
          <dt>Cashier</dt>
          <dd>Людмила</dd>
          <dt>Printed at</dt>
          <dd className="print-time">{Date.now()}</dd>
        </dl>
      </div>
      <div className={styles.body}>
        <table className={styles.listing}>
          <thead>
            <tr>
              <th className={`${styles.cell} ${styles.name}`}>Name</th>
              <th className={`${styles.cell} ${styles.qty}`}>Q-ty</th>
              <th className={`${styles.cell} ${styles.price}`}>Price</th>
              <th className={`${styles.cell} ${styles.total}`}>Subtotal</th>
            </tr>
          </thead>
          {renderOrderItems()}
        </table>
      </div>
      <div className={styles.foot}>
        <button disabled={!order || !order.totalAmount} className={styles.charge} onClick={handleOrderCharge}>
          Charge {order && order.totalAmount ? `${order.totalAmount} $` : ''}
        </button>
      </div>
    </div>
  );
};

export default Receipt;
