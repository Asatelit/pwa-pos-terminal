import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Order, AppActions, AppTranslationHelper, OrderStatuses } from 'common/types';
import { ArrowLeftTwoTone, PlusTwoTone } from 'common/icons';
import styles from './receiptsDialog.module.css';

type ReceiptsDialogProps = {
  onClose: () => void;
  orderId: string | null;
  orders: Order[];
  services: AppActions;
  tranaslation: AppTranslationHelper,
};

const ReceiptsDialog: React.FC<ReceiptsDialogProps> = ({ orderId, orders, services, onClose, tranaslation }) => {
  const [t] = useTranslation();
  const { formatDate } = tranaslation;
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
      <div className={styles.orderName}>{t('common.receipt#', { val: order.orderName })}</div>
      <div className={styles.orderDate}>{formatDate(order.dateStart, 'd MMMM')}</div>
    </div>
  ));

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.dialog}>
          <div className={styles.content}>
            <div className={styles.head}>
              <button className="btn btn-text d-inline-flex align-items-center" onClick={closeDialog}>
                <ArrowLeftTwoTone />
                <span className="ml-1">{t('common.back')}</span>
              </button>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{t('common.receipts')}</span>
              </div>
              <button className="d-inline-flex btn btn-primary d-inline-flex align-items-center" onClick={createOrder}>
                <PlusTwoTone />
                <span className="ml-1">{t('terminal.createNewReceipt')}</span>
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
