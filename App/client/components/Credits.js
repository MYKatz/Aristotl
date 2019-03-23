import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';


const tags = [
    {value: "economics", label: "Economics"},
    {value: "math", label: "Math"},
    {value: "physics", label: "Physics"},
    {value: "chemistry", label: "Chemistry"},
    {value: "history", label: "History"},
    {value: "calculus", label: "Calculus"},
];

class Credits extends Component{
    constructor(props){
        super(props)
        this.checkCredits = this.checkCredits.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.state = {
            userData : {},
            isStudent : null,
            doneLoading : false,
            innerGradeLevels : [],
            subjects : []
        }
        this.checkCredits();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        var object = {subjects : this.state.subjects};
        data.forEach(function(value, key){
            object[key] = value;
        });
        try {
          const response = await fetch('http://localhost:8000/api/addcredits/' + object.creds, {
            headers: {
              Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
              "Content-Type": "application/json"
            },
            method: "POST",
          });
          this.reloadPage();
        } catch (err) {
          // handle error as needed
        }
    }

    handleChange(selectedOptions){
        this.setState({subjects : selectedOptions})
    }

    reloadPage(){
        console.log("reloading");
        window.location.reload(true);
    }

    async checkCredits(){
        const user = await this.props.auth.getUser();
        this.setState({userData: user});
    }

    render(){
        return(
            <div>
                <h2 style={{fontSize: "2rem"}}>Add Credits</h2>
                    <div>
                            <div className="columns">
                                <div className="column is-one-fifth"></div>
                                <div className="column is-three-fifths">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="field">
                                            <label className="label">Add Credits</label>
                                            <label className="label">Current: {this.state.userData.credits || 0} credits</label>
                                            <div className="control">
                                                <input className="input" type="number" name="creds" placeholder="credits to add"/>
                                            </div>
                                            </div>

                                            <div className="field is-grouped">
                                            <div className="control">
                                                <button className="button is-link">Submit</button>
                                            </div>
                                            <div className="control">
                                                <button className="button is-text">Cancel</button>
                                            </div>
                                            </div>
                                    </form>
                                </div>
                            </div>
                    </div>
            </div>
        )
    }
}

export default withAuth(Credits);