import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { addToCart } from "../../features/user/userSlice";
import { toggleToast } from "../../features/ui/uiSlice";

const Book = (props) => {
  const dispatch = useDispatch();
  const id = props.id;
  const amount = 1;
  const [btnText, setBtnText] = useState("Add to cart");

  const handleAddToCart = (id, amount) => {
    setBtnText("Adding...");
    dispatch(addToCart({ id, amount })).then((unwrapResult) => {
      setBtnText("Add to cart");
      if (unwrapResult.meta.requestStatus === "fulfilled") {
        dispatch(
          toggleToast({
            display: true,
            type: "success",
            msg: "Added product to Cart",
          })
        );
        setTimeout(() => {
          dispatch(toggleToast({ display: false, type: "", msg: "" }));
        }, 3500);
      } else {
        dispatch(
          toggleToast({
            display: true,
            type: "failure",
            msg: "Can't add product to cart, please try later",
          })
        );
        setTimeout(() => {
          dispatch(toggleToast({ display: false, type: "", msg: "" }));
        }, 3500);
      }
    });
  };

  return (
    <div className="book">
      <Link to={`/book/${props.id}`} className="book__link">
        <img className="book__link--img" src={props.src} alt=""></img>
      </Link>
      <div className="book__content">
        <div className="book__content--name">{props.title}</div>
        <div className="book__content--price">
          {(props.price * 1000).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </div>
        <div className="book__content--old-price">
          {(props.old_price * 1000).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </div>
        {props.hideButton ? null : (
          <button
            onClick={() => handleAddToCart(id, amount)}
            className="book__content--button"
          >
            {btnText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Book;
