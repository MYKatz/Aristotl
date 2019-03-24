import React, { Component } from 'react';
import '../css/dash.css';
import { withAuth } from '@okta/okta-react';
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter} from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

import Home from "./Home";
import Settings from "./Settings";
import Credits from "./Credits";
import History from "./History";
import Menu from "./elements/Menu";

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

class Dash extends Component {
    constructor(props) {
        super(props);
        this.setMainComponent = this.setMainComponent.bind(this);
        this.checkAuth = this.checkAuth.bind(this);
        this.titles = ["Home", "Settings", "History", "Credits"]
        this.state = {
            filler : null,
            activeComponent : 0,
            name: "User Name"
        };
        this.checkAuth();
    }

    setMainComponent(ind){
        //this.setState({activeComponent: this.components[ind]});
        //this.props.history.push(this.components[ind]);
        //window.location.reload(true);
        this.setState({activeComponent: ind});
    }

    async checkAuth(){
        const user = await this.props.auth.getUser();
        this.setState({name: user.name});
        this.setState({credits: user.credits});
    }

    render(){
        const { classes } = this.props;
        return(
            <MuiThemeProvider theme={theme}>
            <Router>
                <div className={classes.root} location={location}>
                    <CssBaseline />
                    <AppBar position="fixed" color="primary" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" color="inherit">
                                {this.titles[this.state.activeComponent]}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Menu setMain={this.setMainComponent} creds={this.state.credits} items={["Home", "Settings", "History", "Credits", "Two"]}/>
                    {/* {this.components[this.state.activeComponent]} */}
                    <main className={classes.content} style={{paddingBottom: 0, height: "100vh"}}>
                        <div className={classes.toolbar} />
                        <Switch>
                            <Route path="/dash/settings" exact component={Settings} />
                            <Route path="/dash/history" exact component={History} />
                            <Route path="/dash/credits" exact component={Credits} />
                            <Route path="/two" render={() => <h3>Two</h3>} />
                            <Route component={Home} />
                        </Switch>
                    </main>
                </div>
            </Router>
            </MuiThemeProvider>
        )
    }

}

export default withStyles(styles)(withRouter(withAuth(Dash)));