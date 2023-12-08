import React from "react";
import "./SignUp.css";
import { useFormik } from "formik";

import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUiContext } from "../../contexts/UiContext";

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length < 4) {
    errors.username = "Must be 4 characters or more";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password?.length < 6) {
    errors.password = "Must be 6 characters or more";
  } else if (!/[a-zA-Z0-9]{3}/.test(values.password)) {
    errors.password = "Invalid password";
  }

  if (!values.passwordConfirm) {
    errors.passwordConfirm = "Required";
  } else if (values.passwordConfirm?.length < 6) {
    errors.passwordConfirm = "Must be 6 characters or more";
  } else if (!/[a-zA-Z0-9]{3}/.test(values.passwordConfirm)) {
    errors.passwordConfirm = "Invalid password";
  } else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "Password and Password Confirm should match";
  }

  return errors;
};

/* const signUpUser = async (formData) => {
  try {


    return await axios.post(
      "http://localhost:4000/authenticate/signUp",
      formData
    );
  } catch (error) {
    
    if (error.response.data.error.code === 11000)
      console.log("Email already in use");
  }
}; */

const signUpUser = async (formData) => {
  return async function () {
    await axios.post("http://localhost:4000/authenticate/signUp", formData);
  };
};

function SignUp() {
  const navigate = useNavigate();

  const { toNotify, toSpin, toStopSpin } = useUiContext();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validate,
    onSubmit: async (values) => {
      toSpin();
      try {
        await axios.post("http://localhost:4000/authenticate/signUp", values);
        toNotify("green", "Successfully signed up");
        navigate("/home");
      } catch (error) {
        // console.log(error);
        if (error.response.data.error.code === 11000)
          return toNotify("red", "Email already in use");
        toNotify("red", "Something went wrong");
      } finally {
        toStopSpin();
      }
    },
  });

  return (
    <div className="signUp-container">
      <div className="signUp-form-container">
        <h1 className="signup-heading">Sign Up</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-container">
            <input
              id="email"
              name="email"
              type="text"
              placeholder="user@gmail.com"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email && formik.values.email.length >= 10 ? (
              <div className="signup-error-msg">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="input-container">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.errors.username && formik.values.username.length >= 2 ? (
              <div className="signup-error-msg">{formik.errors.username}</div>
            ) : null}
          </div>
          <div className="input-container">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password && formik.values.password.length > 3 ? (
              <div className="signup-error-msg">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="input-container">
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="Password Confirm"
              onChange={formik.handleChange}
              value={formik.values.passwordConfirm}
            />
            {formik.errors.passwordConfirm &&
            formik.values.passwordConfirm.length > 3 ? (
              <div className="signup-error-msg">
                {formik.errors.passwordConfirm}
              </div>
            ) : null}
          </div>

          <div className="input-container">
            {
              <button
                type="submit"
                className={
                  formik.isValid && formik.dirty ? "" : "signup-btn-active"
                }
              >
                Sign Up
              </button>
            }

            <div>
              Already have an account <Link to="/login">Login</Link> here
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
