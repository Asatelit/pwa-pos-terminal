import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as moment from 'moment';
import 'moment/locale/uk';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Add from '@material-ui/icons/Add';
import MoreVert from '@material-ui/icons/MoreVert';

import Basket from './components/Layout/Basket';
import ConfirmationDialog from './components/Modals/ConfirmationDialog';
import History from './components/Modals/History';

import { ApplicationState } from './store';
import { CartItem, StockItem, OrderHistoryItem, SummaryHistoryItem, StockGroup, Image } from './store/app';
import * as appActions from './store/app/actions';

import './App.css';

moment.locale('uk');

// Props passed from mapStateToProps
interface PropsFromState {
  actualProductData: StockItem;
  actualTabIdx: number;
  cart: CartItem[];
  stock: StockGroup[];
  orderHistory: OrderHistoryItem[];
  summaryHistory: SummaryHistoryItem[];
  isProductDialogOpened: boolean;
  isHistoryDialogOpened: boolean;
  images: Image;
  columnsCount: number;
}

// Props passed from mapDispatchToProps
interface PropsFromDispatch {
  requestMarketData: typeof appActions.requestMarketData;
  changeCategoryTab: typeof appActions.changeCategoryTab;
  openProductDialog: typeof appActions.openProductDialog;
  openHistoryDialog: typeof appActions.openHistoryDialog;
  closeProductDialog: typeof appActions.closeProductDialog;
  removeItemFromCart: typeof appActions.removeItemFromCart;
  updateOrderHistory: typeof appActions.updateOrderHistory;
  clearOrderHistory: typeof appActions.clearOrderHistory;
  closeHistoryDialog: typeof appActions.closeHistoryDialog;
  updateColumnGrid: typeof appActions.updateColumnGrid;
}

// Component-specific state.
interface State {
  readonly menuAnchorEl: null | HTMLElement;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AppContainerProps = PropsFromState & PropsFromDispatch;

class App extends React.Component<AppContainerProps, State> {
  readonly state: State = { menuAnchorEl: null };

  componentDidMount() {
    this.props.requestMarketData();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    const colCount = Math.round.apply((window.innerWidth - 320) / 240);
    this.props.updateColumnGrid(colCount);
  };

  handleOpenMenu = (event: React.MouseEvent) => this.setState({ menuAnchorEl: event.currentTarget as HTMLElement });
  handleCloseMenu = () => this.setState({ menuAnchorEl: null });
  handleOrderConfirm = () => this.props.updateOrderHistory(true);
  handleOrderCancel = () => this.props.updateOrderHistory(false);
  handleChangeTab = (event: React.ChangeEvent<{}>, index: number) => this.props.changeCategoryTab(index);
  handleOpenHistoryDialog = () => this.props.openHistoryDialog();
  handleCloseHistoryDialog = () => this.props.closeHistoryDialog();
  handleClearOrderHistory = () => this.props.clearOrderHistory();

  handleSelectProduct = (productItem: StockItem) => this.props.openProductDialog(productItem);

  handleSubmitProductDialog = (cartItem: CartItem) =>
    this.props.closeProductDialog(cartItem);

  handleRemoveItemFromCart = (itemIndex: number) =>
    this.props.removeItemFromCart(itemIndex);

  renderGrid = (data: StockItem[]) =>
    data && data.length ? (
      <GridList cellHeight={250} cols={this.props.columnsCount} className="GridList">
        {data.map(tile => (
          <GridListTile key={tile.id} onClick={() => this.handleSelectProduct(tile)}>
            <img className="Image" src={this.props.images[tile.picture]} alt={tile.name} />
            <GridListTileBar
              title={tile.name}
              subtitle={`${tile.price} грн`}
              classes={{ root: 'GridTitle-root', titleWrapActionPosRight: 'GridTitle-wrap' }}
              actionIcon={
                <IconButton className="">
                  <Add />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    ) : (
      <div>Отсутствуют данные об ассортименте.</div>
    );

  render() {
    const { menuAnchorEl } = this.state;
    const {
      actualProductData,
      actualTabIdx,
      cart,
      orderHistory,
      stock,
      summaryHistory,
      isProductDialogOpened,
      isHistoryDialogOpened,
    } = this.props;

    return stock.length ? (
      <Typography component="div" className="App">
        <AppBar position="static" classes={{ root: 'AppBar' }}>
          <Tabs
            classes={{ root: 'Tabs' }}
            value={actualTabIdx}
            onChange={this.handleChangeTab}
          >
            {stock.map(entry => <Tab key={entry.group} label={entry.group} />)}
          </Tabs>
          <div style={{ position: 'relative' }}>
            <IconButton color="inherit" onClick={this.handleOpenMenu}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={this.handleCloseMenu}
            >
              <MenuItem disabled={!cart.length} onClick={this.handleOrderCancel}>Отменить текущий заказ</MenuItem>
              <MenuItem onClick={this.handleOpenHistoryDialog}>История заказов</MenuItem>
            </Menu>
          </div>
        </AppBar>
        <div className="App-content">
          <div className="TabContainer">
            {this.renderGrid(stock[actualTabIdx].items)}
          </div>
          <Basket
            items={cart}
            onRemove={this.handleRemoveItemFromCart}
            onConfirm={this.handleOrderConfirm}
          />
        </div>
        <History
          isOpen={isHistoryDialogOpened}
          summary={summaryHistory}
          operations={orderHistory}
          onClose={this.handleCloseHistoryDialog}
          onClear={this.handleClearOrderHistory}
        />
        <ConfirmationDialog
          isOpen={isProductDialogOpened}
          item={actualProductData}
          onSubmit={this.handleSubmitProductDialog}
        />
      </Typography>
    ) : (
      <div>Загрузка данных...</div>
    );
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ app }: ApplicationState) => ({
  actualProductData: app.actualProductData,
  actualTabIdx: app.actualTabIdx,
  cart: app.cart,
  columnsCount: app.columnsCount,
  images: app.images,
  isHistoryDialogOpened: app.isHistoryDialogOpened,
  isProductDialogOpened: app.isProductDialogOpened,
  orderHistory: app.orderHistory,
  stock: app.stock,
  summaryHistory: app.summaryHistory,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  changeCategoryTab: appActions.changeCategoryTab,
  clearOrderHistory: appActions.clearOrderHistory,
  closeHistoryDialog: appActions.closeHistoryDialog,
  closeProductDialog: appActions.closeProductDialog,
  openHistoryDialog: appActions.openHistoryDialog,
  openProductDialog: appActions.openProductDialog,
  removeItemFromCart: appActions.removeItemFromCart,
  requestMarketData: appActions.requestMarketData,
  updateColumnGrid: appActions.updateColumnGrid,
  updateOrderHistory: appActions.updateOrderHistory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
