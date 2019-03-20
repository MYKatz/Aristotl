import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import ChatBoard from "./ChatBoard";
import TutorBoard from './TutorBoard';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            doneLoading : false
        }
        this.checkGroup = this.checkGroup.bind(this);
        this.checkGroup();
    }

    async checkGroup(){
        const user = await this.props.auth.getUser();
        this.setState({userData: user});
        if(!user.isTutor){
            //render Student page
            this.setState({isStudent: true});
        }
        else{
            //render Tutor page
            this.setState({isStudent: false});
        }
        this.setState({doneLoading: true});
    }

    render(){
        if(this.state.doneLoading){
            if(this.state.isStudent){
                return <ChatBoard />
            }
            else{
                return <TutorBoard />
            }
        }
        else{
            return <div></div>
        }
    }

}

export default withAuth(Home);