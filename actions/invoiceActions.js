//jshint esversion:6
//jshint ignore:start
import * as types from '../actions/actionTypes';
import {startAjaxCall, errorAjaxCall} from './ajaxCallActions';
import invoiceApi from '../api/invoiceApi';

export function getInvoicesSuccess(invoices) {
    return {type: types.GET_INVOICES_SUCCESS, payload: invoices};
}

export function getInvoices() {
    return (dispatch => {
        dispatch(startAjaxCall());
        invoiceApi.getInvoices().then(invoices => {
            //console.log(JSON.stringify(rates));
            dispatch(getInvoicesSuccess(invoices));
        })
        .catch(error => {
            console.log(error);
            dispatch(errorAjaxCall(error));
        });
    });
}

export function getInvoicesByQuery(query) {
    return (dispatch => {
        dispatch(startAjaxCall());
        console.log('Query passed: ' + JSON.stringify(query));
        invoiceApi.getInvoicesByQuery(query).then(invoices => {
            //console.log('Invoices returned: ' + JSON.stringify(invoices));
            dispatch(getInvoicesSuccess(invoices));
        })
        .catch(error => {
            console.log(error);
            dispatch(errorAjaxCall(error));
        });
    });
}

//jshint ignore:end