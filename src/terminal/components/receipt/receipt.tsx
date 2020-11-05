import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Order, Item, AppActions, AppTranslationHelper } from 'common/types';
import { MenuSwapTwoTone, PrinterPosTwoTone } from 'common/icons';
import { Routes } from 'common/enums';
import styles from './receipt.module.css';

type ReceiptProps = {
  isPrintable: boolean;
  items: Item[];
  onPrintCheck: (orderId: string | null) => void;
  onShowReceipts: () => void;
  order: Order | null;
  orderId: string | null;
  services: AppActions;
  translation: AppTranslationHelper;
};

const Receipt: React.FC<ReceiptProps> = ({
  isPrintable,
  translation,
  orderId,
  order,
  items,
  services,
  onShowReceipts,
  onPrintCheck,
}) => {
  // helpers
  const [t] = useTranslation();
  const { formatFinancial } = translation;
  const getItemName = (id: string) => items.find((item) => item.id === id)?.name || id;

  // handlers
  const handleShowReceipts = () => onShowReceipts();
  const handleEditOrderItem = (orderItemId: string) => services.item.select(orderItemId);
  const handlePrint = () => onPrintCheck(orderId);

  // assets
  const renderOrderItems = () => {
    if (!order) return null;
    return (
      <Fragment>
        <tbody>
          {order.items.map((item) => (
            <tr key={`item-${item.id}`} className={styles.row} onClick={() => handleEditOrderItem(item.id)}>
              <td className={`${styles.cell} ${styles.cellName}`}>
                {getItemName(item.id)} <span className={styles.ghostly}> x {item.quantity}</span>
              </td>
              <td className={`${styles.cell} ${styles.cellPrice}`}>{formatFinancial(item.quantity * item.price)}</td>
            </tr>
          ))}
          {!!order.taxAmount && (
            <tr>
              <td className={`${styles.cell} ${styles.cellName}`}>{t('common.tax')}</td>
              <td className={`${styles.cell} ${styles.cellPrice}`}>{formatFinancial(order.taxAmount)}</td>
            </tr>
          )}
        </tbody>
      </Fragment>
    );
  };

  const chargeText = `${t('terminal.charge')} ${order && order.totalAmount ? formatFinancial(order.totalAmount) : ''}`;
  const isDisabledCharge = !order || !order.totalAmount;

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        <button className={styles.receiptsBtn} onClick={handleShowReceipts}>
          {order?.orderName ? t('common.receipt#', { val: order?.orderName }) : t('common.receipts')}
          <MenuSwapTwoTone className={styles.receiptsIcon} />
        </button>
      </div>
      <div className={styles.body}>
        <table className={styles.listing}>{renderOrderItems()}</table>
      </div>
      <div className={styles.foot}>
        {isPrintable && (
          <button
            className="btn btn-light mr-2"
            title={t('common.printTheReceipt')}
            disabled={!order?.items.length}
            onClick={() => handlePrint()}
          >
            <PrinterPosTwoTone />
          </button>
        )}
        <Link
          role="button"
          className={`btn btn-primary w-100 ${isDisabledCharge ? 'disabled' : ''}`}
          aria-disabled={isDisabledCharge}
          tabIndex={isDisabledCharge ? -1 : 0}
          to={Routes.TerminalOrderCharge.replace(':id', `${orderId}`)}
        >
          {chargeText}
        </Link>
      </div>
    </div>
  );
};

export default Receipt;
