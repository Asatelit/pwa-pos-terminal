import * as React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { CartItem } from '../../store/app';

import './Basket.css';

interface BasketProps {
  items: CartItem[];
  onConfirm: (items: CartItem[]) => void;
  onRemove: (index: number) => void;
}

class Basket extends React.Component<BasketProps> {
  handleDelete = (index: number) => this.props.onRemove(index);
  handleConfirm = (items: CartItem[]) => this.props.onConfirm(items);

  renderOrder = () => {
    const { items } = this.props;
    const total = items.reduce((acc, obj) => acc + obj.sum, 0);
    return (
      <React.Fragment>
        <Typography className="Basket-subheader" variant="caption" align="center">
          Текущий заказ:
        </Typography>
        <List className="Basket-list">
          {items.map((item, index) => (
            <ListItem key={`${item.id}-${index}`}>
              <ListItemAvatar>
                <Avatar src={item.picture} />
              </ListItemAvatar>
              <ListItemText
                primary={`${item.quantity} x ${item.name}`}
                secondary={item.description}
              />
              <ListItemSecondaryAction>
                <IconButton aria-label="Delete" onClick={() => this.handleDelete(index)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <div className="Basket-footer">
          <Typography gutterBottom variant="subheading">
            Итого: {total} грн
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={() => this.handleConfirm(items)}
          >
            Выполнено
          </Button>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { items } = this.props;
    return (
      <div className="Basket-container">{items.length ? this.renderOrder() : null}</div>
    );
  }
}

export default Basket;
