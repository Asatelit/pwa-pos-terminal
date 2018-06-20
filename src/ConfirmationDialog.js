import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

class ConfirmationDialog extends React.Component {
  state = { quantity: 1 };

  handleCancel = () => this.closeDialog();
  handleOk = () => this.closeDialog(true);

  closeDialog = (submitData = false) => {
    const { item } = this.props;
    const { quantity } = this.state;
    this.props.onSubmit(
      submitData
        ? {
            ...item,
            quantity: parseFloat(quantity, 10),
            sum: parseFloat(item.price * quantity, 10),
            time: moment(),
          }
        : null,
    );

    this.setState({ quantity: 1 }); // reset state
  };

  renderDialog = () => {
    const { quantity } = this.state;
    const { item, isOpen } = this.props;

    return (
      <React.Fragment>
        <DialogTitle id="confirmation-dialog-title">{item.name}</DialogTitle>
        <DialogContent className="DialogContent">
          <div className="DialogContent-left">
            <img
              height="140"
              className="Image"
              src={item.picture}
              alt={item.name}
            />
          </div>
          <div className="DialogContent-right">
            <div>
              <IconButton
                disabled={quantity <= 1}
                color="primary"
                onClick={() => this.setState({ quantity: quantity - 1 })}
              >
                <RemoveIcon />
              </IconButton>
              <FormControl>
                <Input
                  disableUnderline
                  classes={{ root: 'QtyInput' }}
                  margin="dense"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={event => this.setState({ quantity: event.target.value || 0 })}
                />
              </FormControl>
              <IconButton
                disabled={quantity >= 99}
                color="primary"
                onClick={() => this.setState({ quantity: quantity + 1 })}
              >
                <AddIcon />
              </IconButton>
            </div>
            <div>
              <Typography gutterBottom variant="caption">
                {item.price} грн x {quantity} = {item.price * quantity} грн
              </Typography>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="default">
            Отменить
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  };

  render() {
    const { isOpen } = this.props;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        transitionDuration={0}
        open={isOpen}
        aria-labelledby="confirmation-dialog-title"
      >
        {isOpen && this.renderDialog()}
      </Dialog>
    );
  }
}

ConfirmationDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ConfirmationDialog;
