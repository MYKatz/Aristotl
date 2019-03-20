import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import ProblemCard from './elements/ProblemCard';

class TutorBoard extends Component{
    constructor(props){
        super(props);
        this.getData = this.getData.bind(this);
        this.makeHtml = this.makeHtml.bind(this);
        this.state = {
            problems : [],
            inner: []
        }
        this.getData();
    }

    async getData(){
        try{
            const response = await fetch('http://localhost:8000/api/getProblems', {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
                    "Content-Type": "application/json"
                },
                method: "GET",
            });
            const data = await response.json();
            console.log(data);
            this.setState({problems: data.problems});
            this.makeHtml(data.problems);
            //this.makeHtml(['A', 'B', 'C', 'D', 'E','A', 'B', 'C', 'D', 'E','A', 'B', 'C', 'D', 'E']);
        }
        catch(err){
            throw err;
        }
    }

    makeHtml(probs){
        var innerjsx = [];
        var temp = [];
        for(var i = 0; i < probs.length; i++){
            temp.push(<ProblemCard info={probs[i]} />)
            
            if( (i+1) % 3 == 0){
                innerjsx.push(
                    <div className="tile is-12">
                        {temp}
                    </div>
                )
                temp = [];
            }
        }
        innerjsx.push(
            <div className="tile is-12">
                {temp}
            </div>
        )
        this.setState({inner: innerjsx});
    }

    render(){
        return(
            <div>
                <div style={{marginBottom: '3vh'}}>
                    <span style={{fontSize: '2rem'}}>Home</span>
                </div>
                <div className="tile is-ancestor is-vertical">
                    {this.state.inner}
                </div>
            </div>
        );
    }
}

export default withAuth(TutorBoard);