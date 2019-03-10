import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import Login from './auth/Login';
import Create from './auth/Register';
class Roots extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className="container">
                <Route path="/login" component={Login} />
                <Route path="/register" component={Create} />
                <Route exact path="/" component={Home} />
                <Route path="/home" component={Home} />
            </div>);
    }
}

export default Roots;
