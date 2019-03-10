import axios from 'axios';

import config from '../../config';

const BASE_URL = config.backendUrl;

export { login, register, isLoggedIn, logout};

const login = (credentials) => {
    const url = `${BASE_URL}/api/security/login`;
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.post(url, credentials).then(response => response.data);
}

const logout = () => {
    localStorage.setItem('jwtToken', null);
}

const register = (credentials) => {
    const url = `${BASE_URL}/api/security/signup`;
    return axios.post(url, credentials).then(response => response.data);

}


const isLoggedIn = () => {
    const url = `${BASE_URL}/api/security/is_logged_in`;
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    console.log(localStorage.getItem('jwtToken'));
    return axios.get(url).then(response => response.data);
}
