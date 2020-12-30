import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";

import { fetchListBooks } from "../../features/books/booksSlice";
import SkeletonBook from "../skeleton/SkeletonBook";
import ListBooks from "./ListBooks";

const BooksGenre = (props) => {
  const dispatch = useDispatch();
  const { status, numbers, listBooks, message } = useSelector(
    (state) => state.books
  );

  let genre = props.match.params.genre;
  let { limit, p } = queryString.parse(props.location.search);
  limit = limit || 25;
  p = p || 1;
  genre = genre.replace("-", " ");

  useEffect(() => {
    const getListBooks = async () => {
      await dispatch(fetchListBooks({ genre, limit, p }));
    };
    getListBooks();
  }, [genre, limit, p, dispatch]);

  return (
    <div className="books">
      {status === "idle" || status === "loading" ? (
        Array.from(Array(10).keys()).map((n) => <SkeletonBook key={n} />)
      ) : (
        <>
          {status === "success" && (
            <div className="books__desc">{listBooks[0].genre}</div>
          )}
          <ListBooks
            status={status}
            listBooks={listBooks}
            message={message}
            numbers={numbers}
            p={p}
            limit={limit}
          />
        </>
      )}
    </div>
  );
};
export default BooksGenre;
