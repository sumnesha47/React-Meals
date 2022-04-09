import React, { useContext, useState } from "react";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [orderBtnClicked, setOrderBtnClicked] = useState(false);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItem = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setOrderBtnClicked(true);
  };

  const submitHandler = (userData) => {
    fetch(
      "https://react-meals-d56a6-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderdItems: cartCtx.items,
        }),
      }
    );
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );
  return (
    <Modal onHideCart={props.onHideCart}>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {orderBtnClicked && (
        <Checkout onConfirm={submitHandler} onCancel={props.onHideCart} />
      )}
      {!orderBtnClicked && (
        <div className={classes.actions}>
          <div className={classes.actions}>
            <button
              onClick={props.onHideCart}
              className={classes["button--alt"]}
            >
              Close
            </button>
            {hasItem && (
              <button onClick={orderHandler} className={classes.button}>
                Order
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default Cart;
