/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  isAuth,
  getCookie,
  logout,
  updateUser,
} from "../../utility/helper/helpers";
import { showAlert } from "../../js/alerts";
import axios from "axios";

function Protect({ history }) {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Update",
  });

  const token = getCookie("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_USER}/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE", response.data);
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch((error) => {
        console.log("PRIVATE PROFILE UPDATE ERROR", error);
        if (error.response.status === 401) {
          logout(() => {
            history.push("/");
          });
        }
      });
  };

  const { name, email, password, buttonText, role } = values;

  const handleChange = (name) => (event) => {
    // grab different values based on their name located in  values
    setValues({ ...values, [name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    // stop the page from reloading
    event.preventDefault();
    // change button text when form is being submitted
    setValues({ ...values, buttonText: "Updating" });

    // get request from backend
    await axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API_USER}/update`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { name, password },
    })
      .then((res) => {
        console.log("PROFILE UPDATED SUCCESSFULLY", res);
        console.log(res.data.message);
        updateUser(res, () => {
          // clean state
          setValues({
            ...values,
            buttonText: "Updated",
          });
          // toast.success(res.data.message);
          if (res.data.status === "success") {
            showAlert("success", res.data.message);
          }
        });
      })
      .catch((err) => {
        console.log("PROFILE UPDATEDERROR", err.response.data.message);
        setValues({
          ...values,
          buttonText: "Update",
        });

        showAlert("error", err.response.data.message);
      });
  };

  const UpdateForm = () => {
    return (
      <form>
        <h1>Update Profile</h1>
        <div className='form-group'>
          <label htmlFor='role' className='form-label xsm'>
            Role
          </label>
          <input
            defaultValue={role}
            id='role'
            type='text'
            className='form-input'
            name='role'
            disabled
          />
        </div>
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
            defaultValue={email}
            id='email'
            type='email'
            className='form-input'
            name='email'
            disabled
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

  return <div>{UpdateForm()}</div>;
}
export default Protect;
