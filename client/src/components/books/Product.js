import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { updateCart, deleteCart } from "../../features/user/userSlice";
import { toggleToast } from "../../features/ui/uiSlice";

const Product = (props) => {
  const dispatch = useDispatch();
  const id = props.id;
  const [amount, setAmount] = useState(props.amount);

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

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
    dispatch(updateCart({ id, amount })).then((unwrapResult) => {
      if (unwrapResult.meta.requestStatus === "fulfilled") {
        dispatch(
          toggleToast({
            display: true,
            type: "success",
            msg: "Updated Cart",
          })
        );
        setTimeout(() => {
          dispatch(toggleToast({ display: false, type: "", msg: "" }));
        }, 2500);
      }
    });
  };

  const deleteProduct = (id) => {
    dispatch(deleteCart(id)).then((unwrapResult) => {
      if (unwrapResult.meta.requestStatus === "fulfilled") {
        dispatch(
          toggleToast({
            display: true,
            type: "success",
            msg: "Removed Product",
          })
        );
        setTimeout(() => {
          dispatch(toggleToast({ display: false, type: "", msg: "" }));
        }, 2500);
      }
    });
  };

  return (
    <div className="checkout__product">
      <i className="fas fa-times" onClick={() => deleteProduct(id)}></i>
      <Link to={`/book/${id}`} className="checkout__product--img">
        <img src={props.imgURL} alt="Product" />
      </Link>
      <div className="checkout__product--detail">
        <p className="checkout__product--detail__name">{props.title}</p>
        <p className="checkout__product--detail__price">
          {formatter.format(parseFloat(props.price) * 1000)}
        </p>
        <p className="checkout__product--detail__old-price">
          {formatter.format(parseFloat(props.old_price) * 1000)}
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
          {formatter.format(parseFloat(amount * props.price) * 1000)}
        </p>
      </div>
    </div>
  );
};

export default Product;
