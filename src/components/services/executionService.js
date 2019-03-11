import axios from 'axios';

import config from '../../config';

const BASE_URL = config.backendUrl;


export {getExecutions, getScrapingRemainingAllDevices };

// /stateExecution/state-execution-airbnb-scraping?skip=0&limit=2
const getExecutions = (limit, skip, order) => {
    const url = `${BASE_URL}/api/scraping_results/scraping_execution_log?skip=${skip}&limit=${limit}&order=${order}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}

const getScrapingRemainingAllDevices = () => {
    const url = `${BASE_URL}/api/scraping_results/scraping_remaining_all_devices`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}
