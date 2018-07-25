//jshint esversion:6
import * as types from '../actions/actionTypes';
import initialState from '../stores/initialState';

export default function ajaxStatusReducer(state=initialState, action) {
    let ajaxCallCount = 0;
    if(state.ajaxCallInProgress)
        ajaxCallCount = state.ajaxCallInProgress;

    if(action.type===types.INITIATE_AJAX_CALL) {
        //console.log(" + [AJAX CALL] : " + ajaxCallCount);

        ajaxCallCount++;
        return ajaxCallCount;
        //state.ajaxCallInProgress++;
    }
    else if(action.type===types.INITIATE_AJAX_CALL || 
        action.type.substring(action.type.length-8)==="_SUCCESS") {
        //console.log(" - [AJAX CALL] : " + ajaxCallCount);
        
        ajaxCallCount--;
        //return Object.assign({}, {ajaxCallInProgress: ajaxCallCount});
        return ajaxCallCount;

        //return state.ajaxCallInProgress--;
    }
    else {
        return state;
    }
}