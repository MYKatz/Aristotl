import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import MenuItem from "./MenuItem";
import { withRouter } from "react-router-dom";
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

    render(){
        return(
            <aside className="menu">
                <ul className="menu-list">
                    {this.state.innerJSX}
                    <li onClick={this.logout}><a>Logout</a></li>
                </ul>
            </aside>
        )
    }
}

export default withRouter(withAuth(Menu));