import React, { Component } from 'react';
import { Twemoji } from 'react-emoji-render';
import Pattern from '../img/backgrounds/ab14.png';
import '../css/login.css';
import { withAuth } from '@okta/okta-react';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, display: "yo" };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.fblogin = this.fblogin.bind(this);
    this.glogin = this.glogin.bind(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  async login() {
    // Redirect to '/dash' after login
    this.props.auth.login('/dash');
  }

  async logout() {
    // Redirect to '/' after logout
    this.props.auth.logout('/');
  }

  async fblogin() {
    //FB login w/ idp ID from Okta
    this.props.auth.login('/dash', {idp: 	"0oacyiupocl7wF23w356"});
  }

  async glogin() {
    //Google login w/ idp ID from Okta
    this.props.auth.login('/dash', {idp: 	"0oacyltq2wgHWCUaS356"});
  }

  render() {
    return (
      <div className="outer">
        <div className="columns is-fullheight">
          <div className="column is-hidden-touch" style={{background: "#2ecc71"}}>
          
          </div>
          <div className="column" style={{background: "#fff"}}>
            <div className="columns is-vcentered is-mobile" style={{height: "95vh"}}>
              <div className="column"/>
              <div className="column is-two-thirds">
                <Twemoji text="Welcome! 👋" className="headtext"/>
                <div className="lowertext">Please login to continue</div>
                <div>
                  <button className="button is-medium is-fullwidth blackbutton" onClick={this.login}>Login</button>
                  <a href="https://dev-994297.okta.com/signin/register" className="button is-medium is-fullwidth blackbutton">Register</a>
                  <button className="button is-danger is-outlined is-fullwidth" onClick={this.glogin} style={{marginBottom: "1vh"}}>Sign-in with Google</button>
                  <a className="button is-link is-outlined is-fullwidth" onClick={this.fblogin}>Sign-in with Facebook</a>
                </div>
              </div>
              <div className="column"/>
            </div>
            
          
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Login);