//jshint esversion:6

import * as types from '../actions/actionTypes';
import initialState from '../stores/initialState';

export default function userReducer(state={}, action) {
    //console.log("\nAction Type (userReducer) : " + action.type + "\n");

    switch (action.type) {
        case types.LOAD_USERS_SUCCESS:
            //console.log("\nCurrent state [LOAD_USERS_SUCCESS] : " + JSON.stringify(state) + "\n");
            //console.log("\nUsers state in [LOAD_USERS_SUCCESS] : " + JSON.stringify(action.payload) + "\n");
            //console.log("\nCurrent state [LOAD_USERS_SUCCESS] : " + JSON.stringify(state) + "\n");
            //console.log("\nData [LOAD_USERS_SUCCESS] : " + JSON.stringify(action.payload) + "\n");
            return Object.assign([], state, action.payload);
            // return [
            //     ...state,
            //     Object.assign({}, {users: action.payload})
            // ];
    default:
            return state;
    }
}