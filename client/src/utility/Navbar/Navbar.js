import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
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
            <li className='nav-item'>
              <Link to='/signup'>Signup</Link>
            </li>{" "}
            <li className='nav-item'>
              <Link to='/signin'>Signin</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
export default Navbar;
