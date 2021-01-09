import React from "react";
import { Link } from "react-router-dom";
import Signup from "../Signup/Signup";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// import { library } from "@fortawesome/fontawesome-svg-core";
// library.add(faGoogle);

function Home() {
  return (
    <div className='container'>
      <div className='flex-algin-evenly margin-top'>
        <header>
          <h1 className='primary-heading md'>
            <span className='primary-color'>G</span>
            <span className='secondary-color'>o</span>
            <span className='tertiary-color'>o</span>
            <span className='primary-color'>g</span>
            <span className='quaternary-color'>l</span>
            <span className='secondary-color'>e</span>
            <span className='primary-color padding'>OAuth 2.0</span>
          </h1>
        </header>
        <section className='card-section'>
          <div className='card margin-top flex-align-center'>
            <h1 className='secondary-heading secondary-color md'>
              Sign up to get started
            </h1>
            <Signup />
          </div>
        </section>
      </div>
    </div>
  );
}
export default Home;
