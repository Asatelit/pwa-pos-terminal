import React, { Fragment, useState } from 'react';
import { Order, Product, TerminalServices, OrderClosingReasons } from 'types';
import { ArrowLeftTwoTone } from 'icons';
import { financial } from 'utils';
import { Numpad } from '../index';
import styles from './chargeDialog.module.css';

type ChargeDialogProps = {
  orderId: number;
  order: Order | null;
  products: Product[];
  services: TerminalServices;
};

const ChargeDialog: React.FC<ChargeDialogProps> = ({ orderId, order, products, services }) => {
  const [ref, setRef] = useState();
  const [state, setState] = useState({ cardPaymentAmount: '0', cashPaymentAmount: '0' });

  if (!order) return null;

  // state helpers
  const setCashPaymentAmount = (cashPaymentAmount: string) => setState({ ...state, cashPaymentAmount });
  const setCardPaymentAmount = (cardPaymentAmount: string) => setState({ ...state, cardPaymentAmount });

  const setActiveInput = (event: React.FocusEvent<HTMLInputElement>) => setRef(event.target.id);

  // helpers
  const closedOrder = {
    ...order,
    cardPaymentAmount: parseFloat(state.cardPaymentAmount),
    cashPaymentAmount: parseFloat(state.cashPaymentAmount),
    closingReason: OrderClosingReasons.Default,
    changeAmount: 0,
    cashChange: 0,
  };

  const totalAmount = closedOrder.cardPaymentAmount + closedOrder.cashPaymentAmount;
  const changeAmount = totalAmount - closedOrder.totalAmount;
  const hasChange = changeAmount > 0;

  // handlers
  const handleCloseDialog = () => services.setChargingOrder(0);
  const handleChargeOrder = () =>
    services.chargeOrder({ ...closedOrder, cashChange: hasChange ? changeAmount : 0 }, orderId);
  const handleCloseWithoutPayment = (closingReason: OrderClosingReasons) =>
    services.chargeOrder({ ...closedOrder, closingReason }, orderId);

  return (
    <Fragment>
      <div className={styles.root}>
        <div className={styles.dialog}>
          <div className={styles.content}>
            <div className={styles.head}>
              <button className={styles.closeBtn} onClick={handleCloseDialog}>
                <ArrowLeftTwoTone />
                <span>Back</span>
              </button>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>Receipt {order.orderName}</span>
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
                    {hasChange ? `${financial(changeAmount)} change out of ${financial(totalAmount)}` : ''}
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
                    disabled={totalAmount < order.totalAmount}
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
