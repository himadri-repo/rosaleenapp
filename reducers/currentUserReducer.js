//jshint esversion:6
import * as types from '../actions/actionTypes';
import initialState from '../stores/initialState';

export function currentUser(state=initialState, action={}) {
    switch (action.type) {
        case types.GET_CURRENTUSER_SUCCESS:
            //console.log("\nCurrent state [USER_AUTHORIZATION_SUCCESS] : " + JSON.stringify(state) + "\n");
            //console.log("\nCredentials state in [GET_CURRENTUSER_SUCCESS] : " + JSON.stringify(action.payload) + "\n");
            //return Object.assign({}, state, {credentials: action.payload});
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}

export function authorize(state=initialState, action={}) {
    switch (action.type) {
        case types.USER_AUTHORIZATION_SUCCESS:
            //console.log("\nCurrent state [USER_AUTHORIZATION_SUCCESS] : " + JSON.stringify(state) + "\n");
            //console.log("\nCredentials state in [USER_AUTHORIZATION_SUCCESS] : " + JSON.stringify(action.payload) + "\n");
            //return Object.assign({}, state, {credentials: action.payload});
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}