import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Home from '@material-ui/icons/Home';
import Settings from '@material-ui/icons/Settings';
import DonutLarge from '@material-ui/icons/DonutLarge';
import ChatBubble from '@material-ui/icons/ChatBubble';

class MenuItem extends Component {
    constructor(props){
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        this.state = {
            active : this.props.active || false
        };
        this.icons = [<Home/>, <Settings/>, <DonutLarge/>, <ChatBubble/>]
    }

    clickHandler(){
        this.props.clickforwarder(this.props.index);
    }

    componentDidUpdate(oldProps){
        if(oldProps.active !== this.props.active){
            this.setState({active: this.props.active});
        }
    }
    
    oldrender(){
        return(
            <li onClick={this.clickHandler}><a className={(this.state.active ? 'is-active' : '')}>{this.props.inner}</a></li>
        )
    }

    render(){
        return(
            <ListItem button key={this.props.inner} onClick={this.clickHandler}>
                <ListItemIcon>{this.icons[this.props.index]}</ListItemIcon>
                <ListItemText primary={this.props.inner} />
            </ListItem>
        )
    }
}

export default MenuItem;