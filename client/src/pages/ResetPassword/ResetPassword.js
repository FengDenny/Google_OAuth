/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { Redirect } from "react-router-dom";
import { showAlert } from "../../js/alerts";
import { useHistory } from "react-router";
import axios from "axios";

//  destructure  props.match from react-router-dom
function ResetPassword({ match }) {
  const history = useHistory();
  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset Password",
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const { name, token, newPassword, buttonText } = values;

  const handleChange = (event) => {
    setValues({ ...values, newPassword: event.target.value });
  };
  const handleSubmit = async (event) => {
    // stop the page from reloading
    event.preventDefault();
    const url = `${process.env.REACT_APP_API}/reset-password`;
    const data = { newPassword, resetPasswordLink: token };
    // change button text when form is being submitted
    setValues({ ...values, buttonText: "Resetting" });

    // get request from backend
    await axios
      .put(url, data)
      .then((res) => {
        console.log("RESET PASSWORD SUCCESSFULLY", res);
        showAlert("success", res.data.message);
        setValues({
          ...values,
          buttonText: "Done",
        });
        setTimeout(() => {
          history.push("/signin");
        }, 2000);
      })

      .catch((err) => {
        console.log("RESET PASSWORD ERROR", err);
        showAlert("error", err.response.data.message);
        setValues({
          ...values,
          buttonText: "Reset Password",
        });
      });
  };

  const ResetPasswordForm = () => {
    return (
      <form>
        <h1>Hello {name}, reset your password</h1>
        <div className='form-group'>
          <label htmlFor='password' className='form-label xsm'>
            New Password
          </label>
          <input
            onChange={handleChange}
            value={newPassword}
            id='password'
            type='password'
            className='form-input'
            name='password'
            placeholder='Type new password'
            required
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

  return <div>{ResetPasswordForm()}</div>;
}
export default ResetPassword;
