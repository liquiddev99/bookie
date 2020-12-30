import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";

const Pagination = (props) => {
  const path = props.location.pathname;
  const { p, limit, numbers, q } = props;
  const [currentPage, setCurrentPage] = useState(parseInt(p));
  const pages = Math.ceil(numbers / limit);
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const changePage = (e) => {
    window.scroll({ top: 0, behavior: "smooth" });
    setCurrentPage(parseInt(e.target.textContent));
  };
  const nextPage = () => {
    window.scroll({ top: 0, behavior: "smooth" });
    setCurrentPage(currentPage + 3);
  };
  const prevPage = () => {
    window.scroll({ top: 0, behavior: "smooth" });
    setCurrentPage(currentPage - 3);
  };
  useEffect(() => {
    setCurrentPage(parseInt(p));
  }, [path, p]);
  return (
    <div className="pagination">
      <Link
        className={`pagination__page${currentPage === 1 ? " active" : ""}`}
        onClick={changePage}
        key={1}
        to={`${path}?${q ? "q=" : ""}${q ? q : ""}${
          q ? "&" : ""
        }p=1&limit=${limit}`}
      >
        1
      </Link>
      {/* Icon prev */}
      {currentPage > 4 && pages > 5 && (
        <Link
          className="pagination__prev-page"
          onClick={prevPage}
          to={`${path}?${q ? "q=" : ""}${q ? q : ""}${q ? "&" : ""}p=${
            currentPage - 3
          }&limit=${limit}`}
        >
          <i className="fas fa-angle-double-left"></i>
        </Link>
      )}
      {range(
        currentPage >= 4 ? currentPage - 2 : 2,
        currentPage + 2 >= pages - 1 ? pages - 1 : currentPage + 2,
        1
      ).map((n) => (
        <Link
          className={`pagination__page${currentPage === n ? " active" : ""}`}
          onClick={changePage}
          key={n}
          to={`${path}?${q ? "q=" : ""}${q ? q : ""}${
            q ? "&" : ""
          }p=${n}&limit=${limit}`}
        >
          {n}
        </Link>
      ))}

      {/* Icon next */}
      {currentPage <= pages - 4 && pages > 5 && (
        <Link
          className="pagination__next-page"
          onClick={nextPage}
          to={`${path}?${q ? "q=" : ""}${q ? q : ""}${q ? "&" : ""}p=${
            currentPage + 3
          }&limit=${limit}`}
        >
          <i className="fas fa-angle-double-right"></i>
        </Link>
      )}
      <Link
        className={`pagination__page${currentPage === pages ? " active" : ""}`}
        onClick={changePage}
        key={pages}
        to={`${path}?${q ? "q=" : ""}${q ? q : ""}${
          q ? "&" : ""
        }p=${pages}&limit=${limit}`}
      >
        {pages}
      </Link>
    </div>
  );
};

export default withRouter(Pagination);
