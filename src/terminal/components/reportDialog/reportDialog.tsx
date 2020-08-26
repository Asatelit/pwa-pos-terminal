import React, { Fragment, useState } from 'react';
import { startOfToday, endOfToday } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import { ClosedOrder, AppViews, Item } from 'common/types';
import { CloseTwoTone } from 'common/icons';
import styles from './reportDialog.module.css';

type ReportDialogProps = {
  items: Item[];
  orders: ClosedOrder[];
  views: AppViews;
  onClose: () => void;
};

const ReportDialog: React.FC<ReportDialogProps> = ({ orders, items, views, onClose }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: startOfToday(),
    endDate: endOfToday(),
    key: 'selection',
  });

  const renderDataRange = () => (
    <DateRangePicker
      className={styles.dateRange}
      direction="horizontal"
      ranges={[selectionRange]}
      months={2}
      onChange={(e: any) => setSelectionRange(e.selection)}
    />
  );

  const renderReport = () => {
    const { startDate: start, endDate: end } = selectionRange;
    const report = views.closedOrders.getItemsByDateRange({ start, end });

    return (
      <table className={styles.report}>
        <thead>
          <tr>
            <td>Item</td>
            <td>Quantity</td>
            <td>Tax Amount</td>
            <td>Amount</td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(report).map((group) => (
            <tr key={group}>
              <td>{group}</td>
              <td>{report[group].quantity}</td>
              <td>{report[group].taxAmount}</td>
              <td>{report[group].amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.dialog}>
          <div className={styles.content}>
            <div className={styles.head}>
              <button className={styles.btnSecondary} onClick={() => onClose()}>
                <CloseTwoTone fontSize="large" />
              </button>
              <div className={styles.caption}>
                <span className={styles.itemName}>Make a report</span>
              </div>
              <button role="button" className={styles.btnPrimary} onClick={() => setIsReporting(true)}>
                Open
              </button>
            </div>
            <div className={styles.body}>{isReporting ? renderReport() : renderDataRange()}</div>
          </div>
        </div>
      </div>
      <div className={styles.backdrop} />
    </Fragment>
  );
};

export default ReportDialog;
