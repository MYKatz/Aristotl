import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from "./Login"
import '../css/App.css';
import '../css/bulma.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Login} />
      </Router>
    );
  }
}

export default App;
