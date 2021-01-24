import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";

import SkeletonBook from "../skeleton/SkeletonBook";
import { fetchBook, fetchListBooks } from "../../features/books/booksSlice";
import Book from "./Book";
import { addToCart } from "../../features/user/userSlice";
import { toggleToast } from "../../features/ui/uiSlice";

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={(className, "icon-related next")} onClick={onClick}>
      <i className="fas fa-arrow-circle-right"></i>
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={(className, "icon-related prev")} onClick={onClick}>
      <i className="fas fa-arrow-circle-left"></i>
    </div>
  );
};

const BookDetail = (props) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 6,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 510,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 430,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const id = props.match.params.id;
  const dispatch = useDispatch();
  const { book, status, message, listBooks } = useSelector(
    (state) => state.books
  );

  const [amount, setAmount] = useState(1);
  const [btnText, setBtnText] = useState("Add to Cart");
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
  const add = () => {
    setAmount(amount + 1);
  };
  const minus = () => {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  };
  useEffect(() => {
    dispatch(fetchBook(id)).then((item) => {
      if (!item.error) {
        const genre = item.payload ? item.payload.genre : null;
        const limit = 25;
        const p = 1;
        dispatch(fetchListBooks({ genre, limit, p }));
      }
    });
  }, [id, dispatch]);
  return (
    <div className="book-detail__wrapper">
      <div className="book-detail">
        {(status === "idle" || status === "loading") && <SkeletonBook />}
        {status === "success" && (
          <>
            <div className="book-detail__media">
              <img
                src={book.imgURL}
                alt="Book"
                className="book-detail__media--img"
              />
            </div>
            <div className="book-detail__content">
              <h1 className="book-detail__content--title">{book.title}</h1>

              <p className="book-detail__content--author">
                Author: <span>{book.author}</span>
              </p>

              <div className="book-detail__content--price">
                <p className="book-detail__content--price__special">
                  {parseFloat(book.price * 1000).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                <p className="book-detail__content--price__old">
                  {parseFloat(book.old_price * 1000).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>

              <div className="book-detail__content--amount">
                <p>Amount:</p>
                <div className="book-detail__content--amount__btn">
                  <i className="fas fa-minus" onClick={minus}></i>
                  <span>{amount}</span>
                  <i className="fas fa-plus" onClick={add}></i>
                </div>
              </div>

              <button
                className="book-detail__content--add"
                onClick={() => handleAddToCart(id, amount)}
              >
                {btnText}
              </button>
            </div>
          </>
        )}
        {status === "failed" && (
          <h1 className="book-detail__error">{message}</h1>
        )}
      </div>

      {status === "success" && (
        <div className="related">
          <p className="related__title">Related</p>
          <div className="related__slider--wrapper">
            <Slider {...settings} className="related__slider">
              {listBooks.length
                ? listBooks.map((item) => (
                    <Book
                      src={item.imgURL}
                      title={item.title}
                      price={parseFloat(item.price)}
                      old_price={parseFloat(item.old_price)}
                      key={item._id}
                      id={item._id}
                      hideButton={true}
                    />
                  ))
                : null}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
