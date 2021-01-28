import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { updateCart, deleteCart } from "../../features/user/userSlice";
import { toggleToast } from "../../features/ui/uiSlice";

const Product = (props) => {
  const dispatch = useDispatch();
  const id = props.id;
  const [inpValue, setInpValue] = useState(props.amount);
  const [amount, setAmount] = useState(props.amount);

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const handleChange = (e) => {
    if (isNaN(e.target.value)) {
      setInpValue(amount);
    } else if (parseInt(e.target.value) > 99) {
      setInpValue(99);
    } else {
      setInpValue(e.target.value);
    }
  };

  const updateAmount = (e) => {
    if (
      !e.target.value ||
      parseInt(e.target.value) === 0 ||
      parseInt(e.target.value) > 99
    ) {
      setInpValue(parseInt(amount));
    } else {
      setAmount(parseInt(e.target.value));
      setInpValue(parseInt(e.target.value));
    }
    // setTimeout(() => {
    //   console.log(amount, inpValue);

    // }, 0);
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

  const loaded = useRef(true);
  useEffect(() => {
    if (loaded.current) {
      loaded.current = false;
      return;
    }
    dispatch(updateCart({ id, amount })).then((unwrapResult) => {
      console.log(unwrapResult.payload);
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
  }, [dispatch, id, amount]);

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
          value={inpValue}
          onChange={handleChange}
          onBlur={updateAmount}
        />
        <p className="checkout__product--amount__total">Total:</p>
        <p className="checkout__product--amount__money">
          {formatter.format(parseFloat(inpValue * props.price) * 1000)}
        </p>
      </div>
    </div>
  );
};

export default Product;
