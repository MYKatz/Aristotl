import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

class ProblemCard extends Component {

    constructor(props){
        super(props);
        this.goTo = this.goTo.bind(this);

    }

    goTo(){
        this.props.history.push("/private/"+this.props.info._id);
        window.location.reload(true);
    }

    render(){
        return(
            <div className="tile is-4">
                <div className="card" style={{margin: '5px', width: '99%'}}>
                    <header className="card-header">
                        <p className="card-header-title">
                            {this.props.info.subject.charAt(0).toUpperCase() + this.props.info.subject.slice(1)}
                        </p>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            Gradelevel: {this.props.info.gradeLevel} <br/>
                            Userbio: {this.props.info.userbio}
                        </div>
                    </div>
                    <footer className="card-footer">
                        <a onClick={this.goTo} className="card-footer-item">Join</a>
                    </footer>
                </div>
            </div>
        );
    }
}

export default withRouter(ProblemCard);