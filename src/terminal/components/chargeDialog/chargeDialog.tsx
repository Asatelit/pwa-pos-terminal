import React, { Fragment, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppActions,
  AppTranslationHelper,
  Item,
  Order,
  OrderClosingReasons,
  OrderStatuses,
  Settings,
} from 'common/types';
import { ArrowLeftTwoTone } from 'common/icons';
import { getOrderById } from 'common/assets';
import { Routes } from 'common/enums';
import { Numpad } from '../index';
import styles from './chargeDialog.module.css';

type ChargeDialogProps = {
  items: Item[];
  onPrintReceit: (orderId: string) => void;
  orders: Order[];
  services: AppActions;
  settings: Settings;
  translation: AppTranslationHelper;
};

const ChargeDialog: React.FC<ChargeDialogProps> = ({
  translation,
  orders,
  services,
  onPrintReceit,
  settings,
}) => {
  const [t] = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [ref, setRef] = useState<string>('');
  const [state, setState] = useState({ cardPaymentAmount: '0', cashPaymentAmount: '0' });
  const [redirect, setRedirect] = useState('');
  const [closingReason, setClosingReason] = useState(OrderClosingReasons.Default);
  const { formatFinancial } = translation;

  // handle redirect
  if (redirect) return <Redirect to={redirect} />;

  // order reference check
  if (!id) setRedirect(Routes.PageBadRequest);
  const order = getOrderById(orders, id || null);

  // helpers
  const setCashPaymentAmount = (cashPaymentAmount: string) => setState({ ...state, cashPaymentAmount });
  const setCardPaymentAmount = (cardPaymentAmount: string) => setState({ ...state, cardPaymentAmount });
  const setActiveInput = (event: React.FocusEvent<HTMLInputElement>) => setRef(event.target.id);

  const cardPaymentAmount = parseFloat(state.cardPaymentAmount);
  const cashPaymentAmount = parseFloat(state.cashPaymentAmount);
  const totalPaymentAmount = cardPaymentAmount + cashPaymentAmount;
  const changeAmount = totalPaymentAmount - order.totalAmount;
  const hasChange = changeAmount > 0;

  // handlers

  const closeDialog = () => setRedirect(Routes.Terminal);

  const handleChargeOrder = () => {
    services.orders.charge(
      {
        cardPaymentAmount,
        cashPaymentAmount,
        closingReason,
        totalPaymentAmount,
        isDiscounted: false,
        customerId: 0,
        status: OrderStatuses.Closed,
        cashChange: hasChange ? changeAmount : 0,
      },
      order.id,
    );
    if (settings.printReceipt) onPrintReceit(order.id);
    closeDialog();
  };

  const handleCloseWithoutPayment = () => {
    services.orders.charge(
      {
        cardPaymentAmount,
        cashPaymentAmount,
        closingReason,
        totalPaymentAmount,
        isDiscounted: false,
        customerId: 0,
        status: OrderStatuses.Closed,
        cashChange: hasChange ? changeAmount : 0,
      },
      order.id,
    );
    closeDialog();
  };

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
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{t('common.receipt#', { val: order.orderName })}</span>
              </div>
            </div>
            <div className={styles.body}>
              <div className={styles.helper}>
                <div className={styles.numpad}>
                  <Numpad inputId={ref} onChange={(value) => setState({ ...state, ...value })} />
                </div>
              </div>
              <div className={styles.order}>
                <div className={styles.orderHead}>
                  <div>{`${t('common.total')} ${formatFinancial(order.totalAmount)}`}</div>
                  <div className={styles.changeInfo}>
                    {hasChange
                      ? t('common.changeOutOf', {
                          change: formatFinancial(changeAmount),
                          amount: formatFinancial(order.totalAmount),
                        })
                      : ''}
                  </div>
                </div>
                <div className={styles.orderBody}>
                  <div tabIndex={0} className={styles.control}>
                    <div className={styles.controlLabel}>{t('common.cash')}</div>
                    <input
                      id="cashPaymentAmount"
                      type="text"
                      min={0}
                      autoFocus
                      className={styles.controlInput}
                      onFocus={setActiveInput}
                      onChange={(evt) => setCashPaymentAmount(evt.target.value)}
                      value={state.cashPaymentAmount || 0}
                    />
                  </div>
                  <div tabIndex={0} className={styles.control}>
                    <div className={styles.controlLabel}>{t('common.creditCard')}</div>
                    <input
                      id="cardPaymentAmount"
                      type="text"
                      min={0}
                      className={styles.controlInput}
                      onFocus={setActiveInput}
                      onChange={(evt) => setCardPaymentAmount(evt.target.value)}
                      value={state.cardPaymentAmount || 0}
                    />
                  </div>
                </div>
                <div className={styles.orderFoot}>
                  <select
                    className={styles.btnSecondary}
                    value={OrderClosingReasons.Default}
                    onChange={(evt) => {
                      setClosingReason(parseInt(evt.target.value, 10));
                      handleCloseWithoutPayment();
                    }}
                  >
                    <optgroup label={t('common.closeWithoutPayment.hint')}>
                      <option hidden value={OrderClosingReasons.Default}>
                        {t('common.closeWithoutPayment.label')}
                      </option>
                      <option value={OrderClosingReasons.OnTheHouse}>
                        {t('common.closeWithoutPayment.reasons.onTheHouse')}
                      </option>
                      <option value={OrderClosingReasons.CustomerIsGone}>
                        {t('common.closeWithoutPayment.reasons.customerIsGone')}
                      </option>
                      <option value={OrderClosingReasons.Mistake}>
                        {t('common.closeWithoutPayment.reasons.waitersMistake')}
                      </option>
                    </optgroup>
                  </select>
                  <button
                    className={styles.btnPrimary}
                    disabled={totalPaymentAmount < order.totalAmount}
                    onClick={handleChargeOrder}
                  >
                    {t('common.confirm')}
                  </button>
                </div>
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
