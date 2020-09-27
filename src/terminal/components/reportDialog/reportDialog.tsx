import React, { Fragment, useState } from 'react';
import { startOfToday, endOfToday, lightFormat, differenceInCalendarDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import { AppViews } from 'common/types';
import { financial } from 'common/utils';
import { CloseTwoTone, CalendarRangeTwoTone } from 'common/icons';
import styles from './reportDialog.module.css';

type ReportDialogProps = {
  views: AppViews;
  onClose: () => void;
  onPrint: (report: JSX.Element) => void;
};

const ReportDialog: React.FC<ReportDialogProps> = ({ views, onClose, onPrint }) => {
  const [isReporting, setIsReporting] = useState(true);
  const [selectionRange, setSelectionRange] = useState({
    startDate: startOfToday(),
    endDate: endOfToday(),
    key: 'selection',
  });

  const handleOnClickOnPrint = () => {
    onPrint(renderReport());
    onClose();
  };

  const renderRangesHead = () => (
    <Fragment>
      <button className={styles.btnSecondary} onClick={() => onClose()}>
        <CloseTwoTone fontSize="large" />
      </button>
      <div className={styles.caption}>
        <span className={styles.itemName}>Create a sales report</span>
      </div>
      <button className={styles.btnPrimary} onClick={() => setIsReporting(true)}>
        Open
      </button>
    </Fragment>
  );

  const renderReportingHead = () => (
    <Fragment>
      <button className={styles.btnSecondary} onClick={() => onClose()}>
        <CloseTwoTone />
      </button>
      <div className={styles.caption}>
        <span className={styles.itemName}>Daily report</span>
      </div>
      <button className={styles.btnSecondary} onClick={() => setIsReporting(false)}>
        <CalendarRangeTwoTone />
      </button>
      <button className={styles.btnPrimary} onClick={handleOnClickOnPrint}>
        Print
      </button>
    </Fragment>
  );

  const renderDataRange = () => (
    <DateRangePicker
      className={styles.dateRange}
      direction="horizontal"
      showSelectionPreview={false}
      ranges={[selectionRange]}
      months={2}
      onChange={(e: any) => setSelectionRange(e.selection)}
    />
  );

  const renderReport = () => {
    const { startDate: start, endDate: end } = selectionRange;
    const { summary, items } = views.closedOrders.getItemsByDateRange({ start, end });
    const reportItems = Object.keys(items);

    return (
      <div className={styles.report}>
        <h3 className="mt-2 mb-4">Sales Report</h3>

        <dl className="row mb-4">
          <dt className="col-sm-3">Days included</dt>
          <dd className="col-sm-9">{differenceInCalendarDays(end, start) + 1}</dd>
          <dt className="col-sm-3">Business Date</dt>
          <dd className="col-sm-9">
            {lightFormat(start, 'yyyy-MM-dd HH:mm')} - {lightFormat(end, 'yyyy-MM-dd HH:mm')}
          </dd>
          <dt className="col-sm-3">Total</dt>
          <dd className="col-sm-9">{financial(summary.amount)}</dd>
        </dl>

        {reportItems.length ? (
          <table className="table">
          <thead>
            <tr>
              <th scope="col w-100">Item</th>
              <th scope="col" className="text-right ">Qty</th>
              <th scope="col" className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportItems.map((group) => (
              <tr key={group}>
                <td className="w-100">{group}</td>
                <td className="text-right">{items[group].quantity}</td>
                <td className="text-right">{financial(items[group].amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
          <div>
            <div>There are no sales for the specified period.</div>
          </div>
        )}

      </div>
    );
  };

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.dialog}>
          <div className={styles.content}>
            <div className={styles.head}>{isReporting ? renderReportingHead() : renderRangesHead()}</div>
            <div className={styles.body}>{isReporting ? renderReport() : renderDataRange()}</div>
          </div>
        </div>
      </div>
      <div className={styles.backdrop} />
    </Fragment>
  );
};

export default ReportDialog;
