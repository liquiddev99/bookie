import React from "react";
import { useSelector } from "react-redux";

import Product from "./Product";

const Checkout = () => {
  const { cart } = useSelector((state) => state.user);
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
    </div>
  );
};

export default Checkout;
