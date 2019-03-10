import { UPDATE_USER, GET_USER } from '../actions'

const user = (state = {username:""}, action) => {
    switch (action.type) {
        case UPDATE_USER:
            return action.payload.user;
        case GET_USER:
            return state;
        default:
            return state;
    }
}
export default user
