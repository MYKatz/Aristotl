import React, { Component } from 'react';
import '../css/chatboard.css';
import CanvasDraw from "react-canvas-draw";
import { withAuth } from '@okta/okta-react';

class ChatBoard extends Component{
    constructor(props){
        super(props);
        this.updateMessages = this.updateMessages.bind(this);
        this.messagesScrollToBottom = this.messagesScrollToBottom.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleResize = this._handleResize.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this.whiteboardRef = React.createRef();
        this.state = {
            messages : [],
            messagejsx : [],
            inputvalue : '',
            whiteboardHeight: 400,
            whiteboardWidth: 400
        }
    }

    updateMessages(){
        var msglist = [...this.state.messages, this.state.inputvalue].map((message) =>
            <div>{message}</div>
        )
        this.setState({messagejsx: msglist}, this.messagesScrollToBottom());
        this.setState({messages: [...this.state.messages, this.state.inputvalue]});
        this.setState({inputvalue: ""});
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
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._handleResize);
    }

    _handleKeyPress(e){
        if(e.key === "Enter" && this.state.inputvalue != ''){
            this.updateMessages();
        }
    }

    _handleChange(c){
        this.setState({inputvalue: c.target.value});
    }

    _handleClick(c){
        //handle right click
        console.log(c.type);
        if(c.type === "contextmenu"){
            c.preventDefault();
            console.log("RIGHT PRESSED");
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
                <div className="column whiteboard" id="wb" onContextMenu={this._handleClick}>
                    <CanvasDraw ref={canvasDraw => (this.whiteboardRef = canvasDraw)} canvasHeight={this.state.whiteboardHeight} canvasWidth={this.state.whiteboardWidth} brushRadius={2} lazyRadius={0}/>

                </div>
            </div>
        )
    }

}

export default ChatBoard;