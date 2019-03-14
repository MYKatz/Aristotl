import React, { Component } from 'react';
import { Twemoji } from 'react-emoji-render';
import Pattern from '../img/backgrounds/ab14.png'
import '../css/login.css';


class Login extends Component {
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
                <form>
                  <div class="field">
                    <label class="label">Email Address</label>
                    <div class="control">
                      <input class="input" type="email"/>
                    </div>
                  </div>
                  <div class="field" style={{paddingBottom: "1vh"}}>
                    <label class="label">Password</label>
                    <div class="control">
                      <input class="input" type="password"/>
                    </div>
                  </div>
                  <button className="button is-medium is-fullwidth blackbutton">Login</button>
                  <button className="button is-medium is-fullwidth blackbutton">Register</button>
                  <button className="button is-danger is-outlined is-fullwidth" style={{marginBottom: "1vh"}}>Sign-in with Google</button>
                  <button className="button is-link is-outlined is-fullwidth">Sign-in with Facebook</button>
                </form>
              </div>
              <div className="column"/>
            </div>
            
          
          </div>
        </div>
      </div>
    );
  }
}

export default Login;