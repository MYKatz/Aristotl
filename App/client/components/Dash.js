import React, { Component } from 'react';
import { Twemoji } from 'react-emoji-render';
import '../css/dash.css';
import { withAuth } from '@okta/okta-react';

class Dash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filler : null
        }
    }

    render(){
        return(
            <div className="fullpage">
                <div className="columns is-fullheight">
                    <div className="column is-one-fifth sidemenu">
                        <div className="level">
                            <div className="level-item">
                                <figure className="image is-128x128">
                                    <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png"/>
                                </figure>
                                
                            </div>
                        </div>
                        <div className="level">
                            <div className="level-item">
                                <strong>Name McNameFace</strong>
                            </div>
                        </div>
                        <aside className="menu">
                            <ul className="menu-list">
                                <li><a>Home</a></li>
                                <li><a>Settings</a></li>
                                <li><a>One</a></li>
                                <li><a>Two</a></li>
                            </ul>
                        </aside>
                        <div className="bottomcontainer">
                            <button className="button is-medium is-fullwidth blackbutton">Logout</button>
                        </div>
                    </div>
                    <div className="column chatinterface">
                    
                    
                    </div>
                </div>
            </div>
        )
    }

}

export default withAuth(Dash);