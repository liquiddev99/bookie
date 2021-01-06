import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import AvatarEditor from "react-avatar-editor";

import { upload, fetchUser } from "../../features/user/userSlice";

const Account = () => {
  const { username, email, thumbnail, successMsg, errorMsg } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const [file, setFile] = useState("");
  const [nameFile, setNameFile] = useState("");
  const [scale, setScale] = useState(1);
  const [error, setError] = useState("");
  const ref = useRef();

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setNameFile(e.target.files[0].name);
    setError("");
  };

  const handleScale = (e) => {
    setScale(parseFloat(e.target.value));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (ref.current) {
      setError("");
      ref.current.getImageScaledToCanvas().toBlob((blob) => {
        const scaledFile = new File([blob], nameFile);
        const formData = new FormData();
        formData.append("file", scaledFile);
        dispatch(upload(formData)).then((unwrapResult) => {
          if (unwrapResult.meta.requestStatus === "fulfilled") {
            dispatch(fetchUser());
            setFile("");
          }
        });
      });
    } else {
      setError("Please choose file");
    }
  };

  return (
    <div className="account">
      <h1 className="account__title">My account</h1>
      <div className="account__profile">
        <p className="account__profile--username">Username: {username}</p>
        <p className="account__profile--email">Email: {email}</p>
        <p>Thumbnail: {!thumbnail && "image doesn't exist"}</p>
        {thumbnail && (
          <img
            className="account__profile--thumbnail"
            alt="thumbnail"
            src={thumbnail}
          />
        )}
        {file && (
          <>
            <br />
            <AvatarEditor
              ref={ref}
              image={file}
              width={200}
              height={200}
              border={15}
              borderRadius={100}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={scale}
              rotate={0}
            />
            <br />
            Zoom:
            <input
              type="range"
              onChange={handleScale}
              min="1"
              max="1.8"
              step="0.01"
              defaultValue="1"
            />
          </>
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
        {successMsg && (
          <p className="account__profile--success">{successMsg}</p>
        )}
        {errorMsg && <p className="account__profile--error">{errorMsg}</p>}
        {error && <p className="account__profile--error">{error}</p>}
      </div>
    </div>
  );
};

export default Account;
