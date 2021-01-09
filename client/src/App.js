import "./App.css";
import Home from "./pages/Home/Home";
import Navbar from "./utility/Navbar/Navbar";
import Footer from "./utility/Footer/Footer";
import Signup from "./pages/Signup/Signup";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className='App'>
        <Route path='/' component={Navbar} />
        <Switch>
          <Route exact path='/' component={Home} />
          {/* <Route exact path='/signup' component={Signup} /> */}
        </Switch>
        <Route path='/' component={Footer} />
      </div>
    </Router>
  );
}

export default App;
