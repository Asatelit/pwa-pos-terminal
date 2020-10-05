import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useDateTranslation } from 'common/hooks';
import { Order, AppActions, OrderStatuses } from 'common/types';
import { ArrowLeftTwoTone, PlusTwoTone } from 'common/icons';
import styles from './receiptsDialog.module.css';

type ReceiptsDialogProps = {
  orderId: string | null;
  orders: Order[];
  services: AppActions;
  onClose: () => void;
};

const ReceiptsDialog: React.FC<ReceiptsDialogProps> = ({ orderId, orders, services, onClose }) => {
  const [t] = useTranslation();
  const { format } = useDateTranslation();
  const openOrders = orders.filter((entity) => entity.status === OrderStatuses.Open);

  const selectOrder = (id: string) => {
    services.orders.select(id);
    closeDialog();
  };

  const createOrder = () => {
    services.orders.add();
    closeDialog();
  };

  const closeDialog = () => onClose();

  const renderOrdersList = openOrders.map((order) => (
    <div
      key={order.id}
      className={`${styles.order} ${orderId === order.id ? styles.active : ''}`}
      onClick={() => selectOrder(order.id)}
    >
      <div className={styles.orderName}>{`${t('terminal.receipt#')}${order.orderName}`}</div>
      <div className={styles.orderDate}>{format(order.dateStart, 'd MMMM')}</div>
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
                <span>{t('common.back')}</span>
              </button>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{t('terminal.receipts')}</span>
              </div>
              <button className={styles.createPrimaryBtn} onClick={createOrder}>
                <PlusTwoTone />
                <span>{t('terminal.createNewReceipt')}</span>
              </button>
            </div>
            <div className={styles.body}>
              {renderOrdersList}
              <button className={styles.createBtn} onClick={createOrder}>
                {t('terminal.createNewReceipt')}
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
