import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { ResponsiveLine, CustomLayerProps, LineProps } from '@nivo/line';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { setDocumentTitle } from 'common/utils';
import { AppTranslationHelper, AppViews } from 'common/types';
import { CommonLayout } from '../index';
import { PercentageChange } from '../../components';
import { getRangesList, getSeriesData, DashboardRangeType, DashboardChartType } from './dashboard.assets';
import { chartTheme } from './dashboard.charts.theme';
import styles from './dashboard.module.css';

type DashboardProps = {
  translation: AppTranslationHelper;
  views: AppViews;
};

const Dashboard: React.FC<DashboardProps> = ({ translation, views }) => {
  const { formatFinancial, formatDate, t } = translation;
  const today = new Date();

  const [serieId, setSerieId] = useState<DashboardChartType>('netSales');
  const [rangeId, setRangeId] = useState<DashboardRangeType>('d7');

  useEffect(() => {
    const title = [t('admin.title'), t('admin.dashboard.title')];
    setDocumentTitle(title);
  }, [t]);

  const { getTotalDataByDateRange, getDailyTotal } = views.closedOrders;

  const rangesList = getRangesList(translation);
  const selectedDateRange = rangesList[rangeId];

  const { currentPeriodData, previousPeriodData } = useMemo(() => {
    const currentPeriodData = getTotalDataByDateRange(selectedDateRange.currentPeriodRange);
    const previousPeriodData = getTotalDataByDateRange(selectedDateRange.previousPeriodRange);
    return { currentPeriodData, previousPeriodData };
  }, [getTotalDataByDateRange, selectedDateRange]);

  const todayData = useMemo(() => getDailyTotal(new Date()), [getDailyTotal]);
  const seriesData = getSeriesData(translation, currentPeriodData.groupedByDay, previousPeriodData.groupedByDay);

  // Formats the value in financial format for all values other than "sales".
  const formatAxisFinantialVal = (val: number) => (serieId === 'sales' ? val : formatFinancial(val));

  const weekdays = {
    '0': t('common.weekdays.short.sunday'),
    '1': t('common.weekdays.short.monday'),
    '2': t('common.weekdays.short.tuesday'),
    '3': t('common.weekdays.short.wednesday'),
    '4': t('common.weekdays.short.thursday'),
    '5': t('common.weekdays.short.friday'),
    '6': t('common.weekdays.short.saturday'),
  };

  // prettier-ignore
  const charts = {
    overview: {
      title: t(`admin.dashboard.salesWidget.${serieId}Label`),
      description: [
        formatDate(selectedDateRange.currentPeriodRange.start, 'dd MMMM'),
        ' – ',
        formatDate(selectedDateRange.currentPeriodRange.end, 'dd MMMM'),
        ' vs ',
        formatDate(selectedDateRange.previousPeriodRange.start, 'dd MMMM'),
        ' – ',
        formatDate(selectedDateRange.previousPeriodRange.end, 'dd MMMM'),
      ].join(' '),
    },
    heatmap: {
      title: [
        t(`admin.dashboard.salesWidget.${serieId}Label`),
        t('admin.dashboard.salesWidget.heatmapTitle')
      ].join(' '),
      description: [
        formatDate(selectedDateRange.currentPeriodRange.start, 'dd MMMM'),
        formatDate(selectedDateRange.currentPeriodRange.end, 'dd MMMM'),
      ].join(' – '),
    },
  };

  const chartLineStyles = {
    previous: { strokeDasharray: '3, 3', strokeWidth: 1 },
    default: { strokeWidth: 2 },
  };

  const scale: Partial<LineProps> = {
    xScale: { type: 'time', format: 'native', useUTC: false, precision: 'day' },
    yScale: { type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false },
    axisBottom: {
      format: (value: any) => formatDate(value, 'd MMM'),
      tickSize: 0,
      tickPadding: 10,
      tickValues: 'every day',
    },
    axisLeft: {
      tickSize: 0,
      tickPadding: 10,
      format: (val: any) => formatAxisFinantialVal(val),
    },
    axisTop: null,
    axisRight: null,
  };

  const renderChartLine: (props: CustomLayerProps) => React.ReactNode = ({ series, lineGenerator, xScale, yScale }) => {
    return series.map(({ key, data, color }) => (
      <path
        key={key}
        d={lineGenerator(
          data.map((d) => ({
            x: xScale(d.data.x as number),
            y: yScale(d.data.y as number),
          })),
        )}
        fill="none"
        stroke={color}
        style={chartLineStyles[key] || chartLineStyles.default}
      />
    ));
  };

  const renderPrimaryWidget = (
    <Fragment>
      <div className={styles.widget}>
        <div className={styles.widgetSection}>
          <div className={styles.widgetAccent}>{t('admin.dashboard.salesWidget.todayLabel')}</div>
          <div>{formatDate(today, 'd MMMM')}</div>
        </div>
        <div className={styles.widgetSection}>
          <div className={styles.widgetAccent}>{formatFinancial(todayData.netSales)}</div>
          <div>{t('admin.dashboard.salesWidget.grossSalesLabel')}</div>
        </div>
        <div className={styles.widgetSection}>
          <div className={styles.widgetAccent}>{formatFinancial(todayData.grossSales)}</div>
          <div>{t('admin.dashboard.salesWidget.netSalesLabel')}</div>
        </div>
        <div className={styles.widgetSection}>
          <div className={styles.widgetAccent}>{todayData.sales}</div>
          <div>{t('admin.dashboard.salesWidget.salesLabel')}</div>
        </div>
        <div className={styles.widgetSection}>
          <div className={styles.widgetAccent}>{formatFinancial(todayData.averageSale)}</div>
          <div>{t('admin.dashboard.salesWidget.averageSaleLabel')}</div>
        </div>
      </div>
    </Fragment>
  );

  const tabs = [
    {
      serie: 'grossSales',
      isActive: serieId === 'grossSales',
      label: t('admin.dashboard.salesWidget.grossSalesLabel'),
      currentVal: currentPeriodData.grossSales,
      currentFormattedVal: formatFinancial(currentPeriodData.grossSales),
      previousVal: previousPeriodData.grossSales,
    },
    {
      serie: 'netSales',
      isActive: serieId === 'netSales',
      label: t('admin.dashboard.salesWidget.netSalesLabel'),
      currentVal: currentPeriodData.netSales,
      currentFormattedVal: formatFinancial(currentPeriodData.netSales),
      previousVal: previousPeriodData.netSales,
    },
    {
      serie: 'sales',
      isActive: serieId === 'sales',
      label: t('admin.dashboard.salesWidget.salesLabel'),
      currentVal: currentPeriodData.sales,
      currentFormattedVal: currentPeriodData.sales,
      previousVal: previousPeriodData.sales,
    },
    {
      serie: 'averageSale',
      isActive: serieId === 'averageSale',
      label: t('admin.dashboard.salesWidget.averageSaleLabel'),
      currentVal: currentPeriodData.averageSale,
      currentFormattedVal: formatFinancial(currentPeriodData.averageSale),
      previousVal: previousPeriodData.averageSale,
    },
  ];

  const renderChart = (
    <Fragment>
      <nav className="nav nav-tabs flex-column flex-sm-row mt-3">
        {tabs.map((tab) => (
          <div
            className={`flex-sm-fill text-sm-center nav-link ${tab.isActive ? 'active' : ''}`}
            key={tab.serie}
            onClick={() => setSerieId(tab.serie as DashboardChartType)}
            role="button"
          >
            <div className="h5 mb-1">{tab.currentFormattedVal}</div>
            <div>
              <small>{tab.label}</small>
              <PercentageChange className="small ml-2" peak={tab.currentVal} base={tab.previousVal} />
            </div>
          </div>
        ))}
      </nav>
      <div className={styles.chart}>
        <div className="p-4">
          <h5>{charts.overview.title}</h5>
          <div className="small">{charts.overview.description}</div>
        </div>
        <div className="my-3 mr-2" style={{ height: '350px' }}>
          <ResponsiveLine
            {...scale}
            data={seriesData[serieId]}
            margin={{ top: 10, right: 30, bottom: 60, left: 80 }}
            colors={['var(--palette-primary-main)', 'var(--palette-primary-light)']}
            pointSize={4}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            useMesh={true}
            enableGridX={false}
            enableArea={true}
            areaOpacity={0.05}
            crosshairType="x"
            enableSlices="x"
            sliceTooltip={({ slice }) => (
              <div
                style={{
                  background: 'var(--palette-background-paper)',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--palette-divider)',
                }}
              >
                <div key={slice.points[1].id} style={{ padding: '3px 0' }}>
                  <span className="text-capitalize mr-1">{t(`admin.dashboard.salesWidget.${serieId}Label`)}</span>
                  <strong>
                    {serieId === 'sales'
                      ? slice.points[1].data.yFormatted
                      : formatFinancial(slice.points[1].data.y as number)}
                  </strong>
                  <PercentageChange
                    className="ml-3 small"
                    base={slice.points[0].data.y as number}
                    peak={slice.points[1].data.y as number}
                  />
                </div>
              </div>
            )}
            theme={chartTheme}
            layers={['areas', 'axes', 'crosshair', 'grid', 'legends', 'mesh', 'points', 'slices', renderChartLine]}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 60,
                itemsSpacing: 60,
                itemDirection: 'left-to-right',
                itemWidth: 100,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 10,
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
        <div className="p-4">
          <h5>{charts.heatmap.title}</h5>
          <div className="small">{charts.heatmap.description}</div>
        </div>
        <div className="my-3 mr-2" style={{ height: '250px' }}>
          <ResponsiveHeatMap
            axisTop={null}
            axisLeft={{
              tickSize: 0,
              tickPadding: 10,
              format: (val: any) => weekdays[val],
            }}
            axisBottom={{
              tickSize: 0,
              tickPadding: 10,
              format: (val: any) => val.split('_')[1],
            }}
            data={currentPeriodData.heatmapByWeekdayAndHour}
            indexBy="weekday"
            enableLabels={false}
            keys={Array.from({ length: 24 }, (_, i) => i).map((i) => `hour_${i}_${serieId}`)}
            margin={{ top: 10, right: 10, bottom: 30, left: 70 }}
            padding={0.25}
            colors="blues"
            theme={chartTheme}
            tooltip={({ color, value }) => (
              <div className="d-inline-flex align-items-center">
                <div className="mr-2" style={{ width: '1rem', height: '1rem', background: color }} />
                {formatAxisFinantialVal(value)}
              </div>
            )}
          />
        </div>
      </div>
    </Fragment>
  );

  const renderHead = (
    <Fragment>
      <div className={styles.title}>{t('admin.dashboard.title')}</div>
      <select
        className="form-select w-auto"
        value={rangeId}
        onChange={(evt) => setRangeId(evt.target.value as DashboardRangeType)}
      >
        {Object.keys(rangesList).map((key) => (
          <option key={key} value={key}>
            {rangesList[key].label}
          </option>
        ))}
      </select>
    </Fragment>
  );

  const renderBody = (
    <Fragment>
      {renderPrimaryWidget}
      <div className="h5 mx-2 my-4 pt-2">{t(`admin.dashboard.salesWidget.salesSummaryOverviewTitle`)}</div>
      {renderChart}
    </Fragment>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default Dashboard;
