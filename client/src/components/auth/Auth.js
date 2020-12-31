import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useDispatch } from "react-redux";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { clearStatus } from "../../features/user/userSlice";

const Login = (props) => {
  const dispatch = useDispatch();
  const [method, setMethod] = useState("login");
  const onLoginTab = () => {
    setMethod("login");
    dispatch(clearStatus());
  };
  const onSignupTab = () => {
    setMethod("signup");
    dispatch(clearStatus());
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onCloseModal}
      center
      classNames={{ modal: "auth" }}
    >
      <div className="auth-wrapper">
        <div
          className={`auth__links${method === "login" ? " active" : ""}`}
          onClick={onLoginTab}
        >
          <p className="auth__links--login">Login</p>
        </div>
        <div
          className={`auth__links${method === "signup" ? " active" : ""}`}
          onClick={onSignupTab}
        >
          <p className="auth__links--signup">Signup</p>
        </div>
        {method === "login" ? <LoginForm /> : <SignupForm />}
        <a href="/auth/facebook" className="oauth auth__facebook">
          Login with Facebook
          <i className="fab fa-facebook"></i>
        </a>
        <a href="/auth/google" className="oauth auth__google">
          Login with Google
          <i className="fab fa-google"></i>
        </a>
      </div>
    </Modal>
  );
};

export default Login;
