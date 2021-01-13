import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { authenticate, isAuth } from "../../utility/helper/helpers";
import { showAlert } from "../../js/alerts";
import axios from "axios";

function Signin() {
  const [values, setValues] = useState({
    email: "Dfeng415@yahoo.com",
    password: "123456",
    buttonText: "Submit",
  });

  const { email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    // grab different values based on their name located in  values
    setValues({ ...values, [name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    // stop the page from reloading
    event.preventDefault();
    const url = `${process.env.REACT_APP_API}/signin`;
    const data = { email, password };
    // change button text when form is being submitted
    setValues({ ...values, buttonText: "Submitting" });

    // get request from backend
    await axios
      .post(url, data)
      .then((res) => {
        console.log("SIGNIN SUCCESSFULLY", res);
        authenticate(res, () => {
          // clean state
          setValues({
            ...values,
            email: "",
            password: "",
            buttonText: "Submitted",
          });

          if (res.data.status === "success") {
            showAlert("success", `Hey ${res.data.user.name}, Welcome back!`);
          }
        });
      })

      .catch((err) => {
        console.log("SIGNIN ERROR", err);

        setValues({
          ...values,
          buttonText: "Submit",
        });
        showAlert("error", err.response.data.message);
      });
  };

  const SigninForm = () => {
    return (
      <form>
        <div className='form-group'>
          <label htmlFor='email' className='form-label xsm'>
            Email
          </label>
          <input
            onChange={handleChange("email")}
            value={email}
            id='email'
            type='email'
            className='form-input'
            name='email'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password' className='form-label xsm'>
            Password
          </label>
          <input
            onChange={handleChange("password")}
            value={password}
            id='password'
            type='password'
            className='form-input'
            name='password'
          />
        </div>
        <div className='form-group'>
          <button className='btn-primary xsm' onClick={handleSubmit}>
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      {/* check if user is signed in  */}
      {isAuth() ? <Redirect to='/protected' /> : null}
      {SigninForm()}
    </div>
  );
}
export default Signin;