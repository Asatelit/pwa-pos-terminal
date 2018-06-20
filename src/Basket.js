import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';

const styles = {
  basket: {
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #eaeaea',
    minWidth: '320px',
  },
  subheader: {
    margin: '1rem 0 .5rem',
  },
  content: {
    flex: '1 1 auto',
    overflow: 'auto',
  },
  footer: {
    paddingRight: '24px',
    paddingLeft: '24px',
    height: '90px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

class Basket extends React.Component {
  handleDelete = index => this.props.onRemove(index);
  handleConfirm = items => this.props.onConfirm(items);

  renderOrder = () => {
    const { items, classes } = this.props;
    const total = items.reduce((acc, obj) => acc + obj.sum, 0);
    return (
      <React.Fragment>
        <Typography className={classes.subheader} variant="caption" align="center">
          Текущий заказ:
        </Typography>
        <List className={classes.content}>
          {items.map((item, index) => (
            <ListItem key={`${item.id}-${index}`}>
              <ListItemAvatar>
                <Avatar src={item.picture} />
              </ListItemAvatar>
              <ListItemText
                primary={`${item.quantity} x ${item.name}`}
                secondary={item.description}
              />
              <ListItemSecondaryAction onClick={() => this.handleDelete(index)}>
                <IconButton aria-label="Delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <div className={classes.footer}>
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
    const { items, classes } = this.props;
    return (
      <div className={classes.basket}>{items.length ? this.renderOrder() : null}</div>
    );
  }
}

Basket.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default withStyles(styles)(Basket);
