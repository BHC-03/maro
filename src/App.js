import React,{useEffect} from "react";
import InputSectoin from "./components/LogIn";
import Register from "./components/register";
import useLoadInfoCheck from "./checkSessionStorage";
import MainPage from "./components/mainPage";
import {Switch,BrowserRouter as Router,Route} from 'react-router-dom'

function App() {
  
  useLoadInfoCheck();
  return (
    <Router>
      <Switch>
        <Route path={'/login/'}><InputSectoin/></Route>
        <Route path={'/register/'}><Register/></Route>
        <Route path={'/mainpage/'}><MainPage /></Route>
      </Switch>
    </Router>
  );
}

export default App;
