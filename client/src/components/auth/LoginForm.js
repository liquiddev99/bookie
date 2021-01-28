import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { login } from "../../features/user/userSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { errorMsg } = useSelector((state) => state.user);
  const history = useHistory();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [btnText, setBtnText] = useState("Login");
  const handleChange = (name) => (e) => {
    setUserData({ ...userData, [name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnText("Logging...");
    dispatch(login(userData)).then((unwrapResult) => {
      setBtnText("Login");
      if (unwrapResult.meta.requestStatus === "fulfilled") {
        history.go(0);
      }
    });
  };
  return (
    <div className="auth__form">
      <form onSubmit={handleSubmit}>
        <div className="auth__form--input">
          <label htmlFor="login__email">Email</label>
          <input
            type="email"
            className="auth__form--input__email"
            id="login__email"
            placeholder="Email"
            onChange={handleChange("email")}
            required
          />
        </div>
        <div className="auth__form--input">
          <label htmlFor="login__password">Password</label>
          <input
            type="password"
            className="auth__form--input__password"
            id="login__password"
            placeholder="Password"
            onChange={handleChange("password")}
            required
          />
        </div>
        {errorMsg ? <p className="auth__form--error">{errorMsg}</p> : null}
        <button type="submit" className="auth__form--button">
          {btnText}
        </button>
      </form>

      <p className="auth__form--reset">
        Forgot password? <a href="/">Click here</a>
      </p>
    </div>
  );
};

export default LoginForm;
