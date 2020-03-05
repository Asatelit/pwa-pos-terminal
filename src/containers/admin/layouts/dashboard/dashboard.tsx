import React, { Fragment } from 'react';
import moment from 'moment';
import { ClosedOrder } from 'types';
import { calcSum, average, financial } from 'utils';
import { CommonLayout } from '../index';
import styles from './dashboard.module.css';

type DashboardProps = {
  closedOrders: ClosedOrder[];
};

const Dashboard: React.FC<DashboardProps> = ({ closedOrders }) => {
  const filteredData = closedOrders.filter(entity => moment(entity.dateClose).isSame(new Date(), 'day'));
  const revenueAmount = calcSum<ClosedOrder>(filteredData, 'totalAmount');
  const averageAmount = average(filteredData.map(entity => entity.totalAmount));
  const profitAmount = calcSum<ClosedOrder>(filteredData, 'profit');
  const receiptCount = filteredData.length;

  const renderPrimaryWidget = (
    <div className={styles.widget}>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>Today,</div>
        <div>{moment().format('D MMMM')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{financial(revenueAmount)}</div>
        <div>revenue</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{financial(profitAmount)}</div>
        <div>profit</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{receiptCount}</div>
        <div>receipts</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{financial(averageAmount)}</div>
        <div>average</div>
      </div>
    </div>
  );

  const renderHead = (
    <Fragment>
      <div className={styles.title}>
        Sales Report
      </div>
    </Fragment>
  );

  const renderBody = (
    <Fragment>
      {renderPrimaryWidget}
    </Fragment>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default Dashboard;
