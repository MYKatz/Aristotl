import React, { Component } from 'react';

class ProblemCard extends Component {
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
                        <a href="#" className="card-footer-item">Join</a>
                    </footer>
                </div>
            </div>
        );
    }
}

export default ProblemCard;