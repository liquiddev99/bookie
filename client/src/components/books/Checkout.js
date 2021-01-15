import React from "react";
import { useSelector } from "react-redux";

import Product from "./Product";

const Checkout = () => {
  const { cart } = useSelector((state) => state.user);
  console.log(cart);

  return (
    <div className="checkout">
      <h1 className="checkout__title">Cart</h1>
      {cart &&
        cart.map((product) => (
          <Product
            id={product._id}
            key={product._id}
            amount={product.total}
            title={product.title}
            price={product.price}
            old_price={product.old_price}
            imgURL={product.imgURL}
          />
        ))}
      <div className="checkout__pay">
        <div className="checkout__pay--total">
          <p>Total:</p>
          <div>
            {cart
              .reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.total * currentValue.price * 1000,
                0
              )
              .toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
          </div>
        </div>

        <button className="checkout__pay--button">Pay</button>
      </div>
    </div>
  );
};

export default Checkout;
