import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import { session } from './auth.js';
import { countries } from './common.js';

export default combineReducers({
    session,
    countries,
    form: formReducer
});