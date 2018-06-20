import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
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

import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Basket from './Basket';
import ConfirmationDialog from './ConfirmationDialog';
import History from './History';

import * as appActionCreators from './actions/appActions';

import './App.css';

moment.locale('uk');

class App extends Component {
  state = { menuAnchorEl: null };

  componentDidMount() {
    this.props.appActions.requestMarketData();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    const colCount = Math.round((window.innerWidth - 320) / 240);
    this.props.appActions.updateColumnGrid(colCount);
  };

  handleOpenMenu = event => this.setState({ menuAnchorEl: event.currentTarget });
  handleCloseMenu = () => this.setState({ menuAnchorEl: null });
  handleOrderConfirm = () => this.props.appActions.updateOrderHistory(true);
  handleOrderCancel = () => this.props.appActions.updateOrderHistory(false);
  handleChangeTab = (event, index) => this.props.appActions.changeCategoryTab(index);
  handleOpenHistoryDialog = () => this.props.appActions.openHistoryDialog();
  handleCloseHistoryDialog = () => this.props.appActions.closeHistoryDialog();
  handleClearOrderHistory = () => this.props.appActions.clearOrderHistory();

  handleSelectProduct = productItem =>
    this.props.appActions.openProductDialog(productItem);

  handleSubmitProductDialog = cartItem =>
    this.props.appActions.closeProductDialog(cartItem);

  handleRemoveItemFromCart = itemIndex =>
    this.props.appActions.removeItemFromCart(itemIndex);

  renderGrid = data =>
    data && data.length ? (
      <GridList cellHeight={250} cols={this.props.app.columnsCount} className="GridList">
        {data.map(tile => (
          <GridListTile key={tile.id} onClick={() => this.handleSelectProduct(tile)}>
            <img className="Image" src={tile.picture} alt={tile.name} />
            <GridListTileBar
              title={tile.name}
              subtitle={`${tile.price} грн`}
              classes={{ root: 'GridTitle-root', titleWrap: 'GridTitle-wrap' }}
              actionIcon={
                <IconButton className="">
                  <AddIcon />
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
    const { app } = this.props;
    const {
      actualProductData,
      actualTabIdx,
      cart,
      orderHistory,
      summaryHistory,
      isProductDialogOpened,
      isHistoryDialogOpened,
    } = app;

    return app.stock.length ? (
      <Typography component="div" className="App">
        <AppBar position="static" classes={{ root: 'AppBar' }}>
          <Tabs
            classes={{ root: 'Tabs' }}
            value={actualTabIdx}
            onChange={this.handleChangeTab}
          >
            {app.stock.map(item => <Tab key={item.group} label={item.group} />)}
          </Tabs>
          <div style={{ position: 'relative' }}>
            <IconButton color="inherit" onClick={this.handleOpenMenu}>
              <MoreVertIcon />
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
            {this.renderGrid(app.stock[actualTabIdx].items)}
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

App.propTypes = {
  // App Reducer
  app: PropTypes.shape({
    actualProductData: PropTypes.object,
    actualTabIdx: PropTypes.number,
    cart: PropTypes.array,
    stock: PropTypes.array,
    orderHistory: PropTypes.array,
    summaryHistory: PropTypes.array,
    isProductDialogOpened: false,
    isHistoryDialogOpened: false,
    columnsCount: PropTypes.number,
  }).isRequired,

  // Actions Creators
  appActions: PropTypes.shape({
    requestMarketData: PropTypes.func,
    changeCategoryTab: PropTypes.func,
    openProductDialog: PropTypes.func,
    openHistoryDialog: PropTypes.func,
    closeProductDialog: PropTypes.func,
    removeItemFromCart: PropTypes.func,
    updateOrderHistory: PropTypes.func,
    clearOrderHistory: PropTypes.func,
    closeHistoryDialog: PropTypes.func,
    updateColumnGrid: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  app: state.app,
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActionCreators, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
