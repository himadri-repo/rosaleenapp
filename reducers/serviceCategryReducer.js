//jshint esversion:6
import * as types from '../actions/actionTypes';
import initialState from '../stores/initialState';

export default function serviceCategoryReducer(state={}, action) {
    //console.log("\nCurrent state : " + JSON.stringify(state) + "\n");
    //console.log("\nAction Type (serviceCategoryReducer) : " + action.type + "\n");

    switch (action.type) {
        case types.LOAD_SERVICE_CATEGORIES_SUCCESS:
            //console.log("\nCurrent state [LOAD_SERVICE_CATEGORIES_SUCCESS] : " + JSON.stringify(state) + "\n");
            //console.log("\nServiceCategories state in [LOAD_SERVICE_CATEGORIES_SUCCESS] : " + JSON.stringify(action.payload) + "\n");
            //return Object.assign({}, state, {serviceCategories: action.payload});
            //return Object.assign({}, state, {serviceCategories: action.payload});
            //console.log("\nData [LOAD_SERVICE_CATEGORIES_SUCCESS] : " + JSON.stringify(action.payload) + "\n");
            return Object.assign([], state, action.payload);
            //return action.payload.splice();
            // return [
            //     ...state,
            //     Object.assign({}, {serviceCategories: action.payload})
            // ];
        default:
            return state;
    }
}