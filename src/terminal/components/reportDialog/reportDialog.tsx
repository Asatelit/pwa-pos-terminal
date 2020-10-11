import React, { Fragment, useState } from 'react';
import { startOfToday, endOfToday, lightFormat, differenceInCalendarDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import { AppViews, AppTranslationHelper } from 'common/types';
import { WeekStartDays } from 'common/enums';
import { CloseTwoTone, CalendarRangeTwoTone } from 'common/icons';
import { getStaticRanges, getInputRanges } from './predefinedDateRanges';
import styles from './reportDialog.module.css';

type ReportDialogProps = {
  onClose: () => void;
  onPrint: (report: JSX.Element) => void;
  translation: AppTranslationHelper;
  views: AppViews;
  weekStartDay: WeekStartDays;
};

const ReportDialog: React.FC<ReportDialogProps> = ({ translation, views, onClose, onPrint, weekStartDay }) => {
  const { formatFinancial, locale, t } = translation;
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
      <button className="btn btn-icon" aria-label={t('common.close')} onClick={() => onClose()}>
        <CloseTwoTone color="inherit" />
      </button>
      <div className={styles.title}>{t('terminal.dailyReport.editingTitle')}</div>
      <button className="btn btn-primary" onClick={() => setIsReporting(true)}>
        {t('common.open')}
      </button>
    </Fragment>
  );

  const renderReportingHead = () => (
    <Fragment>
      <button className="btn btn-icon" aria-label={t('common.close')} onClick={() => onClose()}>
        <CloseTwoTone color="inherit" />
      </button>
      <div className={styles.title}>{t('terminal.dailyReport.openingTitle')}</div>
      <button className="btn btn-icon mr-1" onClick={() => setIsReporting(false)}>
        <CalendarRangeTwoTone color="inherit" />
      </button>
      <button className="btn btn-primary" onClick={handleOnClickOnPrint}>
        {t('common.print')}
      </button>
    </Fragment>
  );

  const renderDataRange = () => (
    <DateRangePicker
      className={styles.dateRange}
      direction="horizontal"
      howSelectionPreview={false}
      inputRanges={getInputRanges(t)}
      locale={locale}
      months={2}
      onChange={(e: any) => setSelectionRange(e.selection)}
      ranges={[selectionRange]}
      staticRanges={getStaticRanges(t)}
      weekStartsOn={weekStartDay === WeekStartDays.Auto ? undefined : weekStartDay}
    />
  );

  const renderReport = () => {
    const { startDate: start, endDate: end } = selectionRange;
    const { summary, items } = views.closedOrders.getItemsByDateRange({ start, end });
    const reportItems = Object.keys(items);

    return (
      <div className={styles.report}>
        <div className="ml-2 mr-2">
          <h3 className="mt-2 mb-4">{t('terminal.dailyReport.reportTitle')}</h3>
          <dl className="row mb-4">
            <dt className="col-sm-3">{t('terminal.dailyReport.daysIncluded')}</dt>
            <dd className="col-sm-9">{differenceInCalendarDays(end, start) + 1}</dd>
            <dt className="col-sm-3">{t('terminal.dailyReport.businessDate')}</dt>
            <dd className="col-sm-9">
              {lightFormat(start, 'yyyy-MM-dd HH:mm')} - {lightFormat(end, 'yyyy-MM-dd HH:mm')}
            </dd>
            <dt className="col-sm-3">{t('terminal.dailyReport.total')}</dt>
            <dd className="col-sm-9">{formatFinancial(summary.amount)}</dd>
          </dl>
        </div>

        {reportItems.length ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col" className="w-auto">
                  {t('common.item')}
                </th>
                <th scope="col" className="w-auto text-right">
                  {t('common.qty')}{' '}
                </th>
                <th scope="col" className="w-auto text-right">
                  {t('common.amount')}
                </th>
              </tr>
            </thead>
            <tbody>
              {reportItems.map((group) => (
                <tr key={group}>
                  <td className="w-auto">{group}</td>
                  <td className="w-auto text-right">{items[group].quantity}</td>
                  <td className="w-auto text-right">{formatFinancial(items[group].amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="border-top">
            <div className="mt-4">{t('terminal.dailyReport.emptyText')}</div>
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
