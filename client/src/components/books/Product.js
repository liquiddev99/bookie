import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { updateCart } from "../../features/user/userSlice";

const Product = (props) => {
  const dispatch = useDispatch();
  const id = props.id;
  const [amount, setAmount] = useState(props.amount);

  const handleChange = (e) => {
    if (isNaN(e.target.value)) {
      setAmount(props.amount);
    } else {
      setAmount(e.target.value);
    }
  };

  const updateAmount = (e) => {
    if (!e.target.value) {
      setAmount(props.amount);
    }
    console.log(amount);
    dispatch(updateCart({ id, amount }));
  };

  return (
    <div className="checkout__product">
      <i className="fas fa-times"></i>
      <Link to={`/book/${id}`} className="checkout__product--img">
        <img src={props.imgURL} alt="Product" />
      </Link>
      <div className="checkout__product--detail">
        <p className="checkout__product--detail__name">{props.title}</p>
        <p className="checkout__product--detail__price">
          {parseFloat(props.price).toFixed(3)} đ
        </p>
        <p className="checkout__product--detail__old-price">
          {parseFloat(props.old_price).toFixed(3)} đ
        </p>
      </div>
      <div className="checkout__product--amount">
        <input
          type="text"
          value={amount}
          onChange={handleChange}
          onBlur={updateAmount}
        />
        <p className="checkout__product--amount__total">Total:</p>
        <p className="checkout__product--amount__money">
          {parseFloat(amount * props.price).toFixed(3)} đ
        </p>
      </div>
    </div>
  );
};

export default Product;
