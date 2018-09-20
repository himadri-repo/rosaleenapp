//jshint esversion: 6
import * as types from '../actions/actionTypes';
import initialState from '../stores/initialState';

export default function customerReducer(state={}, action) {
    //console.log("\nCurrent state : " + JSON.stringify(state) + "\n");
    //console.log("\nAction Type (serviceReducer) : " + action.type + "\n");

    switch (action.type) {
        case types.GET_CUSTOMERS_SUCCESS:
            //console.log("\nCurrent state [LOAD_SERVICES_SUCCESS] : " + JSON.stringify(state) + "\n");
            //console.log("\nServices state in [LOAD_SERVICES_SUCCESS] : " + JSON.stringify(action.payload) + "\n");
            //return Object.assign({}, state, {services: action.payload});
            //console.log("\nData [GET_CUSTOMERS_SUCCESS] : " + JSON.stringify(action.payload) + "\n");
            return Object.assign([], state, action.payload);

            // return [
            //     ...state,
            //     Object.assign({}, {services: action.payload})
            // ];
            // return [
            //     ...state,
            //     Object.assign({}, action.payload)
            // ];
        default:
            return state;
    }
}