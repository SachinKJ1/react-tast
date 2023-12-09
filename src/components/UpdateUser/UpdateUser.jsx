import React, { useEffect, useState } from "react";
import "./UpdateUser.css";
import { useFormik } from "formik";

import { Link, useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useUiContext } from "../../contexts/UiContext";
import axiosInstance from "../../utils/axiosInstance";

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

  if (!values.role) {
    errors.role = "Required";
  }

  if (!values.curPassword) {
    errors.curPassword = "Required";
  } else if (values.curPassword?.length < 6) {
    errors.curPassword = "Must be 6 characters or more";
  } else if (!/[a-zA-Z0-9]{3}/.test(values.curPassword)) {
    errors.curPassword = "Invalid password";
  }

  if (!values.newPassword) {
    errors.newPassword = "Required";
  } else if (values.newPassword?.length < 6) {
    errors.newPassword = "Must be 6 characters or more";
  } else if (!/[a-zA-Z0-9]{3}/.test(values.newPassword)) {
    errors.newPassword = "Invalid password";
  } else if (values.curPassword === values.newPassword) {
    errors.newPassword = "Current password and New password is same";
  }

  if (!values.newPasswordConfirm) {
    errors.newPasswordConfirm = "Required";
  } else if (values.newPasswordConfirm?.length < 6) {
    errors.newPasswordConfirm = "Must be 6 characters or more";
  } else if (!/[a-zA-Z0-9]{3}/.test(values.newPasswordConfirm)) {
    errors.newPasswordConfirm = "Invalid password";
  } else if (values.newPassword !== values.newPasswordConfirm) {
    errors.newPasswordConfirm =
      "New Password and Password Confirm should match";
  }

  return errors;
};

const validateFn = (values) => {
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

  if (!values.role) {
    errors.role = "Required";
  }

  return errors;
};
function UpdateUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toNotify, toSpin, toStopSpin } = useUiContext();
  const [user, setUser] = useState({});
  const [isPasswordChange, setIsPasswordChange] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: user.username ? user.username : "",
      email: user.email ? user.email : "",
      role: user.role ? user.role : "",
      curPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
    enableReinitialize: true,
    validate: isPasswordChange ? validate : validateFn,
    onSubmit: async (values) => {
      const dataFromDb = JSON.stringify({
        username: user.username,
        email: user.email,
        role: user.role,
      });
      const dataFromForm = JSON.stringify({
        username: values.username,
        email: values.email,
        role: values.role,
      });

      if (!isPasswordChange && dataFromDb === dataFromForm)
        return toNotify("red", "No Details were Changed");

      let formData = {};
      if (!isPasswordChange) {
        formData.username = values.username;
        formData.email = values.email;
        formData.role = values.role;
      } else {
        formData = { ...values };
      }
      console.log(formData);

      toSpin();
      try {
        await axiosInstance().patch(`/updateUser/${id}`, formData);

        toNotify("green", "Successfully Updated User");
        navigate("/home");
      } catch (error) {
        console.log(error);
        if (error.response.data.error.code === 11000)
          return toNotify("red", "Email already in use");

        if (error.response.data.error === "Incorrect password")
          return toNotify("red", "Incorrect password");

        toNotify("red", "Something went wrong");
      } finally {
        toStopSpin();
      }
    },
  });

  const getUpdateUser = async () => {
    toSpin();
    try {
      const userRes = await axiosInstance().get(`/getOneUser/${id}`);
      const userData = userRes.data.data;
      setUser(() => userData);
    } catch (error) {
      console.log(error);
    } finally {
      toStopSpin();
    }
  };

  useEffect(() => {
    getUpdateUser();
  }, []);

  return (
    <div className="update-user-container">
      <div className="update-user-form-container">
        <h1 className="update-user-heading">Update User</h1>
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
              <div className="update-user-error-msg">{formik.errors.email}</div>
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
              <div className="update-user-error-msg">
                {formik.errors.username}
              </div>
            ) : null}
          </div>

          {isPasswordChange && (
            <>
              <div className="input-container">
                <input
                  id="curPassword"
                  name="curPassword"
                  type="password"
                  placeholder="Current Password"
                  onChange={formik.handleChange}
                  value={formik.values.curPassword}
                />
                {formik.errors.curPassword &&
                formik.values.curPassword.length > 3 ? (
                  <div className="update-user-error-msg">
                    {formik.errors.curPassword}
                  </div>
                ) : null}
              </div>
              <div className="input-container">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                />
                {formik.errors.newPassword &&
                formik.values.newPassword.length > 3 ? (
                  <div className="update-user-error-msg">
                    {formik.errors.newPassword}
                  </div>
                ) : null}
              </div>
              <div className="input-container">
                <input
                  id="newPasswordConfirm"
                  name="newPasswordConfirm"
                  type="password"
                  placeholder="New Password Confirm"
                  onChange={formik.handleChange}
                  value={formik.values.newPasswordConfirm}
                />
                {formik.errors.newPasswordConfirm &&
                formik.values.newPasswordConfirm.length > 3 ? (
                  <div className="update-user-error-msg">
                    {formik.errors.newPasswordConfirm}
                  </div>
                ) : null}
              </div>
            </>
          )}

          <div className="input-container">
            <div className="select-container">
              <label htmlFor="role">Role of new User</label>&nbsp;&nbsp;&nbsp;
              <select
                className="select-tag"
                name="role"
                id="role"
                onChange={formik.handleChange}
                value={formik.values.role}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="input-container">
            {
              <button
                type="button"
                className="change-pass-btn"
                onClick={() => {
                  setIsPasswordChange((val) => !val);
                  console.log(formik);
                }}
              >
                {isPasswordChange ? "Don't Change Password" : "Change Password"}
              </button>
            }
          </div>

          <div className="input-container">
            {
              <button
                type="submit"
                className={
                  formik.isValid && formik.dirty ? "" : "update-user-btn-active"
                }
              >
                Update
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

export default UpdateUser;
