import React, { Fragment, useContext, useState, useEffect } from 'react';
import { printComponent } from 'react-print-tool';
import { Switch, Route } from 'react-router-dom';
import { appContext } from 'common/contexts';
import { Routes } from 'common/enums';
import { setDocumentTitle } from 'common/utils';
import { LoadScreen, PrintReceipt } from 'common/components';
import { Menu, Receipt, ItemList, ItemEditor, ChargeDialog, ReceiptsDialog, ReportDialog, Drawer } from './components';
import styles from './terminal.module.css';

type TerminalState = {
  isOpenReceiptsDialog: boolean;
  isOpenReportDialog: boolean;
  isOpenDrawer: boolean;
};

const Terminal: React.FC = () => {
  const [context, services, views, helpers] = useContext(appContext);
  const [state, setState] = useState<TerminalState>({
    isOpenReceiptsDialog: false,
    isOpenReportDialog: false,
    isOpenDrawer: false,
  });

  const { isLoading, categories, currentCategoryId, currentOrderId, currentItemId, orders, items, settings } = context;
  const { translation } = helpers;
  const { t } = translation;

  useEffect(() => {
    const title = [t('terminal.title')];
    setDocumentTitle(title);
  }, [t]);

  const updateState = (data: Partial<TerminalState>) => setState({ ...state, ...data });
  const currentOrder = orders.find((order) => currentOrderId === order.id) || null;
  const hasEditItemRequest = !!currentItemId;

  const handlePrintReceipt = (orderId: string | null) =>
    printComponent(
      <PrintReceipt orderId={orderId} state={context} format={translation.formatDate} translation={translation} />,
    );

  // Drawer
  const renderDrawer = state.isOpenDrawer && <Drawer onClose={() => updateState({ isOpenDrawer: false })} />;

  // Item Editor
  const renderItemEditor = hasEditItemRequest && (
    <ItemEditor
      order={currentOrder}
      orderItemId={currentItemId}
      products={items}
      services={services}
      translation={translation}
    />
  );

  // Receipts Dialog
  const renderReceiptsDialog = state.isOpenReceiptsDialog && (
    <ReceiptsDialog
      orders={orders}
      orderId={currentOrderId}
      services={services}
      tranaslation={translation}
      onClose={() => updateState({ isOpenReceiptsDialog: false })}
    />
  );

  // Report Dialog
  const renderReportDialog = state.isOpenReportDialog && (
    <ReportDialog
      views={views}
      onClose={() => updateState({ isOpenReportDialog: false })}
      onPrint={printComponent}
      translation={translation}
    />
  );

  if (isLoading) return <LoadScreen />;

  return (
    <Switch>
      <Fragment>
        <Route path={Routes.TerminalOrderCharge}>
          <ChargeDialog
            items={items}
            orders={orders}
            services={services}
            onPrintReceit={handlePrintReceipt}
            translation={translation}
            settings={settings}
          />
        </Route>
        {renderReceiptsDialog}
        {renderReportDialog}
        {renderItemEditor}
        {renderDrawer}
        <div className={styles.root}>
          <div className={styles.content}>
            <Receipt
              translation={translation}
              items={items}
              onPrintCheck={handlePrintReceipt}
              onShowReceipts={() => updateState({ isOpenReceiptsDialog: true })}
              order={currentOrder}
              orderId={currentOrderId}
              services={services}
              isPrintable={!settings.isDeniedPrintingGuestChecks}
            />
            <div className={styles.items}>
              <Menu
                onOpenDrawer={() => updateState({ isOpenDrawer: true })}
                onOpenReport={() => updateState({ isOpenReportDialog: true })}
              />
              <ItemList
                categories={categories}
                currentCategoryId={currentCategoryId}
                translation={translation}
                items={items}
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
