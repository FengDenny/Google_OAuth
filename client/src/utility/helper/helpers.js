import cookie from "js-cookie";

// set in cookie
export const setCookie = (key, value) => {
  if (window !== undefined) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

// remove from cookie

export const removeCookie = (key) => {
  if (window !== undefined) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

// get from cookie such as stored token
// useful when we need to make req to server with tokens
export const getCookie = (key, value) => {
  if (window !== undefined) {
    return cookie.get(key);
  }
};

// set in localstorage

export const setLocalStorage = (key, value) => {
  if (window !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from localstorage
export const removeLocalStorage = (key, value) => {
  if (window !== undefined) {
    localStorage.removeItem(key);
  }
};

// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

// access user information from localstorage

export const isAuth = () => {
  if (window !== undefined) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

// logout
export const logout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};
