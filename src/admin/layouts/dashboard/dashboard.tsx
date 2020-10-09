import React, { Fragment, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { calcSum, average, setDocumentTitle } from 'common/utils';
import { AppTranslationHelper, ClosedOrder } from 'common/types';
import { CommonLayout } from '../index';
import styles from './dashboard.module.css';

type DashboardProps = {
  closedOrders: ClosedOrder[];
  translation: AppTranslationHelper;
};

const Dashboard: React.FC<DashboardProps> = ({ translation, closedOrders }) => {
  const { formatFinancial, formatDate, t } = translation;

  useEffect(() => {
    const title = [t('admin.title'), t('admin.dashboard.title')];
    setDocumentTitle(title);
  }, [t]);

  const filteredData = closedOrders.filter((entity) => isSameDay(entity.dateClose, new Date()));
  const revenueAmount = calcSum<ClosedOrder>(filteredData, 'totalAmount');
  const averageAmount = average(filteredData.map((entity) => entity.totalAmount));
  const profitAmount = calcSum<ClosedOrder>(filteredData, 'profit');
  const receiptCount = filteredData.length;

  const renderPrimaryWidget = (
    <div className={styles.widget}>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{t('admin.dashboard.salesWidget.today')}</div>
        <div>{formatDate(new Date(), 'd MMMM')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{formatFinancial(revenueAmount)}</div>
        <div>{t('admin.dashboard.salesWidget.revenue')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{formatFinancial(profitAmount)}</div>
        <div>{t('admin.dashboard.salesWidget.profit')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{receiptCount}</div>
        <div>{t('admin.dashboard.salesWidget.receipts')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{formatFinancial(averageAmount)}</div>
        <div>{t('admin.dashboard.salesWidget.average')}</div>
      </div>
    </div>
  );

  const renderHead = (
    <Fragment>
      <div className={styles.title}>{t('admin.dashboard.title')}</div>
    </Fragment>
  );

  const renderBody = <Fragment>{renderPrimaryWidget}</Fragment>;

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default Dashboard;
