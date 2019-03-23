import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import MenuItem from "./MenuItem";
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ExitToApp from '@material-ui/icons/ExitToApp';

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

class Menu extends Component {
    constructor(props){
        //accepts this.props.items as list of menu titles
        super(props);
        this.makeItems = this.makeItems.bind(this);
        this.clickForwarder = this.clickForwarder.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            innerJSX: [],
            activeIndex: 0
        }
        this.components = ["/dash", "/dash/settings", "/dash/history", "/dash/credits"];
    }

    componentDidMount(){
        this.makeItems(this.components.indexOf(this.props.location.pathname));
    }

    makeItems(targetIndex){
        this.props.setMain(targetIndex);
        var itemlist = this.props.items.map((item, index) =>
            <MenuItem clickforwarder={this.clickForwarder} index={index} inner={item} active={(index === targetIndex ? true : false)} />
        )
        this.setState({innerJSX: itemlist});
    }

    clickForwarder(ind){
        this.makeItems(ind);
        this.setState({activeIndex: ind});
        //forward again up to parent.
        this.props.setMain(ind);
        this.props.history.push(this.components[ind]);
    }

    async logout() {
        // Redirect to '/' after logout
        this.props.auth.logout('/');
    }

    oldrender(){
        return(
            <aside className="menu">
                <ul className="menu-list">
                    {this.state.innerJSX}
                    <li onClick={this.logout}><a>Logout</a></li>
                </ul>
            </aside>
        )
    }

    render(){
        const { classes } = this.props;
        return(
            <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            >
                <div className={classes.toolbar} />
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem button key={"Log out"} onClick={this.logout}>
                        <ListItemIcon><ExitToApp /></ListItemIcon>
                        <ListItemText primary={"Log out"} />
                    </ListItem>
                </List>
            </Drawer>
        )
    }
}

export default withStyles(styles)(withRouter(withAuth(Menu)));