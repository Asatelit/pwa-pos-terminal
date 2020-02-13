import React, { Fragment, useContext, useState } from 'react';
import { Menu, Receipt, Items, ItemEditor, ChargeDialog, ReceiptsDialog, Drawer } from './components';
import { TerminalContext } from 'hooks';
import styles from './terminal.module.css';

type TerminalState = {
  isOpenReceiptsDialog: boolean;
  isOpenDrawer: boolean;
};

const Terminal: React.FC = () => {
  const [context, updateContext, services] = useContext(TerminalContext);
  const [state, setState] = useState<TerminalState>({ isOpenReceiptsDialog: false, isOpenDrawer: false });
  const { categories, currentCategoryId, currentOrderId, currentItemId, orders, products, chargingOrderId } = context;

  const updateState = (data: Partial<TerminalState>) => setState({ ...state, ...data });
  const currentOrder = orders.find(order => currentOrderId === order.id) || null;
  const hasChargeOrderRequest = !!chargingOrderId;
  const hasEditItemRequest = !!currentItemId;

  // Drawer
  const renderDrawer = state.isOpenDrawer && (
    <Drawer onClose={() => updateState({ isOpenDrawer: false })} />
  );

  // Charge Dialog
  const renderChargeDialog = hasChargeOrderRequest && (
    <ChargeDialog order={currentOrder} orderId={currentOrderId} products={products} services={services} />
  );

  // Item Editor
  const renderItemEditor = hasEditItemRequest && (
    <ItemEditor order={currentOrder} orderItemId={currentItemId} products={products} services={services} />
  );

  // Receipts Dialog
  const renderReceiptsDialog = state.isOpenReceiptsDialog && (
    <ReceiptsDialog
      orders={orders}
      orderId={currentOrderId}
      services={services}
      onClose={() => updateState({ isOpenReceiptsDialog: false })}
    />
  );

  return (
    <Fragment>
      {renderReceiptsDialog}
      {renderChargeDialog}
      {renderItemEditor}
      {renderDrawer}
      <div className={styles.root}>
        <div className={styles.menuWrapper}>
          <Menu onOpenDrawer={() => updateState({ isOpenDrawer: true })} />
        </div>
        <div className={styles.content}>
          <div className={styles.receiptWrapper}>
            <Receipt
              items={products}
              order={currentOrder}
              orderId={currentOrderId}
              services={services}
              onShowReceipts={() => updateState({ isOpenReceiptsDialog: true })}
            />
          </div>
          <div className={styles.goodsWrapper}>
            <Items
              categories={categories}
              products={products}
              currentCategoryId={currentCategoryId}
              services={services}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Terminal;
