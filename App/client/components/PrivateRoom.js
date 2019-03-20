import React, { Component } from 'react';
import '../css/chatboard.css';
import CanvasDraw from "react-canvas-draw";
import { withAuth } from '@okta/okta-react';
import openSocket from 'socket.io-client';

import MessageBubble from "./elements/MessageBubble";

class PrivateRoom extends Component{
    constructor(props){
        super(props);
        this.updateMessages = this.updateMessages.bind(this);
        this.updateWhiteboard = this.updateWhiteboard.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.messagesScrollToBottom = this.messagesScrollToBottom.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleResize = this._handleResize.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._handleUp = this._handleUp.bind(this);
        this.getToken = this.getToken.bind(this);
        this.whiteboardRef = React.createRef();
        this.socket = openSocket('http://localhost:8001');
        this.state = {
            messages : [],
            messagejsx : [],
            inputvalue : '',
            whiteboardHeight: 400,
            whiteboardWidth: 400,
            room: ""
        }
    }

    updateMessages(msg){
        var msglist = [...this.state.messages, msg].map((message) =>
            <MessageBubble text={message} type="othermsg" />
        )
        this.setState({messagejsx: msglist}, this.messagesScrollToBottom());
        this.setState({messages: [...this.state.messages, msg]});
    }

    sendMessage(msg){
        var msglist = [...this.state.messages, msg].map((message) =>
            <MessageBubble text={message} type="usermsg" />
        )
        this.setState({messagejsx: msglist}, this.messagesScrollToBottom());
        this.setState({messages: [...this.state.messages, msg]});
        this.setState({inputvalue: ""});
    }

    updateWhiteboard(drawing){
        this.whiteboardRef.loadSaveData(drawing, true);
    }

    messagesScrollToBottom(){
        this.messagesEnd.scrollIntoView();
    }

    componentDidUpdate() {
        this.messagesScrollToBottom();
    }

    componentDidMount() {
        this._handleResize();
        window.addEventListener('resize', this._handleResize);
        //socket handling
        this.socket.on('chat', this.updateMessages);
        this.socket.on('draw', this.updateWhiteboard);
        this.getToken();
    }

    async getToken(){
        var userdata = await this.props.auth.getUser();
        this.socket.emit('makeDetails', userdata);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._handleResize);
    }

    _handleUp(e){
        //after mouse leftclick is released
        if(e.nativeEvent.which === 1){
            //right now just outputs the line object... later it will send it over websockets.
            //make sure to handle if undefined.
            this.socket.emit('draw', this.whiteboardRef.getSaveData());
            var lines = JSON.parse(this.whiteboardRef.getSaveData()).lines;
            console.log(lines[lines.length - 1]);
        }
    }

    _handleKeyPress(e){
        if(e.key === "Enter" && this.state.inputvalue != ''){
            if(this.state.inputvalue[0] == '/'){
                //handle commands
            }
            else{
                this.socket.emit('chat', this.state.inputvalue);
                this.sendMessage(this.state.inputvalue);
            }
        }
    }

    _handleChange(c){
        this.setState({inputvalue: c.target.value});
    }

    _handleClick(c){
        //handle right click
        if(c.type === "contextmenu"){
            c.preventDefault();
            this.whiteboardRef.clear();
        }
        return false;
    }

    _handleResize(){
        this.setState({
            whiteboardHeight: document.getElementById('wb').clientHeight,
            whiteboardWidth: document.getElementById('wb').clientWidth,
        });
    }

    render() {
        return(
            <div className="columns is-fullheight">
                <div className="column chatinterface">
                    <div className="boardContainer">
                        <div className="msgBoard">
                            <div className="msgContent">
                                {this.state.messagejsx}
                            </div>
                        </div>
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className="inputbox">
                        <input className="input is-rounded typemsg" type="text" value={this.state.inputvalue} onChange={this._handleChange} onKeyPress={this._handleKeyPress} placeholder="Type a message..."/>
                    </div>
                </div>
                <div className="column whiteboard" id="wb" onMouseUp={this._handleUp} onContextMenu={this._handleClick}>
                    <CanvasDraw ref={canvasDraw => (this.whiteboardRef = canvasDraw)} canvasHeight={this.state.whiteboardHeight} canvasWidth={this.state.whiteboardWidth} brushRadius={2} lazyRadius={0}/>

                </div>
            </div>
        )
    }

}

export default withAuth(PrivateRoom);