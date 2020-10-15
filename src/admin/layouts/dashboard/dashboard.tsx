import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { ResponsiveLine, Serie } from '@nivo/line';
import { subDays, getDaysInYear, startOfYear, endOfYear } from 'date-fns';
import { setDocumentTitle } from 'common/utils';
import { AppTranslationHelper, AppViews, ClosedOrder, DateRange } from 'common/types';
import { CommonLayout } from '../index';
import styles from './dashboard.module.css';

type DashboardProps = {
  closedOrders: ClosedOrder[];
  translation: AppTranslationHelper;
  views: AppViews;
};

type DashboardChartType = 'revenue' | 'profit' | 'receipts' | 'average';
type DashboardRangeType =
  | 'currentWeek'
  | 'lastWeek'
  | 'd7'
  | 'd14'
  | 'd28'
  | 'd30'
  | 'd90'
  | 'm12'
  | 'lastYear'
  | 'currentYear';

const Dashboard: React.FC<DashboardProps> = ({ translation, closedOrders, views }) => {
  const { formatFinancial, formatDate, t, startOfWeek, endOfWeek } = translation;
  const today = new Date();

  const [serieId, setSerieId] = useState<DashboardChartType>('revenue');
  const [rangeId, setRangeId] = useState<DashboardRangeType>('d7');

  useEffect(() => {
    const title = [t('admin.title'), t('admin.dashboard.title')];
    setDocumentTitle(title);
  }, [t]);

  const { getTotalDataByDateRange, getDailyTotal } = views.closedOrders;

  const rangesData: { [key in DashboardRangeType]: { label: string; range: DateRange } } = {
    currentWeek: {
      label: t('common.dateRanges.thisWeek'),
      range: { start: startOfWeek(today), end: today },
    },
    lastWeek: {
      label: t('common.dateRanges.lastWeek'),
      range: { start: subDays(startOfWeek(today), 7), end: subDays(startOfWeek(today), 1) },
    },
    d7: {
      label: t('common.dateRanges.7days'),
      range: { start: subDays(today, 7), end: today },
    },
    d14: {
      label: t('common.dateRanges.14days'),
      range: { start: subDays(today, 14), end: today },
    },
    d28: {
      label: t('common.dateRanges.28days'),
      range: { start: subDays(today, 28), end: today },
    },
    d30: {
      label: t('common.dateRanges.30days'),
      range: { start: subDays(today, 30), end: today },
    },
    d90: {
      label: t('common.dateRanges.90days'),
      range: { start: subDays(today, 90), end: today },
    },
    m12: {
      label: t('common.dateRanges.12months'),
      range: { start: subDays(today, getDaysInYear(today)), end: today },
    },
    lastYear: {
      label: t('common.dateRanges.thisYear'),
      range: { start: startOfYear(today), end: endOfYear(today) },
    },
    currentYear: {
      label: t('common.dateRanges.lastYear'),
      range: { start: startOfYear(today), end: today },
    },
  };

  const selectionRange = rangesData[rangeId].range;

  const todayData = useMemo(() => getDailyTotal(new Date()), [getDailyTotal, closedOrders, selectionRange]);
  const rangedData = useMemo(() => getTotalDataByDateRange(selectionRange), [getTotalDataByDateRange, closedOrders, selectionRange]);

  const seriesData: { [key in DashboardChartType]: Serie[] } = {
    profit: [
      {
        id: 'This week',
        data: rangedData.daily.map((order) => ({
          x: formatDate(order.date, 'd MMM'),
          y: formatFinancial(order.profit),
        })),
      },
    ],
    revenue: [
      {
        id: 'This week',
        data: rangedData.daily.map((order) => ({
          x: formatDate(order.date, 'd MMM'),
          y: formatFinancial(order.revenue),
        })),
      },
    ],
    average: [
      {
        id: 'This week',
        data: rangedData.daily.map((order) => ({
          x: formatDate(order.date, 'd MMM'),
          y: formatFinancial(order.median),
        })),
      },
    ],
    receipts: [
      {
        id: 'This week',
        data: rangedData.daily.map((order) => ({
          x: formatDate(order.date, 'd MMM'),
          y: order.receipts,
        })),
      },
    ],
  };


  const renderPrimaryWidget = (
    <div className={styles.widget}>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{t('admin.dashboard.salesWidget.today')}</div>
        <div>{formatDate(today, 'd MMMM')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{formatFinancial(todayData.revenue)}</div>
        <div>{t('admin.dashboard.salesWidget.revenue')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{formatFinancial(todayData.profit)}</div>
        <div>{t('admin.dashboard.salesWidget.profit')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{todayData.receipts}</div>
        <div>{t('admin.dashboard.salesWidget.receipts')}</div>
      </div>
      <div className={styles.widgetSection}>
        <div className={styles.widgetAccent}>{formatFinancial(todayData.median)}</div>
        <div>{t('admin.dashboard.salesWidget.average')}</div>
      </div>
    </div>
  );

  const renderChart = (
    <div>
      <select
        className="form-select"
        value={rangeId}
        onChange={(evt) => setRangeId(evt.target.value as DashboardRangeType)}
      >
        {Object.keys(rangesData).map((key) => (
          <option key={key} value={key}>
            {rangesData[key].label}
          </option>
        ))}
      </select>
      <div className="mt-3" style={{ height: '300px', border: '1px solid #eee' }}>
        <ResponsiveLine
          data={seriesData[serieId]}
          margin={{ top: 30, right: 30, bottom: 30, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 2,
            tickRotation: 0,
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 2,
            tickRotation: 0,
            format: (val) => (serieId === 'receipts' ? (val as number) : formatFinancial(val as number)),
          }}
          colors={{ scheme: 'accent' }}
          pointSize={10}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="Total"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
      <nav className="nav nav-pills flex-column flex-sm-row my-3">
          <div
            className={`flex-sm-fill text-sm-center nav-link ${serieId === 'revenue' ? 'active' : ''}`}
            onClick={() => setSerieId('revenue')}
          >
            <div className={styles.widgetAccent}>{formatFinancial(rangedData.revenue)}</div>
            <div>{t('admin.dashboard.salesWidget.revenue')}</div>
          </div>
          <div
            className={`flex-sm-fill text-sm-center nav-link ${serieId === 'profit' ? 'active' : ''}`}
            onClick={() => setSerieId('profit')}
          >
            <div className={styles.widgetAccent}>{formatFinancial(rangedData.profit)}</div>
            <div>{t('admin.dashboard.salesWidget.profit')}</div>
          </div>
          <div
            className={`flex-sm-fill text-sm-center nav-link ${serieId === 'receipts' ? 'active' : ''}`}
            onClick={() => setSerieId('receipts')}
          >
            <div className={styles.widgetAccent}>{rangedData.receipts}</div>
            <div>{t('admin.dashboard.salesWidget.receipts')}</div>
          </div>
          <div
            className={`flex-sm-fill text-sm-center nav-link ${serieId === 'average' ? 'active' : ''}`}
            onClick={() => setSerieId('average')}
          >
            <div className={styles.widgetAccent}>{formatFinancial(rangedData.median)}</div>
            <div>{t('admin.dashboard.salesWidget.average')}</div>
          </div>
        </nav>
    </div>
  );

  const renderHead = (
    <Fragment>
      <div className={styles.title}>{t('admin.dashboard.title')}</div>
    </Fragment>
  );

  const renderBody = (
    <Fragment>
      {renderPrimaryWidget}
      {renderChart}
    </Fragment>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default Dashboard;
