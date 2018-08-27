//jshint esversion:6
//jshint ignore:start
import * as types from '../actions/actionTypes';
import {startAjaxCall, errorAjaxCall} from './ajaxCallActions';
import rateApi from '../api/rateApi';

export function getRatesSuccess(rates) {
    return {type: types.GET_RATES_SUCCESS, payload: rates};
}

export function getRates() {
    return (dispatch => {
        dispatch(startAjaxCall());
        rateApi.getRates().then(rates => {
            //console.log(JSON.stringify(rates));
            dispatch(getRatesSuccess(rates));
        })
        .catch(error => {
            console.log(error);
            dispatch(errorAjaxCall(error));
        });
    });
}


//jshint ignore:end