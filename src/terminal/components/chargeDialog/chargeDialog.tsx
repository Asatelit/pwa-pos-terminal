import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, Redirect, useParams } from 'react-router-dom';
import { unformat, formatMoney } from 'accounting';
import { useTranslation } from 'react-i18next';
import { AppActions, Item, Order, OrderClosingReasons, Settings } from 'common/types';
import { ArrowLeftTwoTone } from 'common/icons';
import { Routes } from 'common/enums';
import { Numpad } from '../index';
import styles from './chargeDialog.module.css';

type ChargeDialogProps = {
  items: Item[];
  onPrintReceit: (orderId: string) => void;
  orders: Order[];
  actions: AppActions;
  settings: Settings;
};

const ChargeDialog: React.FC<ChargeDialogProps> = ({ actions, onPrintReceit, settings }) => {
  const [t] = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState({ cardPaymentAmount: '0.00', cashPaymentAmount: '0.00' });
  const [activePayment, setActivePayment] = useState<'cardPaymentAmount' | 'cashPaymentAmount'>('cashPaymentAmount');
  const [isPrintReceipt, setIsPrintReceipt] = useState(settings.printReceiptByDefault);
  const [redirect, setRedirect] = useState('');

  // handle redirect
  if (redirect) return <Redirect to={redirect} />;

  // order reference check
  if (!id) setRedirect(Routes.PageBadRequest);

  // get requested order
  const order = actions.orders.findById(id);

  // check if the requested order exists
  if (!order) {
    toast.error(t('common.errors.orderNotFound'));
    return <Redirect to={redirect} />;
  }

  const amount = state[activePayment];
  const cardPaymentAmount = unformat(state.cardPaymentAmount);
  const cashPaymentAmount = unformat(state.cashPaymentAmount);
  const totalPaymentAmount = cardPaymentAmount + cashPaymentAmount;
  const changeAmount = totalPaymentAmount - order.totalAmount;
  const hasChange = changeAmount > 0;

  // handlers

  const closeDialog = () => setRedirect(Routes.Terminal);

  const handleChargeOrder = (closingReason = OrderClosingReasons.Default) => {
    const isClosedWithoutPayment = closingReason !== OrderClosingReasons.Default;
    const chargeData = {
      closingReason,
      cardPaymentAmount: isClosedWithoutPayment ? 0 : cardPaymentAmount,
      cashPaymentAmount: isClosedWithoutPayment ? 0 : cashPaymentAmount,
      totalPaymentAmount: isClosedWithoutPayment ? 0 : totalPaymentAmount,
      cashChange: hasChange && !isClosedWithoutPayment ? changeAmount : 0,
      isDiscounted: false,
      customerId: 0,
    };
    actions.orders.charge(chargeData, order.id);
    if (isPrintReceipt) onPrintReceit(order.id);
    closeDialog();
  };

  const renderBody = () => (
    <div className={styles.orderBody}>
      <div
        tabIndex={1}
        className={`${styles.control} ${activePayment === 'cashPaymentAmount' ? styles.focused : ''}`}
        onFocus={() => setActivePayment('cashPaymentAmount')}
      >
        <div className={styles.controlLabel}>{t('common.cash')}</div>
        <div className={styles.controlInput}>{formatMoney(state.cashPaymentAmount)}</div>
      </div>
      <div
        className={`${styles.control} ${activePayment === 'cardPaymentAmount' ? styles.focused : ''}`}
        tabIndex={2}
        onFocus={() => setActivePayment('cardPaymentAmount')}
      >
        <div className={styles.controlLabel}>{t('common.creditCard')}</div>
        <div className={styles.controlInput}>{formatMoney(state.cardPaymentAmount)}</div>
      </div>
      <div className="form-check form-switch my-5">
        <input
          className="form-check-input"
          type="checkbox"
          id="chargeDialogReceiptPrint"
          checked={isPrintReceipt}
          onChange={(evt) => setIsPrintReceipt(evt.target.checked)}
        />
        <label className="form-check-label" htmlFor="chargeDialogReceiptPrint">
          {t('admin.settings.printReceiptLabel')}
        </label>
      </div>
    </div>
  );

  const renderFoot = () => (
    <div className={styles.orderFoot}>
      <select
        className="form-select w-auto"
        value={OrderClosingReasons.Default}
        onChange={(evt) => handleChargeOrder(parseInt(evt.target.value, 10))}
      >
        <optgroup label={t('common.closeWithoutPayment.hint')}>
          <option hidden value={OrderClosingReasons.Default}>
            {t('common.closeWithoutPayment.label')}
          </option>
          <option value={OrderClosingReasons.OnTheHouse}>{t('common.closeWithoutPayment.reasons.onTheHouse')}</option>
          <option value={OrderClosingReasons.CustomerIsGone}>
            {t('common.closeWithoutPayment.reasons.customerIsGone')}
          </option>
          <option value={OrderClosingReasons.Mistake}>{t('common.closeWithoutPayment.reasons.waitersMistake')}</option>
        </optgroup>
      </select>
      <button
        className="btn btn-primary btn-lg"
        disabled={totalPaymentAmount < order.totalAmount}
        onClick={() => handleChargeOrder()}
      >
        {t('common.confirm')}
      </button>
    </div>
  );

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.dialog}>
          <div className={styles.content}>
            <div className={styles.head}>
              <Link className={styles.closeBtn} to={Routes.Terminal}>
                <ArrowLeftTwoTone />
                <span>{t('common.back')}</span>
              </Link>
              <div className={styles.title}>{t('common.receipt#', { val: order.orderName })}</div>
            </div>
            <div className={styles.body}>
              <div className={styles.helper}>
                <div className={styles.numpad}>
                  <Numpad
                    value={amount}
                    expected={order.totalAmount}
                    onChange={(value) => setState({ ...state, [activePayment]: value })}
                  />
                </div>
              </div>
              <div className={styles.order}>
                <div className={styles.orderHead}>
                  <div>{`${t('common.total')} ${formatMoney(order.totalAmount)}`}</div>
                  <div className={styles.changeInfo}>
                    {hasChange
                      ? t('common.changeOutOf', {
                          change: formatMoney(changeAmount),
                          amount: formatMoney(totalPaymentAmount),
                        })
                      : ''}
                  </div>
                </div>
                {renderBody()}
                {renderFoot()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.backdrop} />
    </Fragment>
  );
};

export default ChargeDialog;
