import React, { Component } from 'react';
import { updateUser, getUser } from '../redux/actions';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import {FaDoorOpen, FaMap, FaSearch, FaUser} from 'react-icons/fa';
import {FaDatabase} from "react-icons/fa/index";

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount(){
    }

    getAccessText = (role) => {

    }

    getSugestedLink = (role) => {

    }

    render() {
        return (
            <div>
            <br></br>
            <br></br>
            <br></br>
                {this.props.user.username !== "" && <h2><FaUser></FaUser>{this.props.user.username}</h2>}

            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => ({
    user:state.user
});

const mapActionsToProps = {
    onUpdateUser: updateUser,
    onGetUser: getUser,
};

export default connect(mapStateToProps, mapActionsToProps)(Home);
