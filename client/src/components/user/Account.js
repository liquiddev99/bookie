import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { upload, fetchUser } from "../../features/user/userSlice";

const Account = () => {
  const { username, email, thumbnail } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState("");
  const onChange = (e) => {
    setFile(e.target.files[0]);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    dispatch(upload(formData)).then((unwrapResult) => {
      if (unwrapResult.meta.requestStatus === "fulfilled") {
        dispatch(fetchUser());
      }
    });
  };

  return (
    <div className="account">
      <h1 className="account__title">My account</h1>
      <div className="account__profile">
        <p className="account__profile--username">Username: {username}</p>
        <p className="account__profile--email">Email: {email}</p>
        <p className="account__profile--thumbnail">
          Thumbnail: {!thumbnail && "image doesn't exist"}
        </p>
        {thumbnail && (
          <img
            className="account__profile--thumbnal"
            alt="thumbnail"
            src={thumbnail}
          />
        )}
        <form onSubmit={onSubmit}>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={onChange}
          />
          {/* <label htmlFor="file">Choose file</label> */}
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default Account;
