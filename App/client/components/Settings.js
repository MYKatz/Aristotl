import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

class Settings extends Component{
    constructor(props){
        super(props)
        this.checkGroup = this.checkGroup.bind(this);
        this.state = {
            userdata : [],
            isStudent : null,
            doneLoading : false
        }
        this.checkGroup();
    }

    async checkGroup(){
        const user = await this.props.auth.getUser();
        if(user.groups.includes("Students")){
            //render Student settings page
            this.setState({isStudent: true});
        }
        else{
            //render Tutor settings page
            this.setState({isStudent: false});
        }
        this.setState({doneLoading: true});
    }

    render(){
        return(
            <div>
                {this.state.doneLoading &&
                    <div>
                        {this.state.isStudent ? (
                            <div>Student</div>
                        ) : ( 
                            <div>Tutor</div>
                        )}
                    </div>
                }
            </div>
        )
    }
}

export default withAuth(Settings);