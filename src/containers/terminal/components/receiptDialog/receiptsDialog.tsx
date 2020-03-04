import React, { Fragment } from 'react';
import moment from 'moment';
import { Order, TerminalServices } from 'types';
import { ArrowLeftTwoTone, PlusTwoTone } from 'icons';
import styles from './receiptsDialog.module.css';

type ReceiptsDialogProps = {
  orderId: number;
  orders: Order[];
  services: TerminalServices;
  onClose: () => void;
};

const ReceiptsDialog: React.FC<ReceiptsDialogProps> = ({ orderId, orders, services, onClose }) => {

  const selectOrder = (id: number) => {
    services.setCurrentOrder(id);
    closeDialog();
  };

  const createOrder = () => {
    services.createOrder();
    closeDialog();
  };

  const closeDialog = () => onClose();

  const renderOrdersList = orders.map(order => (
    <div
      key={order.id}
      className={`${styles.order} ${orderId === order.id ? styles.active : ''}`}
      onClick={() => selectOrder(order.id)}
    >
      <div className={styles.orderName}>Receipt #{order.orderName}</div>
      <div className={styles.orderDate}>{moment(order.dateStart).calendar()}</div>
    </div>
  ));

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.dialog}>
          <div className={styles.content}>
            <div className={styles.head}>
              <button className={styles.closeBtn} onClick={closeDialog}>
                <ArrowLeftTwoTone />
                <span>Back</span>
              </button>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>Receipts</span>
              </div>
              <button className={styles.createPrimaryBtn} onClick={createOrder}>
                <PlusTwoTone />
                <span>Create new</span>
              </button>
            </div>
            <div className={styles.body}>
              {renderOrdersList}
              <button className={styles.createBtn} onClick={createOrder}>
                Create new
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.backdrop} />
    </Fragment>
  );
};

export default ReceiptsDialog;
