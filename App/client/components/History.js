import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import PanelBlock from './elements/PanelBlock';

class History extends Component{
    constructor(props){
        super(props);
        this.getData = this.getData.bind(this);
        this.state = {
            problems: "You have not asked any questions yet :("
        }
        this.getData();
    }

    async getData(){
        const response = await fetch('http://localhost:8000/api/getUserProblems', {
            headers: {
                Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
                "Content-Type": "application/json"
            },
            method: "GET"
        });
        const data = await response.json();
        var m = data.problems.map(prb => {
            return <PanelBlock info={prb} />
        });
        if(m.length > 0){
            this.setState({problems: m});
        }
    }

    render(){
        return(
            <div>
                <h2 style={{fontSize: "2rem"}}>History</h2>
                <div>
                <nav className="panel">
                    {this.state.problems}
                </nav>
                </div>
            </div>
        )
    }
}

export default withAuth(History);