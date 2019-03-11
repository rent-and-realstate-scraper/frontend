import { combineReducers } from 'redux';
import user from './user';
import executionId from './executionId';
import scraperSummary from './scraperSummary';

export default combineReducers({
    user, executionId, scraperSummary
});
