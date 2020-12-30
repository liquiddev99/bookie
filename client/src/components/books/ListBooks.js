import React, { Suspense, useState, useRef, useEffect } from "react";
import LazyLoad from "react-lazyload";
import { Link, withRouter } from "react-router-dom";

import Pagination from "./Pagination";
import SkeletonBook from "../skeleton/SkeletonBook";
const Book = React.lazy(() => import("./Book"));

const ListBooks = (props) => {
  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(!active);
  };

  const { status, listBooks, p, numbers, message, limit, q } = props;
  const path = props.location.pathname;

  const ref = useRef();
  const handleClickOutside = (e) => {
    if (
      ref.current.classList.contains("active") &&
      !ref.current.contains(e.target)
    ) {
      setActive(!active);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
  return (
    <>
      {status === "success" && (
        <div className="books__sort">
          <div
            className={`books__sort--limit${active ? " active" : ""}`}
            onClick={handleClick}
            ref={ref}
          >
            <p className="books__sort--limit__current">{`${limit} products`}</p>
            <ul
              className="books__sort--limit__option"
              onMouseLeave={handleClick}
            >
              <Link
                to={`${path}?${q ? "q=" : ""}${q ? q : ""}${
                  q ? "&" : ""
                }p=1&limit=15`}
                className="books__sort--limit__option--link"
              >
                <li>15 products</li>
              </Link>
              <Link
                to={`${path}?${q ? "q=" : ""}${q ? q : ""}${
                  q ? "&" : ""
                }p=1&limit=25`}
                className="books__sort--limit__option--link"
              >
                <li>25 products</li>
              </Link>
              <Link
                to={`${path}?${q ? "q=" : ""}${q ? q : ""}${
                  q ? "&" : ""
                }p=1&limit=50`}
                className="books__sort--limit__option--link"
              >
                <li>50 products</li>
              </Link>
            </ul>

            <div className="books__sort--limit__icon">
              <i className="fas fa-angle-down"></i>
            </div>
          </div>
        </div>
      )}
      {status === "success" &&
        listBooks.map((book) => (
          <LazyLoad key={book._id} placeholder={<SkeletonBook />}>
            <Suspense fallback={<SkeletonBook />}>
              <Book
                src={book.imgURL}
                title={book.title}
                price={parseFloat(book.price)}
                old_price={parseFloat(book.old_price)}
                key={book._id}
                id={book._id}
              />
            </Suspense>
          </LazyLoad>
        ))}
      {status === "failed" && <h1 className="error">{message}</h1>}
      {numbers > limit && (
        <Pagination numbers={numbers} limit={limit} p={p} q={q} />
      )}
    </>
  );
};

export default withRouter(ListBooks);
