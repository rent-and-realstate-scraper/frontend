export const UPDATE_USER = "datalyze:updateUser";
export const GET_USER = "datalyze:getUser";

export const updateUser = newUser => ({
    type: UPDATE_USER,
    payload: {
        user: newUser
    }
})

export const getUser = () => ({
    type: GET_USER,
})
