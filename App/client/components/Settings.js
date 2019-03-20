import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import Select from 'react-select';


const tags = [
    {value: "economics", label: "Economics"},
    {value: "math", label: "Math"},
    {value: "physics", label: "Physics"},
    {value: "chemistry", label: "Chemistry"},
    {value: "history", label: "History"},
    {value: "calculus", label: "Calculus"},
];

class Settings extends Component{
    constructor(props){
        super(props)
        this.checkGroup = this.checkGroup.bind(this);
        this.renderGradeLevels = this.renderGradeLevels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.formatSubjects = this.formatSubjects.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.state = {
            userData : {},
            isStudent : null,
            doneLoading : false,
            innerGradeLevels : [],
            subjects : []
        }
        this.checkGroup();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        var object = {subjects : this.state.subjects};
        data.forEach(function(value, key){
            object[key] = value;
        });
        var bodyjson = JSON.stringify(object);
        try {
          const response = await fetch('http://localhost:8000/api', {
            headers: {
              Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
              "Content-Type": "application/json"
            },
            method: "POST",
            body: bodyjson
          });
          const responsedata = await response.json();
          console.log(responsedata);
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

    async checkGroup(){
        const user = await this.props.auth.getUser();
        console.log(user);
        if(user.subjects){
            this.formatSubjects(user.subjects);
        }
        this.setState({userData: user});
        if(!user.isTutor){
            //render Student settings page
            this.setState({isStudent: true});
        }
        else{
            //render Tutor settings page
            this.setState({isStudent: false});
        }
        this.setState({doneLoading: true}, () => this.renderGradeLevels(user.gradeLevel));
    }

    renderGradeLevels(gl){
        var gradelevel = gl || 0;
        var jsxa = []
        for(var i=1; i<13; i++){
            if(i == gradelevel){
                jsxa.push(<option selected="selected">{i}</option>);
            }
            else{
                jsxa.push(<option>{i}</option>)
            }
        }
        this.setState({innerGradeLevels: jsxa})
    }

    formatSubjects(arr){
        //takes array of subjects ['math', 'english', ...] and converts them to react-select formatting
        var newarr = []
        arr.forEach(function(elem){
            newarr.push({value: elem, label: elem.charAt(0).toUpperCase() + elem.slice(1)});
        });
        this.setState({defaultSubjects: newarr});
    }

    render(){
        return(
            <div>
                <h2 style={{fontSize: "2rem"}}>Settings</h2>
                {this.state.doneLoading &&
                    <div>
                        {this.state.isStudent ? (
                            <div className="columns">
                                <div className="column is-one-fifth"></div>
                                <div className="column is-three-fifths">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="field">
                                            <label className="label">Name</label>
                                            <div className="control">
                                                <input className="input" type="text" name="name" defaultValue={this.state.userData.name}/>
                                            </div>
                                            </div>

                                            <div className="field">
                                            <label className="label">Grade level</label>
                                            <div className="control">
                                                <div className="select">
                                                <select name="gradeLevel">
                                                    {this.state.innerGradeLevels}
                                                </select>
                                                </div>
                                            </div>
                                            </div>

                                            <div className="field">
                                            <label className="label">Account type</label>
                                            <div className="control">
                                                <div className="select">
                                                <select name="type">
                                                    <option selected="selected">Student</option>
                                                    <option>Tutor</option>
                                                </select>
                                                </div>
                                            </div>
                                            <p className="help">This is just for the demo, so you can switch easily</p>
                                            </div>

                                            <div className="field">
                                            <label className="label">Bio</label>
                                            <div className="control">
                                                <textarea className="textarea" placeholder="Just another student..." name="bio" defaultValue={this.state.userData.bio}></textarea>
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
                        ) : ( 
                            <div className="columns">
                                <div className="column is-one-fifth"></div>
                                <div className="column is-three-fifths">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="field">
                                            <label className="label">Name</label>
                                            <div className="control">
                                                <input className="input" type="text" name="name" defaultValue={this.state.userData.name}/>
                                            </div>
                                            </div>

                                            <div className="field">
                                            <label className="label">Account type</label>
                                            <div className="control">
                                                <div className="select">
                                                <select name="type">
                                                    <option>Student</option>
                                                    <option selected="selected">Tutor</option>
                                                </select>
                                                </div>
                                            </div>
                                            <p className="help">This is just for the demo, so you can switch easily</p>
                                            </div>

                                            <div className="field">
                                            <label className="label">Bio</label>
                                            <div className="control">
                                                <textarea className="textarea" placeholder="Just another tutor..." name="bio" defaultValue={this.state.userData.bio}></textarea>
                                            </div>
                                            </div>

                                            <div className="field">
                                            <label className="label">Subjects</label>
                                            <div className="control">
                                                <Select options={tags} defaultValue={this.state.defaultSubjects} onChange={this.handleChange} isMulti className="basic-multi-select" classNamePrefix="select"/>
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
                        )}
                    </div>
                }
            </div>
        )
    }
}

export default withAuth(Settings);