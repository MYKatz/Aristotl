import React, { Component } from 'react';
import '../css/chatboard.css';
import CanvasDraw from "react-canvas-draw";
import { withAuth } from '@okta/okta-react';
import openSocket from 'socket.io-client';
import { ChatFeed, Message } from 'react-chat-ui';
import { Picker } from 'emoji-mart';

import 'emoji-mart/css/emoji-mart.css';

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
        this.clickHandler = this.clickHandler.bind(this);
        this.emojiHandler = this.emojiHandler.bind(this);
        this.addEmoji = this.addEmoji.bind(this);
        this.whiteboardRef = React.createRef();
        this.socket = openSocket('http://localhost:8001/private');
        this.state = {
            messages : [],
            messagejsx : [],
            inputvalue : '',
            whiteboardHeight: 400,
            whiteboardWidth: 400,
            room: "",
            emojimartshown: false
        }
    }

    updateMessages(msg){
        this.setState({messages: [...this.state.messages, new Message({id: 1, message: msg})]});
    }

    sendMessage(msg){
        this.setState({messages: [...this.state.messages, new Message({id: 0, message: msg})]});
        this.setState({inputvalue: ""});
    }

    updateWhiteboard(drawing){
        this.whiteboardRef.loadSaveData(drawing, true);
    }

    messagesScrollToBottom(){
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
        this.setState({name: userdata.name});
        this.socket.emit('makeDetails', {data: userdata, room: this.props.match.params.id});
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

    clickHandler(){
        this.props.history.push("/dash");
        window.location.reload(true);
    }

    emojiHandler(){
        //toggles state
        this.setState({emojimartshown: !this.state.emojimartshown});
    }

    addEmoji(e){
        this.setState({inputvalue: this.state.inputvalue + e.native});
        this.setState({emojimartshown: false});
    }

    render() {
        return(
            <div className="fullpage" location={location}>
            <div className="columns is-fullheight">
                <div className="column is-one-fifth sidemenu">
                    <div className="level">
                        <div className="level-item">
                            <figure className="image is-128x128">
                                <img className="is-rounded" src="data:image/jpeg;base64,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"/>
                            </figure>
                            
                        </div>
                    </div>
                    <div className="level">
                        <div className="level-item">
                            <strong>{this.state.name}</strong>
                        </div>
                    </div>
                    <aside className="menu">
                        <ul className="menu-list">
                            <li onClick={this.clickHandler}><a>Leave Room</a></li>
                            <li onClick={this.logout}><a>Logout</a></li>
                        </ul>
                    </aside>
                    <div className="bottomcontainer">
                        {/* <button className="button is-medium is-fullwidth blackbutton">Logout</button> */}
                    </div>
                </div>
                <div className="column" style={{overflowY: 'scroll', paddingTop: 0, paddingBottom: 0, background: "white"}}>
                    <div className="columns is-fullheight">
                        <div className="column chatinterface">
                            <ChatFeed 
                                messages={this.state.messages} 
                                showSenderName
                            />
                            <div className="inputbox control has-icons-right">
                                <input className="input is-rounded typemsg" type="text" value={this.state.inputvalue} onChange={this._handleChange} onKeyPress={this._handleKeyPress} placeholder="Type a message..."/>
                                <span className="icon is-small is-right" style={{pointerEvents: "auto", cursor: "pointer", userSelect: "none"}} onClick={this.emojiHandler}>😃</span>
                                {this.state.emojimartshown &&
                                    <span style={{position: "absolute", right: 0, top: "-60vh"}}><Picker onSelect={this.addEmoji}/></span>
                                }
                            </div>
                        </div>
                        <div className="column whiteboard" id="wb" onMouseUp={this._handleUp} onContextMenu={this._handleClick}>
                            <CanvasDraw ref={canvasDraw => (this.whiteboardRef = canvasDraw)} canvasHeight={this.state.whiteboardHeight} canvasWidth={this.state.whiteboardWidth} brushRadius={2} lazyRadius={0}/>

                        </div>
                    </div>
                </div>
            </div>
        </div>


        
        )
    }

}

export default withAuth(PrivateRoom);