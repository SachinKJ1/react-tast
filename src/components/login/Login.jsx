import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useFormik } from "formik";

import { useUiContext } from "../../contexts/UiContext";
import axiosInstance from "../../utils/axiosInstance";

const validate = (values) => {
  const errors = {};

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

  return errors;
};

function Login() {
  const navigate = useNavigate();
  const {
    toNotify,
    toSpin,
    toStopSpin,
    updateLoginStatus, 
    
  } = useUiContext();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      // console.log(values);
      toSpin();
      try {
        const res = await axiosInstance().post("/login", values);
        toNotify("green", "Successfully Logged in");

        localStorage.setItem("token", res.data.token);
        updateLoginStatus(true); 
        navigate("/home");
      } catch (error) {
        if (error.response.data.error === "Invalid Email or password")
          return toNotify("red", "Invalid email or password");

        if (
          error.response.data.error ===
          "You are not authorized to access this page"
        )
          return toNotify("red", "You are not authorized to access this page");

        toNotify("red", "Something went wrong");
      } finally {
        toStopSpin();
      }
    },
  });
  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="login-heading">Login</h1>

        <form onSubmit={formik.handleSubmit}>
          <div className="input-container">
            <input
              id="email"
              name="email"
              type="text"
              placeholder="user@email.com"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email && formik.values.email.length >= 10 && (
              <div className="login-error-msg">{formik.errors.email}</div>
            )}
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

            {formik.errors.password && formik.values.password.length > 3 && (
              <div className="login-error-msg">{formik.errors.password}</div>
            )}
          </div>

          <div className="input-container">
            <button
              type="submit"
              className={
                formik.isValid && formik.dirty ? "" : "login-btn-active"
              }
            >
              Login
            </button>

            <div>
              Don't have an account <Link to="/sign-up">Sign Up</Link> here
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

/* <input
                  type="text"
                  placeholder="user@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                /> */

/* <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                /> */
