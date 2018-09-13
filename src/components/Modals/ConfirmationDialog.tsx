import * as React from 'react';
import moment from 'moment';

import { CartItem, StockItem } from '../../store/app';

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

import './ConfirmationDialog.css';

interface ConfirmationDialogProps {
  onSubmit: ((cartItem: CartItem) => void);
  item: StockItem;
  isOpen: boolean;
}

// Component-specific state.
interface State {
  readonly quantity: number;
}

class ConfirmationDialog extends React.Component<ConfirmationDialogProps, State> {
  readonly state: State = { quantity: 1 };

  handleCancel = () => this.closeDialog();
  handleOk = () => this.closeDialog(true);

  closeDialog = (submitData = false) => {
    const { item } = this.props;
    const { quantity } = this.state;
    if (submitData) {
      this.props.onSubmit({
        ...item,
        quantity,
        sum: item.price * quantity,
        time: moment(),
      });
    }
    this.setState({ quantity: 1 }); // reset state
  };

  renderDialog = () => {
    const { quantity } = this.state;
    const { item } = this.props;

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
                  value={quantity}
                  onChange={event => this.setState({ quantity: parseInt(event.target.value, 10) || 0 })}
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
    const { item, isOpen } = this.props;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        transitionDuration={0}
        open={isOpen}
        aria-labelledby="confirmation-dialog-title"
      >
        {item && isOpen && this.renderDialog()}
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
