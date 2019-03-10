import React, { Component } from 'react';
import { login } from '../services/authService';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';
import { connect } from 'react-redux';
import { updateUser, getUser } from '../../redux/actions';
import LoadingDots from "../LoadingDots";

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            message: '',
            loading: false
        };
    }
    onUpdateUser = (user) => {
        this.props.onUpdateUser(user);
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    onSubmit = (e) => {
        this.setState({loading:true});
        e.preventDefault();

        const { username, password } = this.state;

        login({ username, password }).then((result) => {
                localStorage.setItem('jwtToken', result.token);
                localStorage.setItem('dat-user',username);
                this.setState({ message: '' });
                const user = {username, role:result.role};
                this.onUpdateUser(user);
                this.props.history.push('/home')
                this.setState({loading:false});

        })
            .catch((error) => {
                this.setState({loading:false})
                if (error && error.response && error.response.status === 401) {
                    this.setState({ message: 'Login failed. Username or password not match' });
                } else {
                    this.setState({ message: 'error login in' });
                }
            });
    }
    render() {
        const { username, password, message } = this.state;
        return (
            <div className="container">
                <form className="form-signin" onSubmit={this.onSubmit}>
                    {message !== '' &&
                        <div className="alert alert-warning alert-dismissible" role="alert">
                            {message}
                        </div>
                    }
                    <h2 className="form-signin-heading">Please sign in</h2>
                    <label htmlFor="inputEmail" className="sr-only">Username</label>
                    <input type="text" className="form-control" placeholder="username" name="username" value={username} onChange={this.onChange} required />
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required />
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
                    <p>
                        Not a member? <Link to="/register"><span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Register here</Link>
                    </p>
                </form>
                {this.state.loading && <span><h3 className="loading" >Cargando <LoadingDots/></h3></span>}
            </div>
        );
    }
}


const mapStateToProps = state => ({
    user: state.user
});

const mapActionsToProps = {
    onUpdateUser: updateUser,
    onGetUser: getUser,
};

export default connect(mapStateToProps, mapActionsToProps)(Login);
