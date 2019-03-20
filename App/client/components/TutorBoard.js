import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

class TutorBoard extends Component{
    constructor(props){
        super(props);
        this.state = {
            problems : []
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
        }
        catch(err){
            throw err;
        }
    }

    render(){
        return(
            <div></div>
        );
    }
}

export default withAuth(TutorBoard);