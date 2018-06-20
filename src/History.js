import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  subheader: {
    margin: '1rem',
  },
};

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

class History extends React.Component {
  handleClear = () => this.props.onClear();
  handleClose = () => this.props.onClose();

  render() {
    const { isOpen, classes, operations, summary } = this.props;
    return (
      <Dialog fullScreen TransitionComponent={Transition} open={isOpen}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit" aria-label="Close" onClick={this.handleClose}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Информация о заказах
            </Typography>
            <Button color="inherit" onClick={this.handleClear}>
              Очистить
            </Button>
          </Toolbar>
        </AppBar>

        <Typography className={classes.subheader} variant="subheading" align="center">
          Операционный отчет
        </Typography>
        <div className="TableWrapper">
          <Table className="Table">
            <TableHead>
              <TableRow>
                <TableCell>Открытие заказа</TableCell>
                <TableCell>Закрытие заказа</TableCell>
                <TableCell>Затраченное время</TableCell>
                <TableCell numeric>Количество позиций</TableCell>
                <TableCell numeric>Общее кол-во товаров</TableCell>
                <TableCell numeric>Сумма ордера</TableCell>
                <TableCell>Статус ордера</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!operations.length && (
                <TableRow>
                  <TableCell colSpan="7">Нет данных о проведенных операциях</TableCell>
                </TableRow>
              )}
              {operations.map(item => (
                <TableRow key={item.closeTime} hover>
                  <TableCell>{moment(item.startTime).format('L LT')}</TableCell>
                  <TableCell>{moment(item.closeTime).format('L LT')}</TableCell>
                  <TableCell>{moment(item.turnaroundTime).format('mm:ss')}</TableCell>
                  <TableCell numeric>{item.numberOfSKU}</TableCell>
                  <TableCell numeric>{item.numberOfItems}</TableCell>
                  <TableCell numeric>{item.summary}</TableCell>
                  <TableCell>{item.status ? 'Выполнен' : 'Отменен'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Typography className={classes.subheader} variant="subheading" align="center">
          Сводка по товарным позициям
        </Typography>
        <div className="TableWrapper">
          <Table className="Table">
            <TableHead>
              <TableRow>
                <TableCell>Идентификатор</TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell numeric>Количество</TableCell>
                <TableCell numeric>Всего</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!operations.length && (
                <TableRow>
                  <TableCell colSpan="7">Нет данных по товарным позициям</TableCell>
                </TableRow>
              )}
              {summary.map(item => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell numeric>{item.quantity}</TableCell>
                  <TableCell numeric>{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Dialog>
    );
  }
}

History.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  operations: PropTypes.array.isRequired,
  summary: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  onClear: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(History);
