export const UPDATE_USER = "datalyze:updateUser";
export const GET_USER = "datalyze:getUser";

export const UPDATE_SCRAPING_SUMMARY = "scraper:updateScraperSummary";
export const GET_SCRAPER_SUMMARY = "scraper:getScraperSummary";

export const UPDATE_EXECUTION_ID = "scraper:updateExecutionId";
export const GET_EXECUTION_ID = "scraper:getExecutionId";

export const UPDATE_DBNAME = "scraper:updateDbName";
export const GET_DBNAME = "scraper:getDbName";

export const updateUser = newUser => ({
    type: UPDATE_USER,
    payload: {
        user: newUser
    }
})

export const getUser = () => ({
    type: GET_USER,
})

export const updateScraperSummary = newScraperSummary => ({
    type: UPDATE_SCRAPING_SUMMARY,
    payload: {
        scraper: newScraperSummary
    }
})

export const updateExecutionId = newExecutionId => ({
    type: UPDATE_EXECUTION_ID,
    payload: {
        executionId: newExecutionId
    }
})

export const updateDbName = newDbName => ({
    type: UPDATE_DBNAME,
    payload: {
        dbName: newDbName
    }
})

export const getScraper = () => ({
    type: GET_SCRAPER_SUMMARY,
})

export const getExecutionId = () => ({
    type: GET_EXECUTION_ID,
})
