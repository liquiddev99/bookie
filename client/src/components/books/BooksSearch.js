import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";

import { queryBooks } from "../../features/books/booksSlice";
import SkeletonBook from "../skeleton/SkeletonBook";
import ListBooks from "./ListBooks";

const BooksSearch = (props) => {
  const dispatch = useDispatch();
  const { status, numbers, listBooks, message } = useSelector(
    (state) => state.books
  );

  let { limit, p, q } = queryString.parse(props.location.search);
  limit = limit || 25;
  p = p || 1;
  useEffect(() => {
    const getQueriedBooks = async () => {
      await dispatch(queryBooks({ q, p, limit }));
    };
    getQueriedBooks();
  }, [limit, p, dispatch, q]);

  return (
    <div className="books">
      {status === "idle" || status === "loading" ? (
        Array.from(Array(10).keys()).map((n) => <SkeletonBook key={n} />)
      ) : (
        <>
          {status === "success" && (
            <div className="books__desc">Result for : {q}</div>
          )}
          <ListBooks
            status={status}
            listBooks={listBooks}
            message={message}
            numbers={numbers}
            p={p}
            limit={limit}
            q={q}
          />
        </>
      )}
    </div>
  );
};
export default BooksSearch;
