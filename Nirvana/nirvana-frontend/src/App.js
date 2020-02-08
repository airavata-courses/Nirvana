import React from 'react';
import logo from './logo.svg';
import './App.css';
import SignIn from './components/signin';
import SignUp from './components/signup';
import { BrowserRouter, Route, Link } from "react-router-dom";


function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <div>
            <Route path="/" exact component={SignIn}/>
            <Route path="/signUp" exact component={SignUp}/>
          </div>
        </BrowserRouter>
    </div>
  );
}

export default App;
