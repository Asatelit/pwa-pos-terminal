import React from 'react';
import { useTranslation } from 'react-i18next';
import { format as dateFnsFormat } from 'date-fns';
import { AppState, AppTranslationHelper } from 'common/types';
import { TaxName } from 'common/components';
import styles from './printReceipt.module.css';

type PrintReceiptProps = {
  format: typeof dateFnsFormat;
  translation: AppTranslationHelper;
  orderId: string | null;
  state: AppState;
};

const PrintReceipt: React.FC<PrintReceiptProps> = ({ orderId, state, format, translation }) => {
  const [t] = useTranslation();
  const { formatFinancial } = translation;
  const { items: products, orders, settings } = state;
  const order = orders.find((order) => order.id === orderId);
  const getItemName = (id: string | null) => products.find((item) => item.id === id)?.name || id;

  if (!order) return <div>{t('common.somethingWentWrong')}</div>;

  const renderOrderItems = order.items.map((item) => (
    <tr key={`Item_${item.id}`} className={styles.row}>
      <td className={`${styles.cell} ${styles.cellName}`}>
        <div>
          {getItemName(item.id)} <span className={styles.ghostly}> x {item.quantity}</span>
        </div>
        {item.quantity > 1 ? (
          <div className={styles.ghostly}>({`${formatFinancial(item.price)} ${t('common.each')}`})</div>
        ) : null}
      </td>
      <td className={`${styles.cell} ${styles.cellPrice}`}>{formatFinancial(item.quantity * item.price)}</td>
    </tr>
  ));

  const renderSummary = (
    <React.Fragment>
      {!!order.taxAmount && (
        <React.Fragment>
          <tr>
            <td colSpan={2}>
              <div className={styles.divider} />
            </td>
          </tr>
          <tr>
            <td>{t('common.purchaseSubtotal')}</td>
            <td>{formatFinancial(order.subTotalAmount)}</td>
          </tr>
          {order.appliedTaxes.map((tax) => (
            <tr key={`TaxEntity_${tax.id}`}>
              <td>
                <TaxName taxId={tax.id} taxes={state.taxes} />
              </td>
              <td>{formatFinancial(tax.taxAmount)}</td>
            </tr>
          ))}
        </React.Fragment>
      )}
      <tr>
        <td colSpan={2}>
          <div className={styles.divider} />
        </td>
      </tr>
      <tr>
        <td>{t('common.total')}</td>
        <td>{formatFinancial(order.totalAmount)}</td>
      </tr>
      {!!order.cashPaymentAmount && (
        <tr>
          <td>{t('common.cash')}</td>
          <td>{formatFinancial(order.cashPaymentAmount)}</td>
        </tr>
      )}
      {!!order.cardPaymentAmount && (
        <tr>
          <td>{t('common.creditCard')}</td>
          <td>{formatFinancial(order.cardPaymentAmount)}</td>
        </tr>
      )}
      {order.totalPaymentAmount - order.totalAmount > 0 && (
        <tr>
          <td>{t('common.change')}</td>
          <td>{formatFinancial(order.totalPaymentAmount - order.totalAmount)}</td>
        </tr>
      )}
    </React.Fragment>
  );

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        {!!settings.logo && <img src={settings.logo} alt={settings.name} />}
        {!!settings.name && <h1 className={styles.title}>{settings.name}</h1>}
        {settings.printAddress && <p className={styles.title}>{}</p>}
      </div>
      <table>
        <tbody>
          <tr>
            <td>{t('common.receipt#')}</td>
            <td>{order.orderName}</td>
          </tr>
          <tr>
            <td>{t('common.printedAt')}</td>
            <td>{format(new Date(), 'Pp')}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className={styles.divider} />
            </td>
          </tr>
          {renderOrderItems}
          {renderSummary}
        </tbody>
      </table>
    </div>
  );
};

export default PrintReceipt;
