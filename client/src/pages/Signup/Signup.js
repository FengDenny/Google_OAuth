import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [values, setValues] = useState({
    name: "Denny",
    email: "Dfeng415@yahoo.com",
    password: "123456",
    buttonText: "Submit",
  });

  const { name, email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    // grab different values based on their name located in  values
    setValues({ ...values, [name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    // stop the page from reloading
    event.preventDefault();
    const url = `${process.env.REACT_APP_API}/signup`;
    const data = { name, email, password };
    // change button text when form is being submitted
    setValues({ ...values, buttonText: "Submitting" });

    // get request from backend
    await axios
      .post(url, data)
      .then((res) => {
        console.log("SIGN UP SUCCESSFULLY", res);
        console.log(res.data.message);
        // clean state
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          buttonText: "Submitted",
          success: true,
        });
      })
      .catch((err) => {
        console.log("SIGN UP ERROR", err);

        setValues({
          ...values,
          buttonText: "Submit",
          success: true,
        });
      });
  };

  const SignupForm = () => {
    return (
      <form>
        <div className='form-group'>
          <label htmlFor='name' className='form-label xsm'>
            Name
          </label>
          <input
            onChange={handleChange("name")}
            value={name}
            id='name'
            type='text'
            className='form-input'
            name='name'
          />
        </div>
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

  return <div>{SignupForm()}</div>;
}
export default Signup;
