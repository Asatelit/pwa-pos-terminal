import React from 'react';
import moment from 'moment';
import { financial } from 'utils';
import { TerminalState } from 'types';
import styles from './printReceipt.module.css';

type PrintReceiptProps = { orderId: number, state: TerminalState };

const PrintReceipt: React.FC<PrintReceiptProps> = ({ orderId, state }) => {
  const { products, orders, settings } = state;
  const order = orders.find(order => order.id === orderId);
  const getItemName = (id: number) => products.find(item => item.id === id)?.name || id;

  if (!order) return <div>Matching order not found.</div>;

  const renderOrderItems = order.items.map(item => (
    <tr key={`item-${item.id}`} className={styles.row}>
      <td className={`${styles.cell} ${styles.cellName}`}>
        <div>{getItemName(item.id)} <span className={styles.ghostly}> x {item.quantity}</span></div>
        {item.quantity > 1 ? <div className={styles.ghostly}>({financial(item.price)} ea.)</div> : null}
      </td>
      <td className={`${styles.cell} ${styles.cellPrice}`}>{financial(item.quantity * item.price)}</td>
    </tr>
  ));

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
            <td>Receipt #</td>
            <td>{order.orderName}</td>
          </tr>
          <tr>
            <td>Printed at</td>
            <td>{moment().format('lll')}</td>
          </tr>
          <tr>
            <td colSpan={2}><div className={styles.divider} /></td>
          </tr>
          {renderOrderItems}
          <tr>
            <td colSpan={2}><div className={styles.divider} /></td>
          </tr>
          <tr>
            <td>Total</td>
            <td>{financial(order.totalAmount)}</td>
          </tr>
          {!!order.cashPaymentAmount && (
            <tr>
              <td>Cash</td>
              <td>{financial(order.cashPaymentAmount)}</td>
            </tr>
          )}
          {!!order.cardPaymentAmount && (
            <tr>
              <td>Card</td>
              <td>{financial(order.cardPaymentAmount)}</td>
            </tr>
          )}
          {(order.totalPaymentAmount - order.totalAmount) > 0 && (
            <tr>
              <td>Change</td>
              <td>{financial(order.totalPaymentAmount - order.totalAmount)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PrintReceipt;
