export const setUserState = (username) => {
    return {
        type: "userState",
        payload: username
    }
}

export const setSocketApi = (apiUrl) => {
    return {
        type: "socketApi",
        payload: apiUrl
    }
}