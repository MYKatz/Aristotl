import React, { Component } from 'react';
import '../css/chatboard.css';
import CanvasDraw from "react-canvas-draw";
import { withAuth } from '@okta/okta-react';
import { withRouter } from 'react-router-dom';
import openSocket from 'socket.io-client';
import { ChatFeed, Message } from 'react-chat-ui';

class ChatBoard extends Component{
    constructor(props){
        super(props);
        this.updateMessages = this.updateMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleUp = this._handleUp.bind(this);
        this.getToken = this.getToken.bind(this);
        this.goTo = this.goTo.bind(this);
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
        this.setState({messages: [...this.state.messages, new Message({id: 1, message: msg})]});
    }

    sendMessage(msg){
        this.setState({messages: [...this.state.messages, new Message({id: 0, message: msg})]});
        this.setState({inputvalue: ""});
    }

    componentDidMount() {
        window.addEventListener('resize', this._handleResize);
        //socket handling
        this.socket.on('chat', this.updateMessages);
        this.socket.on('draw', this.updateWhiteboard);
        this.socket.on('redirect', this.goTo);
        this.getToken();
    }

    goTo(link){
        setTimeout(function(){
            this.props.history.push("/private/"+link);
            window.location.reload(true);
        }.bind(this),
        3000
        );
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

    render() {
        return(
            <div className="columns is-fullheight" style={{height: "89vh"}}>
                <div className="column chatinterface" style={{background: "#fafafa"}}>
                    <ChatFeed 
                            messages={this.state.messages} 
                            showSenderName
                    />
                    <div className="inputbox">
                        <input className="input is-rounded typemsg" type="text" value={this.state.inputvalue} onChange={this._handleChange} onKeyPress={this._handleKeyPress} placeholder="Type a message..."/>
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(withAuth(ChatBoard));