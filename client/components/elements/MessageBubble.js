import React, { Component } from 'react';
import '../../css/messagebubble.css';

class MessageBubble extends Component {
    constructor(props){
        super(props);
        this.state = {
            type: this.props.type //usermsg or othermsg
        }
    }

    render() {
        return(
            <div className={"bubblecontainer " + this.state.type}><div style={{width: "20%"}} /><span className={"msgbubble round " + this.state.type}>{this.props.text}</span></div>
        )
    }
}

export default MessageBubble;