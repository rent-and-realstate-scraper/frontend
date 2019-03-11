import { UPDATE_SCRAPING_SUMMARY, GET_SCRAPER_SUMMARY } from '../actions'

const scraperSummary = (state = "", action) => {
    switch (action.type) {
        case UPDATE_SCRAPING_SUMMARY:
            return action.payload.scraper;
        case GET_SCRAPER_SUMMARY:
            return state;
        default:
            return state;
    }
}
export default scraperSummary
