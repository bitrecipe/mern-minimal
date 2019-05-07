var _countries = {
    data: [],
    inProgress: false,
    error: null
}

export function countries(state = _countries, action) {
    switch (action.type) {

        case `COUNTRIES_PENDING`:
            return Object.assign({}, state, { inProgress: true });

        case `COUNTRIES_FULFILLED`:

            return Object.assign({}, state, { data: action.payload.data, inProgress: false });

        case `COUNTRIES_REJECTED`:
            return Object.assign({}, state, { error: action.payload, inProgress: false });

        default:
            return state;
    }
}