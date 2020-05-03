import React, { Fragment, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import {
  Order,
  AppActions,
  OrderClosingReasons,
  OrderStatuses,
  ClosedOrder,
  ClosedOrderItem,
  Item,
} from 'common/types';
import { ArrowLeftTwoTone } from 'common/icons';
import { financial, round, calcSum } from 'common/utils';
import { getOrderById } from 'common/helpers';
import { Routes } from 'common/const';
import { Numpad } from '../index';
import styles from './chargeDialog.module.css';

type ChargeDialogProps = {
  items: Item[];
  orders: Order[];
  services: AppActions;
  onPrintReceit: (orderId: number) => void;
};

const ChargeDialog: React.FC<ChargeDialogProps> = ({ orders, items, services, onPrintReceit }) => {
  const { id } = useParams();
  const [ref, setRef] = useState<string>('');
  const [state, setState] = useState({ cardPaymentAmount: '0', cashPaymentAmount: '0' });
  const [redirect, setRedirect] = useState('');

  // handle redirect
  if (redirect) return <Redirect to={redirect} />;

  // order reference check
  if (!id) setRedirect(Routes.PageBadRequest);
  const order = getOrderById(orders, Number(id));

  // helpers
  const setCashPaymentAmount = (cashPaymentAmount: string) => setState({ ...state, cashPaymentAmount });
  const setCardPaymentAmount = (cardPaymentAmount: string) => setState({ ...state, cardPaymentAmount });
  const setActiveInput = (event: React.FocusEvent<HTMLInputElement>) => setRef(event.target.id);

  const cardPaymentAmount = parseFloat(state.cardPaymentAmount);
  const cashPaymentAmount = parseFloat(state.cashPaymentAmount);
  const totalPaymentAmount = cardPaymentAmount + cashPaymentAmount;
  const changeAmount = totalPaymentAmount - order.totalAmount;
  const hasChange = changeAmount > 0;

  const closedOrderItems: ClosedOrderItem[] = order.items.map((entity) => {
    const costPrice = items.find(item => item.id === entity.id)?.costPrice || 0;
    const amount = entity.quantity * entity.price;
    const item: ClosedOrderItem = {
      ...entity,
      costPrice,
      amount,
      profit: amount - entity.quantity * costPrice,
      roundedAmount: round(entity.quantity * entity.price),
      isWeighing: false,
      isNonDiscounted: false,
    };
    return item;
  });

  const closedOrder: ClosedOrder = {
    ...order,
    cardPaymentAmount,
    cashPaymentAmount,
    totalPaymentAmount,
    isDiscounted: false,
    customerId: 0,
    status: OrderStatuses.Closed,
    closingReason: OrderClosingReasons.Default,
    cashChange: changeAmount,
    totalRoundedAmount: calcSum(closedOrderItems, 'roundedAmount'),
    profit: calcSum(closedOrderItems, 'profit'),
    items: closedOrderItems,
  };

  // handlers

  const closeDialog = () => setRedirect(Routes.Terminal);

  const handleChargeOrder = () => {
    services.orders.charge({ ...closedOrder, cashChange: hasChange ? changeAmount : 0 }, order.id);
    onPrintReceit(order.id);
    closeDialog();
  };

  const handleCloseWithoutPayment = (closingReason: OrderClosingReasons) => {
    services.orders.charge({ ...closedOrder, closingReason }, order.id);
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
                <span>Back</span>
              </Link>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>Receipt #{order.orderName}</span>
              </div>
            </div>
            <div className={styles.body}>
              <div className={styles.helper}>
                <div className={styles.numpad}>
                  <Numpad inputId={ref} onChange={value => setState({ ...state, ...value })} />
                </div>
              </div>
              <div className={styles.order}>
                <div className={styles.orderHead}>
                  <div>Total {financial(order.totalAmount)}</div>
                  <div className={styles.changeInfo}>
                    {hasChange ? `${financial(changeAmount)} change out of ${financial(order.totalAmount)}` : ''}
                  </div>
                </div>
                <div className={styles.orderBody}>
                  <div tabIndex={0} className={styles.control}>
                    <div className={styles.controlLabel}>Cash</div>
                    <input
                      id="cashPaymentAmount"
                      type="text"
                      min={0}
                      autoFocus
                      className={styles.controlInput}
                      onFocus={setActiveInput}
                      onChange={evt => setCashPaymentAmount(evt.target.value)}
                      value={state.cashPaymentAmount || 0}
                    />
                  </div>
                  <div tabIndex={0} className={styles.control}>
                    <div className={styles.controlLabel}>Credit Card</div>
                    <input
                      id="cardPaymentAmount"
                      type="text"
                      min={0}
                      className={styles.controlInput}
                      onFocus={setActiveInput}
                      onChange={evt => setCardPaymentAmount(evt.target.value)}
                      value={state.cardPaymentAmount || 0}
                    />
                  </div>
                </div>
                <div className={styles.orderFoot}>
                  <select
                    className={styles.btnSecondary}
                    value={OrderClosingReasons.Default}
                    onChange={evt => handleCloseWithoutPayment(parseInt(evt.target.value, 10))}
                  >
                    <optgroup label="Please specify the reason">
                      <option hidden value={OrderClosingReasons.Default}>
                        Close without payment
                      </option>
                      <option value={OrderClosingReasons.OnTheHouse}>On the house</option>
                      <option value={OrderClosingReasons.CustomerIsGone}>Customer is gone</option>
                      <option value={OrderClosingReasons.Mistake}>Waiter's mistake</option>
                    </optgroup>
                  </select>
                  <button
                    className={styles.btnPrimary}
                    disabled={totalPaymentAmount < order.totalAmount}
                    onClick={handleChargeOrder}
                  >
                    Confirm
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
