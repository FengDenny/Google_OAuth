import React from "react";
import axios from "axios";
import GoogleLogin from "react-google-login";
import { authenticate, isAuth } from "../../utility/helper/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faGoogle);

function Google({ informParent = (i) => i }) {
  const responseGoogle = (res) => {
    console.log(res.tokenId);
    const url = `${process.env.REACT_APP_API}/google-login`;
    const data = { idToken: res.tokenId };
    axios
      .post(url, data)
      .then((res) => {
        console.log("GOOGLE SIGNIN SUCCESS!", res);
        // inform parent componenet
        informParent(res);
      })
      .catch((err) => {
        console.log("GOOGLE SIGNIN ERROR!", err.res);
      });
  };

  return (
    <div>
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        render={(renderProps) => (
          <div className='form-group'>
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className='btn-primary xsm'
            >
              <FontAwesomeIcon icon={faGoogle} className='google-icon' />
              <span className='google-span'>Login with Google</span>
            </button>
          </div>
        )}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
}

export default Google;
