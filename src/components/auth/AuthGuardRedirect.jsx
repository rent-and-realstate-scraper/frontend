import React, { Component } from 'react';
import {isLoggedIn} from '../services/authService';
import { Redirect} from 'react-router-dom';

class AuthGuardRedirect extends Component {
    constructor(props) {
        super(props);
        this.state = {isLogged:true}
    }
    async componentDidMount(){
        let isLoggedResponse;
        try{isLoggedResponse = await isLoggedIn()} catch (err){
            isLoggedResponse = false;
        }

        this.setState({isLogged:isLoggedResponse.logged});
    }
    render() {
        const result =  this.state.isLogged ? (
                <span></span>
              ) : (
                <Redirect to={{ pathname: '/login'}} />
              );
        return result;
    }
}

export default AuthGuardRedirect;
