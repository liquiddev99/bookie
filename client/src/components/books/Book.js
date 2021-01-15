import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { addToCart } from "../../features/user/userSlice";

const Book = (props) => {
  const dispatch = useDispatch();
  const id = props.id;
  const amount = 1;

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
            onClick={() => dispatch(addToCart({ id, amount }))}
            className="book__content--button"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Book;
