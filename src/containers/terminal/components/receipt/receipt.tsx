import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Order, Product, TerminalServices } from 'types';
import { financial } from 'utils';
import { MenuSwapTwoTone, PrinterPosTwoTone } from 'icons';
import { Routes } from 'common/const';
import styles from './receipt.module.css';

type ReceiptProps = {
  items: Product[];
  order: Order | null;
  orderId: number;
  services: TerminalServices;
  onShowReceipts: () => void;
  onPrintCheck: (orderId: number) => void;
};

const Receipt: React.FC<ReceiptProps> = ({ orderId, order, items, services, onShowReceipts, onPrintCheck }) => {
  // helpers
  const getItemName = (id: number) => items.find(item => item.id === id)?.name || id;

  // handlers
  const handleShowReceipts = () => onShowReceipts();
  const handleEditOrderItem = (orderItemId: number) => services.setCurrentItem(orderItemId);
  const handlePrint = () => onPrintCheck(orderId);

  // assets
  const renderOrderItems = () => {
    if (!order) return null;
    return (
      <Fragment>
        <tbody>
          {order.items.map(item => (
            <tr key={`item-${item.id}`} className={styles.row} onClick={() => handleEditOrderItem(item.id)}>
              <td className={`${styles.cell} ${styles.cellName}`}>
                {getItemName(item.id)} <span className={styles.ghostly}> x {item.quantity}</span>
              </td>
              <td className={`${styles.cell} ${styles.cellPrice}`}>{financial(item.quantity * item.price)}</td>
            </tr>
          ))}
        </tbody>
      </Fragment>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        <button className={styles.receiptsBtn} onClick={handleShowReceipts}>
          {order?.orderName ? `Receipt #${order?.orderName}` : 'Receipts'}
          <MenuSwapTwoTone className={styles.receiptsIcon} />
        </button>
      </div>
      <div className={styles.body}>
        <table className={styles.listing}>{renderOrderItems()}</table>
      </div>
      <div className={styles.foot}>
        <button
          className={styles.secondaryBtn}
          title="Print the check"
          disabled={!order?.items.length}
          onClick={() => handlePrint()}
        >
          <PrinterPosTwoTone />
        </button>
        <Link
          className={`${styles.charge} ${!order || !order.totalAmount ? 'disabled' : ''}`}
          to={Routes.TerminalOrderCharge.replace(':id', `${orderId}`)}
        >
          Charge {order && order.totalAmount ? financial(order.totalAmount) : ''}
        </Link>
      </div>
    </div>
  );
};

export default Receipt;
