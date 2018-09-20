//jshint esversion:6
//jshint ignore:start
import * as types from '../actions/actionTypes';
import {startAjaxCall, errorAjaxCall} from './ajaxCallActions';
import customerApi from '../api/customerApi';

export function getCustomerSuccess(customers) {
    return {type: types.GET_CUSTOMERS_SUCCESS, payload: customers};
}

export function getCustomers() {
    return (dispatch => {
        dispatch(startAjaxCall());
        customerApi.getCustomers().then(customers => {
            //console.log(JSON.stringify(customers));
            dispatch(getCustomerSuccess(customers));
        })
        .catch(error => {
            console.log(error);
            dispatch(errorAjaxCall(error));
        });
    });
}

export function getCustomersByQuery(query) {
    return (dispatch => {
        dispatch(startAjaxCall());
        customerApi.getCustomersByQuery(query).then(customers => {
            //console.log(JSON.stringify(rates));
            dispatch(getCustomerSuccess(customers));
        })
        .catch(error => {
            console.log(error);
            dispatch(errorAjaxCall(error));
        });
    });
}

//jshint ignore:end