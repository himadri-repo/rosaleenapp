//jshint esversion:6
import * as types from './actionTypes';

export function startAjaxCall() {
    return {type: types.INITIATE_AJAX_CALL};
}

export function errorAjaxCall(error) {
    return {type: types.AJAX_CALL_ERROR, payload: error};
}