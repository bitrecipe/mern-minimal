var _session = {
    authenticated: false,
    email: null,
    userId: null,
    inProgress: false,
    error: null
}

export function session(state = _session, action) {
    switch (action.type) {

        case `LOGIN_FULFILLED`:
            return Object.assign({}, state, { authenticated: action.payload.data.authenticated, email: action.payload.data.email, userId: action.payload.data.userId, inProgress: false });

        default:
            return state;
    }
}