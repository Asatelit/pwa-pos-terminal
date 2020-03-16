import React, { Fragment, useContext, useState } from 'react';
import { printComponent } from 'react-print-tool';
import { Switch, Route } from 'react-router-dom';
import { AppContext } from 'hooks';
import { Routes } from 'common/const';
import { LoadScreen } from 'common/components';
import { Menu, Receipt, Items, ItemEditor, ChargeDialog, ReceiptsDialog, Drawer, PrintReceipt } from './components';
import styles from './terminal.module.css';

type TerminalState = {
  isOpenReceiptsDialog: boolean;
  isOpenDrawer: boolean;
};

const Terminal: React.FC = () => {
  const [context, updateContext, services] = useContext(AppContext);
  const [state, setState] = useState<TerminalState>({ isOpenReceiptsDialog: false, isOpenDrawer: false });
  const {
    isLoading,
    categories,
    currentCategoryId,
    currentOrderId,
    currentItemId,
    orders,
    products,
  } = context;

  const updateState = (data: Partial<TerminalState>) => setState({ ...state, ...data });
  const currentOrder = orders.find(order => currentOrderId === order.id) || null;
  const hasEditItemRequest = !!currentItemId;

  const handlePrint = (orderId: number) => printComponent(<PrintReceipt orderId={orderId} state={context} />);

  // Drawer
  const renderDrawer = state.isOpenDrawer && <Drawer onClose={() => updateState({ isOpenDrawer: false })} />;

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

  if (isLoading) return <LoadScreen />;

  return (
    <Switch>
      <Fragment>
        <Route path={Routes.TerminalOrderCharge}>
          <ChargeDialog items={products} orders={orders} services={services} onPrintReceit={handlePrint} />
        </Route>
        {renderReceiptsDialog}
        {renderItemEditor}
        {renderDrawer}
        <div className={styles.root}>
          <div className={styles.content}>
            <Receipt
              items={products}
              order={currentOrder}
              orderId={currentOrderId}
              services={services}
              onShowReceipts={() => updateState({ isOpenReceiptsDialog: true })}
              onPrintCheck={handlePrint}
            />
            <div className={styles.items}>
              <Menu onOpenDrawer={() => updateState({ isOpenDrawer: true })} />
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
    </Switch>
  );
};

export default Terminal;
