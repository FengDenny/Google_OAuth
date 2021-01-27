import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { showAlert } from "../../js/alerts";
import jwt from "jsonwebtoken";
import axios from "axios";

// match comes from browser router
function Activate({ match }) {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });

  useEffect(() => {
    // App.js path='/auth/activate/:token'
    let token = match.params.token;
    // grab the users name from the registered token data
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const { name, token, show } = values;

  const handleSubmit = async (event) => {
    // stop the page from reloading
    event.preventDefault();
    const url = `/api/v1/users/account-activation`;
    const data = { token };
    // get request from backend
    await axios
      .post(url, data)
      .then((res) => {
        console.log("Account has been activated", res);
        console.log(res.data.message);
        // clean state
        setValues({
          ...values,
          show: false,
        });
        // toast.success(res.data.message);
        if (res.data.status === "success") {
          showAlert("success", res.data.message);
        }
      })
      .catch((err) => {
        console.log("ACCOUNT ACTIVATION ERROR", err.response.data.message);
        showAlert("error", err.response.data.message);
      });
  };

  const activationLink = () => {
    return (
      <div className='form-group'>
        <h1>Hello {name}, please activate your account to get started! </h1>
        <button class='btn-primary xsm' onClick={handleSubmit}>
          Activate Account
        </button>
      </div>
    );
  };

  return <div>{activationLink()}</div>;
}
export default Activate;
