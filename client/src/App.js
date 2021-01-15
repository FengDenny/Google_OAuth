import "./App.css";
import Home from "./pages/Home/Home";
import Navbar from "./utility/Navbar/Navbar";
import Footer from "./utility/Footer/Footer";
import Signin from "./pages/Signin/Signin";
import Protected from "./pages/Protected/Protect";
import Admin from "./pages/Admin/Admin";
import Activate from "./pages/Signup/Activate";
import Forgot from "./pages/ForgotPassword/ForgotPassword";
import Reset from "./pages/ResetPassword/ResetPassword";
// to create a private and protected routing
import PrivateRoute from "./pages/Protected/PrivateRoute";
import AdminRoute from "./pages/Admin/AdminRoute";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className='App'>
        <Route path='/' component={Navbar} />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/signin' component={Signin} />
          <Route exact path='/auth/activate/:token' component={Activate} />
          <Route exact path='/auth/password/forgot' component={Forgot} />
          <Route exact path='/auth/password/reset/:token' component={Reset} />
          {/* Private/protected */}
          <PrivateRoute exact path='/protected' component={Protected} />
          <AdminRoute exact path='/protected-admin' component={Admin} />
        </Switch>
        <Route path='/' component={Footer} />
      </div>
    </Router>
  );
}

export default App;
