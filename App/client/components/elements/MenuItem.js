import React, { Component } from 'react';

class MenuItem extends Component {
    constructor(props){
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        this.state = {
            active : this.props.active || false
        };
    }

    clickHandler(){
        this.props.clickforwarder(this.props.index);
    }

    componentDidUpdate(oldProps){
        if(oldProps.active !== this.props.active){
            this.setState({active: this.props.active});
        }
    }
    
    render(){
        return(
            <li onClick={this.clickHandler}><a className={(this.state.active ? 'is-active' : '')}>{this.props.inner}</a></li>
        )
    }
}

export default MenuItem;