import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import AvatarEditor from "react-avatar-editor";
import axios from "axios";
import { Line } from "rc-progress";
import { Redirect } from "react-router-dom";

import { fetchUser } from "../../features/user/userSlice";

const Account = () => {
  const { username, email, thumbnail, isLoggedIn } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const [file, setFile] = useState("");
  const [nameFile, setNameFile] = useState("");
  const [scale, setScale] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [progress, setProgress] = useState(0);
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
      ref.current.getImageScaledToCanvas().toBlob(async (blob) => {
        try {
          const scaledFile = new File([blob], nameFile);
          const formData = new FormData();
          formData.append("file", scaledFile);
          const res = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const loaded = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(loaded);
              if (loaded === 100) {
                setTimeout(() => setProgress(0), 4000);
              }
            },
          });
          await dispatch(fetchUser());
          setSuccess(res.data);
        } catch (err) {
          setError(err.response.data);
        }
      });
    } else {
      setSuccess("");
      setError("Please choose file");
    }
  };

  return (
    <div className="account">
      {!isLoggedIn && <Redirect to="/" />}
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
        {progress > 0 && (
          <Line percent={progress} strokeColor="green" trailColor="#D3D3D3" />
        )}
        <form onSubmit={onSubmit}>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={onChange}
          />
          <button type="submit">Upload</button>
        </form>
        {success && <p className="account__profile--success">{success}</p>}
        {error && <p className="account__profile--error">{error}</p>}
      </div>
    </div>
  );
};

export default Account;
