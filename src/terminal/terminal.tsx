import React, { Fragment, useContext, useState, useEffect } from 'react';
import { printComponent } from 'react-print-tool';
import { Switch, Route } from 'react-router-dom';
import { AppContext } from 'common/hooks';
import { Routes } from 'common/const';
import { LoadScreen, PrintReceipt } from 'common/components';
import { Menu, Receipt, ItemList, ItemEditor, ChargeDialog, ReceiptsDialog, ReportDialog, Drawer } from './components';
import styles from './terminal.module.css';

type TerminalState = {
  isOpenReceiptsDialog: boolean;
  isOpenReportDialog: boolean;
  isOpenDrawer: boolean;
};

const Terminal: React.FC = () => {
  useEffect(() => {
    document.title = 'Asatelit POS | Terminal';
  }, []);

  const [context, services, views] = useContext(AppContext);
  const [state, setState] = useState<TerminalState>({
    isOpenReceiptsDialog: false,
    isOpenReportDialog: false,
    isOpenDrawer: false,
  });
  const { isLoading, categories, currentCategoryId, currentOrderId, currentItemId, orders, items } = context;

  const updateState = (data: Partial<TerminalState>) => setState({ ...state, ...data });
  const currentOrder = orders.find((order) => currentOrderId === order.id) || null;
  const hasEditItemRequest = !!currentItemId;

  const handlePrintReceipt = (orderId: string | null) =>
    printComponent(<PrintReceipt orderId={orderId} state={context} />);

  // Drawer
  const renderDrawer = state.isOpenDrawer && <Drawer onClose={() => updateState({ isOpenDrawer: false })} />;

  // Item Editor
  const renderItemEditor = hasEditItemRequest && (
    <ItemEditor order={currentOrder} orderItemId={currentItemId} products={items} services={services} />
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

  // Report Dialog
  const renderReportDialog = state.isOpenReportDialog && (
    <ReportDialog views={views} onClose={() => updateState({ isOpenReportDialog: false })} onPrint={printComponent} />
  );

  if (isLoading) return <LoadScreen />;

  return (
    <Switch>
      <Fragment>
        <Route path={Routes.TerminalOrderCharge}>
          <ChargeDialog items={items} orders={orders} services={services} onPrintReceit={handlePrintReceipt} />
        </Route>
        {renderReceiptsDialog}
        {renderReportDialog}
        {renderItemEditor}
        {renderDrawer}
        <div className={styles.root}>
          <div className={styles.content}>
            <Receipt
              items={items}
              order={currentOrder}
              orderId={currentOrderId}
              services={services}
              onShowReceipts={() => updateState({ isOpenReceiptsDialog: true })}
              onPrintCheck={handlePrintReceipt}
            />
            <div className={styles.items}>
              <Menu
                onOpenDrawer={() => updateState({ isOpenDrawer: true })}
                onOpenReport={() => updateState({ isOpenReportDialog: true })}
              />
              <ItemList
                categories={categories}
                items={items}
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
