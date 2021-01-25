import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>Sorry</h1>
      <p>That page can't be found</p>
      <Link to="/" className="not-found__link">
        Back to homepage
      </Link>
    </div>
  );
};

export default NotFound;
