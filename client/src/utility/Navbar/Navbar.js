import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { isAuth, logout } from "../helper/helpers";
function Navbar({ history }) {
  return (
    <nav className='navbar nav-margin-top'>
      <div className='container'>
        <h1 className='nav-logo primary-heading sm'>
          <span className='primary-color'>G</span>
          <span className='secondary-color'>o</span>
          <span className='tertiary-color'>o</span>
          <span className='primary-color'>g</span>
          <span className='quaternary-color'>l</span>
          <span className='secondary-color'>e</span>
        </h1>
        <ul className='nav-links flex-align-end xsm'>
          {!isAuth() && (
            <Fragment>
              <li className='nav-item'>
                <NavLink
                  activeStyle={{
                    borderBottom: "1px solid #db4437 ",
                  }}
                  exact
                  to='/'
                >
                  Signup
                </NavLink>
              </li>{" "}
              <li className='nav-item'>
                <NavLink
                  activeStyle={{
                    borderBottom: "1px solid #db4437 ",
                  }}
                  exact
                  to='/signin'
                >
                  Signin
                </NavLink>
              </li>
            </Fragment>
          )}
          {isAuth() && (
            <li className='nav-item'>
              <span className='nav-link'> {isAuth().name}</span>
            </li>
          )}
          {isAuth() && (
            <li className='nav-item'>
              <span
                className='nav-link'
                onClick={() => {
                  logout(() => {
                    history.push("/");
                  });
                }}
              >
                Logout
              </span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
export default withRouter(Navbar);
