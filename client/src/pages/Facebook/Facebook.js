import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faFacebook);

function Facebook({ informParent = (i) => i }) {
  const responseFacebook = (res) => {
    console.log(res);
    const url = `${process.env.REACT_APP_API}/facebook-login`;
    const data = { userID: res.userID, accessToken: res.accessToken };
    axios
      .post(url, data)
      .then((res) => {
        console.log("FACEBOOK SIGNIN SUCCESS!", res);
        // inform parent componenet
        informParent(res);
      })
      .catch((err) => {
        console.log("FACEBOOK SIGNIN ERROR!", err.res);
      });
  };

  return (
    <div>
      <FacebookLogin
        appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <div className='form-group'>
            <button
              onClick={renderProps.onClick}
              className='btn-primary btn-primary-facebook xsm'
            >
              <FontAwesomeIcon icon={faFacebook} className='facebook-icon' />
              <span className='facebook-span'>Login with Facebook</span>
            </button>
          </div>
        )}
      />
    </div>
  );
}

export default Facebook;
