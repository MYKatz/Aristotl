import React, { Component } from 'react';
import '../css/dash.css';
import { withAuth } from '@okta/okta-react';

class ChatBoard extends Component{

    render() {
        return(
            <div className="columns is-fullheight">
                <div className="column chatinterface">
                        
                        
                </div>
                <div className="column whiteboard">


                </div>
            </div>
        )
    }

}

export default ChatBoard;