import axios from 'axios';

import config from '../../config';

const BASE_URL = config.backendUrl;

export { getScrapedCities,  getScrapingResults,  getScrapingResultsApproved, getProcessInfo };

const getScrapedCities = (scrapingId) => {
    const url = `${BASE_URL}/api/scraping_results/scraped_cities?scraping_id=${scrapingId}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}


const getScrapingResults = (city, scrapingId) => {
    const url = `${BASE_URL}/api/scraping_results/results?city=${city}&scraping_id=${scrapingId}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}

const getScrapingResultsApproved = (city) => {
    const url = `${BASE_URL}/api/scraping_results_approved/results?city=${city}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}

//http://localhost:3001/mysql-summary-scraping/processInfo/?device_id=raspberryOld&scraping_id=scraping-airbnb-gCloud--2018-11-29_14_04_43
const getProcessInfo = (deviceId, scrapingId) => {
    const url = `${BASE_URL}/api/scraping_results/process_info?device_id=${deviceId}&scraping_id=${scrapingId}`;
    //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    return axios.get(url).then(response => response.data);
}

