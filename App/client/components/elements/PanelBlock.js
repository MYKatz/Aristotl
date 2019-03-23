import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class PanelBlock extends Component{
    constructor(props){
        super(props);
        this.goTo = this.goTo.bind(this);
    }

    goTo(){
        this.props.history.push("/private/"+this.props.info._id);
        window.location.reload(true);
    }

    render(){
        return(
            <a className="panel-block" onClick={this.goTo}>
                <span className="panel-icon">
                    <i class="fas fa-comments" aria-hidden="true"></i>
                </span>
                {this.props.info.subject.charAt(0).toUpperCase() + this.props.info.subject.slice(1)} | {this.props.info.messages.length} messages
            </a>
        )
    }
}

export default withRouter(PanelBlock);