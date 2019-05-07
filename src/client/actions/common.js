import { createAction } from 'redux-actions';
import * as COMMON from './../apis/common.js';

const countriesPending = createAction('COUNTRIES_PENDING', data => data);
const countriesFulfilled = createAction('COUNTRIES_FULFILLED', data => data);
const countriesRejected = createAction('COUNTRIES_REJECTED', data => data);

export function getCountries() {
    return function (dispatch, getState) {
        dispatch(countriesPending());
        return COMMON.getCountries()
            .then((res) => {
                console.log(res);
                dispatch(countriesFulfilled(res.data));
            })
            .catch((err) => {
                console.log(err);
                dispatch(countriesRejected(err));
            });
    }
}