import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { ResponsiveLine, CustomLayerProps, LineProps } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { setDocumentTitle } from 'common/utils';
import { AppTranslationHelper, AppViews } from 'common/types';
import { CommonLayout } from '../index';
import { PercentageChange } from '../../components';
import { getRangesList, getSeriesData, DashboardRangeType, DashboardChartType } from './dashboard.assets';
import styles from './dashboard.module.css';

type DashboardProps = {
  translation: AppTranslationHelper;
  views: AppViews;
};

const Dashboard: React.FC<DashboardProps> = ({ translation, views }) => {
  const { formatFinancial, formatDate, t } = translation;
  const today = new Date();

  const [serieId, setSerieId] = useState<DashboardChartType>('revenue');
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

  console.info(currentPeriodData);

  const todayData = useMemo(() => getDailyTotal(new Date()), [getDailyTotal]);
  const seriesData = getSeriesData(translation, currentPeriodData.groupedByDay, previousPeriodData.groupedByDay);

  const styleById = {
    previous: {
      strokeDasharray: '3, 3',
      strokeWidth: 1,
    },
    default: {
      strokeWidth: 2,
    },
  };

  const scale: Partial<LineProps> = {
    xScale: { type: 'time', format: 'native', useUTC: false, precision: 'day' },
    yScale: { type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false },
    axisBottom: {
      orient: 'bottom',
      format: (value: any) => formatDate(value, 'd MMM'),
      tickSize: 5,
      tickPadding: 2,
      tickRotation: 0,
      tickValues: 'every day',
    },
    axisRight: {
      orient: 'left',
      tickSize: 5,
      tickPadding: 2,
      tickRotation: 0,
      format: (val: any) => (serieId === 'receipts' ? (val as number) : formatFinancial(val as number)),
    },
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
        style={styleById[key] || styleById.default}
      />
    ));
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
    <div className={styles.chart}>
      <div className={styles.chartHead}>
        <div className={styles.chartHeadTitle}>
          <div className="text-capitalize font-weight-bolder">{t(`admin.dashboard.salesWidget.${serieId}`)}</div>
          <div className="small">
            {formatDate(selectedDateRange.currentPeriodRange.start, 'dd MMMM')}
            {' – '}
            {formatDate(selectedDateRange.currentPeriodRange.end, 'dd MMMM')}
          </div>
        </div>
      </div>
      <nav className="nav nav-tabs flex-column flex-sm-row mt-3">
        <div
          role="button"
          className={`flex-sm-fill text-sm-center nav-link ${serieId === 'revenue' ? 'active' : ''}`}
          onClick={() => setSerieId('revenue')}
        >
          <div className={styles.widgetAccent}>{formatFinancial(currentPeriodData.revenue)}</div>
          <div>
            <span>{t('admin.dashboard.salesWidget.revenue')}</span>
            <PercentageChange
              className="small ml-2"
              peak={currentPeriodData.revenue}
              base={previousPeriodData.revenue}
            />
          </div>
        </div>
        <div
          role="button"
          className={`flex-sm-fill text-sm-center nav-link ${serieId === 'profit' ? 'active' : ''}`}
          onClick={() => setSerieId('profit')}
        >
          <div className={styles.widgetAccent}>{formatFinancial(currentPeriodData.profit)}</div>
          <div>
            <span>{t('admin.dashboard.salesWidget.profit')}</span>
            <PercentageChange className="small ml-2" peak={currentPeriodData.profit} base={previousPeriodData.profit} />
          </div>
        </div>
        <div
          role="button"
          className={`flex-sm-fill text-sm-center nav-link ${serieId === 'receipts' ? 'active' : ''}`}
          onClick={() => setSerieId('receipts')}
        >
          <div className={styles.widgetAccent}>{currentPeriodData.receipts}</div>
          <div>
            <span>{t('admin.dashboard.salesWidget.receipts')}</span>
            <PercentageChange
              className="small ml-2"
              peak={currentPeriodData.receipts}
              base={previousPeriodData.receipts}
            />
          </div>
        </div>
        <div
          role="button"
          className={`flex-sm-fill text-sm-center nav-link ${serieId === 'median' ? 'active' : ''}`}
          onClick={() => setSerieId('median')}
        >
          <div className={styles.widgetAccent}>{formatFinancial(currentPeriodData.median)}</div>
          <div>
            <span>{t('admin.dashboard.salesWidget.average')}</span>
            <PercentageChange className="small ml-2" peak={currentPeriodData.median} base={previousPeriodData.median} />
          </div>
        </div>
      </nav>
      <div className={styles.chartBody}>
        <ResponsiveLine
          {...scale}
          data={seriesData[serieId]}
          margin={{ top: 10, right: 70, bottom: 60, left: 30 }}
          xFormat={(value) => ''}
          axisTop={null}
          axisLeft={null}
          colors={['var(--palette-info-main)', 'var(--palette-info-light)']}
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
                <span className="text-capitalize mr-1">{t(`admin.dashboard.salesWidget.${serieId}`)}</span>
                <strong>
                  {serieId === 'receipts'
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
          theme={{
            axis: { ticks: { text: { fontSize: 12 } } },
            grid: { line: { stroke: '#ddd', strokeWidth: '1px', strokeDasharray: '1 3' } },
          }}
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
              itemWidth: 80,
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
      <div className={styles.chartBody}>
        <ResponsiveBar
          data={currentPeriodData.groupedByHour}
          indexBy="date"
          keys={[serieId]}
          margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
          layout="vertical"
          colors={['var(--palette-info-main)', 'var(--palette-info-light)']}
          enableGridY={false}
          enableGridX={true}
        />
      </div>
      <div className={styles.chartBody}>
        <ResponsiveBar
          data={currentPeriodData.groupedByWeekday}
          indexBy="weekday"
          keys={[serieId]}
          margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
          layout="vertical"
          colors={['var(--palette-info-main)', 'var(--palette-info-light)']}
          enableGridY={false}
          enableGridX={true}
        />
      </div>
    </div>
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
      {renderChart}
    </Fragment>
  );

  return <CommonLayout head={renderHead} body={renderBody} />;
};

export default Dashboard;
