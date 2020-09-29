import React, { Fragment, useEffect } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDateTranslation } from 'common/hooks';
import { ClosedOrder } from 'common/types';
import { calcSum, average, financial, setDocumentTitle } from 'common/utils';
import { CommonLayout } from '../index';
import styles from './dashboard.module.css';

type DashboardProps = {
  closedOrders: ClosedOrder[];
};

const Dashboard: React.FC<DashboardProps> = ({ closedOrders }) => {
  const [t] = useTranslation();
  const { format } = useDateTranslation();

  useEffect(() => {
    const title = [t('admin.title'), t('admin.dashboard.title')];
    setDocumentTitle(title);
  }, [t]);

  const filteredData = closedOrders.filter((entity) => moment(entity.dateClose).isSame(new Date(), 'day'));
  const revenueAmount = calcSum<ClosedOrder>(filteredData, 'totalAmount');
  const averageAmount = average(filteredData.map((entity) => entity.totalAmount));
  const profitAmount = calcSum<ClosedOrder>(filteredData, 'profit');
  const receiptCount = filteredData.length;

  const renderPrimaryWidget = (
    <div className={styles.widget}>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{t('admin.dashboard.salesWidget.today')}</div>
        <div>{format(new Date(), 'd MMMM')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{financial(revenueAmount)}</div>
        <div>{t('admin.dashboard.salesWidget.revenue')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{financial(profitAmount)}</div>
        <div>{t('admin.dashboard.salesWidget.profit')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{receiptCount}</div>
        <div>{t('admin.dashboard.salesWidget.receipts')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{financial(averageAmount)}</div>
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
