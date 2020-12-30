import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { signup } from "../../features/user/userSlice";

const SignupForm = () => {
  const dispatch = useDispatch();
  const { errorMsg, successMsg } = useSelector((state) => state.user);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [buttonText, setButtonText] = useState("Signup");
  const handleChange = (name) => (e) => {
    setUserData({ ...userData, [name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonText("Signing...");
    dispatch(signup(userData)).then(() => {
      setButtonText("Signup");
    });
  };
  return (
    <div className="auth__form">
      <form onSubmit={handleSubmit}>
        <div className="auth__form--input">
          <label htmlFor="signup__username">Username</label>
          <input
            type="text"
            className="auth__form--input__username"
            id="signup__username"
            placeholder="Username"
            onChange={handleChange("username")}
            required
          />
        </div>
        <div className="auth__form--input">
          <label htmlFor="signup__email">Email</label>
          <input
            type="email"
            className="auth__form--input__email"
            id="signup__email"
            placeholder="Email"
            onChange={handleChange("email")}
            required
          />
        </div>
        <div className="auth__form--input">
          <label htmlFor="signup__password">Password</label>
          <input
            type="password"
            className="auth__form--input__password"
            id="signup__password"
            placeholder="Password"
            onChange={handleChange("password")}
            required
          />
        </div>
        {errorMsg ? <p className="auth__form--error">{errorMsg}</p> : null}
        {successMsg ? (
          <p className="auth__form--success">{successMsg}</p>
        ) : null}
        <button type="submit" className="auth__form--button">
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
