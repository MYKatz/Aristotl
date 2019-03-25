import React, { Component } from 'react';
import '../css/chatboard.css';
import CanvasDraw from "react-canvas-draw";
import { withAuth } from '@okta/okta-react';
import openSocket from 'socket.io-client';
import { ChatFeed, Message } from 'react-chat-ui';
import { Picker } from 'emoji-mart';

import 'emoji-mart/css/emoji-mart.css';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ExitToApp from '@material-ui/icons/ExitToApp';
import Info from '@material-ui/icons/Info';
import Close from '@material-ui/icons/Close';


const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});

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
        this.setMessages = this.setMessages.bind(this);
        this.openModal = this.openModal.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
        this.whiteboardRef = React.createRef();
        this.socket = openSocket('http://localhost:8001/private');
        this.state = {
            messages : [],
            messagejsx : [],
            inputvalue : '',
            whiteboardHeight: 400,
            whiteboardWidth: 400,
            room: "",
            emojimartshown: false,
            modalVisible: false,
            modalImg: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            isStudent: false
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

    setMessages(arr){
        this.setState({messages: arr});
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
        this.socket.on('messages', this.setMessages);
        this.getToken();
    }

    async getToken(){
        var userdata = await this.props.auth.getUser();
        this.setState({name: userdata.name});
        this.setState({isStudent: !userdata.isTutor})
        this.socket.emit('makeDetails', {data: userdata, room: this.props.match.params.id});
        const response = await fetch("http://localhost:8000/api/getphoto/" + this.props.match.params.id, {
            headers: {
              "Content-Type": "application/json"
            },
            method: "GET",
        });
        const responsedata = await response.text();
        if(responsedata.length > 20){
            this.setState({modalImg: responsedata});
        }

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._handleResize);
    }

    _handleUp(e){
        //after mouse leftclick is released
        if(e.nativeEvent.which === 1){
            this.socket.emit('draw', this.whiteboardRef.getSaveData());
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

    closeHandler(){
        this.socket.emit("close", "");
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

    openModal(){
        this.setState({modalVisible: true});
    }

    _handleClose(){
        this.setState({modalVisible: false});
    }

    render() {
        const { classes } = this.props;
        return(
            <MuiThemeProvider theme={theme}>
                <div className={classes.root} location={location}>
                    <CssBaseline />
                    <AppBar position="fixed" color="primary" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" color="inherit">
                                Private Room
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    >
                        <div className={classes.toolbar} />
                        <List>
                            <ListItem button key={"Room info"} onClick={this.openModal}>
                                <ListItemIcon><Info /></ListItemIcon>
                                <ListItemText primary={"Room info"} />
                            </ListItem>
                            <ListItem button key={"Leave Room"} onClick={this.clickHandler}>
                                <ListItemIcon><ExitToApp /></ListItemIcon>
                                <ListItemText primary={"Leave Room"} />
                            </ListItem>
                            {this.state.isStudent &&
                                <ListItem button key={"Close Problem"} onClick={this.closeHandler}>
                                    <ListItemIcon><Close /></ListItemIcon>
                                    <ListItemText primary={"Close Problem"} />
                                </ListItem>
                            }
                        </List>
                    </Drawer>
                    <main className={classes.content} style={{paddingBottom: 0, paddingTop: 0, height: "100vh"}}>
                        <div className={classes.toolbar} />
                        <div className="columns is-fullheight" style={{height: "89vh"}}>
                            <div className="column chatinterface" style={{background: "#fafafa"}}>
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
                    </main>
                </div>
                <Dialog
                open={this.state.modalVisible}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Room Info</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Room ID: {this.props.match.params.id}
                    </DialogContentText>
                    <img src={this.state.modalImg} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this._handleClose} color="primary">
                        Close
                        </Button>
                    </DialogActions>
                </Dialog>
        </MuiThemeProvider>


        
        )
    }

}

export default withStyles(styles)(withAuth(PrivateRoom));