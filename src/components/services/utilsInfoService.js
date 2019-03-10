import axios from 'axios';

import config from '../../config';

const BASE_URL = config.backendUrl;

export { findCity, findAvailableInfo};


////utils_info/findCity?cityName=Soria
const findCity = (cityName) => {
    const url = `${BASE_URL}/api/utils_info/findCity?cityName=${cityName}`;
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}

//utils_info/find_available_info?cityName=Soria
const findAvailableInfo = (cityName) => {
    const url = `${BASE_URL}/api/utils_info/find_available_info?cityName=${cityName}`;
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}
