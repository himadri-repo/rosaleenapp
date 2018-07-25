//jshint esversion:6
//jshint ignore:start
import * as types from './actionTypes';
import {startAjaxCall, errorAjaxCall} from './ajaxCallActions';
import serviceApi from '../api/serviceApi';

export function getServicesSuccess(services) {
    return {type: types.LOAD_SERVICES_SUCCESS, payload: services};
}

export function getServices() {
    return (dispatch => {
        dispatch(startAjaxCall());
        serviceApi.getServices().then(services=> {
            dispatch(getServicesSuccess(services));
        })
        .catch(error => {
            console.log(error);
            dispatch(errorAjaxCall(error));
        });
    });
}

//jshint ignore:end