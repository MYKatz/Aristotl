import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import '../css/App.css';
import '../css/bulma.min.css';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';

import Login from "./Login";
import Dash from "./Dash";

const config = {
  issuer: 'https://dev-994297.okta.com/oauth2/default',
  redirect_uri: 'http://localhost:8000/implicit/callback',
  client_id: '0oacpwujcUNre4PDC356',
  idps: [
    {type: 'FACEBOOK', id: '0oacyiupocl7wF23w356'}
  ]
}

class App extends Component {
  render() {
    return (
      <Router>
        <Security issuer={config.issuer}
                  client_id={config.client_id}
                  redirect_uri={config.redirect_uri}
        >
          <Route path="/" exact component={Login} />
          <Route path='/implicit/callback' component={ImplicitCallback}/>
          <SecureRoute path="/dash" component={Dash}/>
        </Security>
      </Router>
    );
  }
}

export default App;
