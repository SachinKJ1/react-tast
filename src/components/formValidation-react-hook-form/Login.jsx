import { Link } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import Input from "../Input/Input";

import { useForm, FormProvider } from "react-hook-form";

function Login() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log(email);
    console.log(password);
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const methods = useForm();

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="heading">Login</h1>

        <FormProvider {...methods}>
          <form noValidate onSubmit={(e) => e.preventDefault()}>
            <div className="input-container">
              <Input type="text" placeholder="user@email.com" label="email" />
              <div className="error-msg">Invalid Email Id</div>
            </div>
            <div className="input-container">
              <Input type="password" placeholder="Password" label="password" />

              <div className="error-msg">
                Password must have atleast 6 characters.
              </div>
            </div>

            <div className="input-container">
              <button onClick={onSubmit} type="submit">
                Login
              </button>

              <div>
                Don't have an account <Link to="/sign-up">Login</Link> here
              </div>
            </div>
          </form>
        </FormProvider>
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
