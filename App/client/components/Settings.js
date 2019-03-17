import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import Select from 'react-select';


const tags = [
    {value: "english", label: "English"},
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
        this.state = {
            userdata : {},
            isStudent : null,
            doneLoading : false,
            innerGradeLevels : []
        }
        this.checkGroup();
    }

    async checkGroup(){
        const user = await this.props.auth.getUser();
        this.setState({userData: user});
        console.log(user);
        if(user.groups.includes("Students")){
            //render Student settings page
            this.setState({isStudent: true});
        }
        else{
            //render Tutor settings page
            this.setState({isStudent: false});
        }
        this.setState({doneLoading: true}, () => this.renderGradeLevels(user.gradelevel));
    }

    renderGradeLevels(gl){
        var gradelevel = gl || 0
        var jsxa = []
        for(var i=1; i<13; i++){
            if(i == gradelevel){
                jsxa.push(<option selected="selected">{i}</option>);
            }
            else{
                jsxa.push(<option>{i}</option>)
            }
        }
        console.log(jsxa);
        this.setState({innerGradeLevels: jsxa})
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
                                    <form>
                                        <div className="field">
                                            <label className="label">Name</label>
                                            <div className="control">
                                                <input className="input" type="text" defaultValue={this.state.userData.name}/>
                                            </div>
                                            </div>

                                            <div className="field">
                                            <label className="label">Grade level</label>
                                            <div className="control">
                                                <div className="select">
                                                <select>
                                                    {this.state.innerGradeLevels}
                                                </select>
                                                </div>
                                            </div>
                                            </div>

                                            <div className="field">
                                            <label className="label">Account type</label>
                                            <div className="control">
                                                <div className="select">
                                                <select>
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
                                                <textarea className="textarea" placeholder="Just another student..."></textarea>
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
                                    <form>
                                        <div className="field">
                                            <label className="label">Name</label>
                                            <div className="control">
                                                <input className="input" type="text" defaultValue={this.state.userData.name}/>
                                            </div>
                                            </div>

                                            <div className="field">
                                            <label className="label">Account type</label>
                                            <div className="control">
                                                <div className="select">
                                                <select>
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
                                                <textarea className="textarea" placeholder="Just another tutor..."></textarea>
                                            </div>
                                            </div>

                                            <div className="field">
                                            <label className="label">Subjects</label>
                                            <div className="control">
                                                <Select options={tags} isMulti className="basic-multi-select" classNamePrefix="select"/>
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