import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { showAlert } from "../../js/alerts";
import axios from "axios";

function ForgotPassword() {
  const [values, setValues] = useState({
    email: "",
    buttonText: "Request Password Link",
  });

  const { email, buttonText } = values;

  const handleChange = (name) => (event) => {
    // grab different values based on their name located in  values
    setValues({ ...values, [name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    // stop the page from reloading
    event.preventDefault();
    const url = `${process.env.REACT_APP_API}/forgot-password`;
    const data = { email };
    // change button text when form is being submitted
    setValues({ ...values, buttonText: "Submitting" });

    // get request from backend
    await axios
      .put(url, data)
      .then((res) => {
        console.log("FORGOT PASSWORD SUCCESSFULLY", res);
        showAlert("success", res.data.message);
        setValues({
          ...values,
          buttonText: "Requested",
        });
      })

      .catch((err) => {
        console.log("FORGOT PASSWORD ERROR", err);
        showAlert("error", err.response.data.message);
        setValues({
          ...values,
          buttonText: "Request Password Link",
        });
      });
  };

  const ForgotPasswordForm = () => {
    return (
      <form>
        <h1>Forgot Password</h1>
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
          <button className='btn-primary xsm' onClick={handleSubmit}>
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return <div>{ForgotPasswordForm()}</div>;
}
export default ForgotPassword;
