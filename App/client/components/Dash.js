import React, { Component } from 'react';
import '../css/dash.css';
import { withAuth } from '@okta/okta-react';
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter} from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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
        return(
            <Router>
            <div className="fullpage" location={location}>
                <div className="columns is-fullheight">
                    <div className="">
                        <Menu setMain={this.setMainComponent} items={["Home", "Settings", "History", "Credits", "Two"]}/>
                    </div>
                    <div className="column" style={{overflowY: 'scroll', paddingTop: 0, padding: 0, background: "white"}}>
                        <AppBar position="static" color="default" style={{}}>
                            <Toolbar>
                                <Typography variant="h5" color="inherit">
                                    {this.titles[this.state.activeComponent]}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        {/* {this.components[this.state.activeComponent]} */}
                        <div style={{padding: ".75rem"}}>
                            <Switch>
                                <Route path="/dash/settings" exact component={Settings} />
                                <Route path="/dash/history" exact component={History} />
                                <Route path="/dash/credits" exact component={Credits} />
                                <Route path="/two" render={() => <h3>Two</h3>} />
                                <Route component={Home} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
            </Router>
        )
    }

}

export default withStyles(styles)(withRouter(withAuth(Dash)));