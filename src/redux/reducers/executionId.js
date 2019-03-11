import { UPDATE_EXECUTION_ID, GET_EXECUTION_ID } from '../actions'

const scraperSummary = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_EXECUTION_ID:
            return action.payload.executionId;
        case GET_EXECUTION_ID:
            return state;
        default:
            return state;
    }
}
export default scraperSummary
