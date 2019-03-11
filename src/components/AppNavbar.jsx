import React from 'react';
import PropTypes from 'prop-types'

import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { updateUser, getUser } from '../redux/actions';
import {isLoggedIn, logout} from './services/authService';
import {FaDoorOpen, FaMap, FaSearch, FaUser} from "react-icons/fa";
import {FaDoorClosed} from "react-icons/fa/index";

class AppNavbar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {redirect:false};
    }

    onUpdateUser = (user) => {
        this.props.onUpdateUser(user);
    }

    async componentDidMount(){
        const isLogged = await isLoggedIn();
        if (isLogged.logged) {
            const username = isLogged.userLogged.username;
            const role = isLogged.userLogged.role;
            this.props.onUpdateUser({username, role});
        }

    }

    onLogout = async () =>{
        await logout();
        this.setState({username:null});
        this.props.onUpdateUser({username:""});
        //this.props.history.push('/home')

    }

    renderRedirect = () => {
        if (this.state.redirect) {
            //return <Redirect to='/login' />
        }
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to="/">Scraper</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon">
                    </span>

                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            {this.getSugestedLink(this.props.user.role)}
                        </li>
                    </ul>
                    {! this.props.user.username &&
                    <div className="nav-item my-sm-0">
                        <Link className="nav-link nav-link btn btn-dark" to="/login"> <FaDoorOpen/> Login</Link>
                    </div>
                    }
                    {this.props.user.username &&
                    <div className="nav-item my-sm-0">
                        <div className="nav-link btn btn-link" ><FaUser/>{this.props.user.username}</div>
                    </div>
                    }
                    {this.props.user.username &&
                    <div className="nav-item my-sm-0">
                        <button className="nav-link btn btn-dark" onClick={this.onLogout}> <FaDoorClosed/> Logout</button>
                    </div>
                    }
                </div>

                {this.renderRedirect()}
            </nav>

        )
    }

    getSugestedLink = (role) => {
        if (role === undefined) {
            return (
            <div>
            <Link className="nav-link btn btn-dark" to="/scraping_executions"> Scraping Executions</Link>
            </div>)
        } else {
            return <span></span>;
        }
    }
}

AppNavbar.propTypes = {
    user: PropTypes.object.isRequired
}


const mapStateToProps = (state, ownProps) => ({
    user:state.user
});

const mapActionsToProps = {
    onUpdateUser: updateUser,
    onGetUser: getUser,
};

export default connect(mapStateToProps, mapActionsToProps)(AppNavbar);
