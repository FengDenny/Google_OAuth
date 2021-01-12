import "./App.css";
import Home from "./pages/Home/Home";
import Navbar from "./utility/Navbar/Navbar";
import Footer from "./utility/Footer/Footer";
import Signin from "./pages/Signin/Signin";
import Protected from "./pages/protected/protect";
import Activate from "./pages/Signup/Activate";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className='App'>
        <Route path='/' component={Navbar} />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/signin' component={Signin} />
          <Route exact path='/protected' component={Protected} />
          <Route exact path='/auth/activate/:token' component={Activate} />
        </Switch>
        <Route path='/' component={Footer} />
      </div>
    </Router>
  );
}

export default App;
