import React, { Component } from 'react';
import '../css/chatboard.css';
import CanvasDraw from "react-canvas-draw";
import { withAuth } from '@okta/okta-react';
import { withRouter } from 'react-router-dom';
import openSocket from 'socket.io-client';
import { ChatFeed, Message } from 'react-chat-ui';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Dropzone from "react-dropzone";

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
        this._handleClose = this._handleClose.bind(this);
        this._handleUpload = this._handleUpload.bind(this);
        this.socket = openSocket('https://aristotl.xyz:443');
        this.state = {
            messages : [],
            messagejsx : [],
            inputvalue : '',
            whiteboardHeight: 400,
            whiteboardWidth: 400,
            room: "",
            modalOpen: false,
            link: ""
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
        this.setState({modalOpen: true});
        this.setState({link: link});
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

    _handleClose(){
        this.props.history.push("/private/"+this.state.link);
        window.location.reload(true);
    }

    async _handleUpload(acceptedFiles){
        const data = new FormData();
        data.append('photo', acceptedFiles[0]);
        data.append('pid', this.state.link);
        const resp = await fetch("https://aristotl.xyz/api/addphoto", {
             method: 'POST',
             headers: {
                  Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
                 'Accept': 'application/json',
             },
             body: data
        });
        this.props.history.push("/private/"+this.state.link);
        window.location.reload(true);
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
                <Dialog
                open={this.state.modalOpen}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Image Upload</DialogTitle>
                    <DialogContent>
                        <Dropzone onDrop={this._handleUpload}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                <div {...getRootProps()} style={{height: "20vh", borderStyle: "dotted"}}>
                                    <input {...getInputProps()} />
                                    <DialogContentText style={{marginTop: "8vh"}}>
                                        Please drop in an image of your problem.
                                    </DialogContentText>
                                </div>
                                </section>
                            )}
                        </Dropzone>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this._handleClose} color="primary">
                        I don't have one
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}

export default withRouter(withAuth(ChatBoard));