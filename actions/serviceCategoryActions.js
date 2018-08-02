//jshint esversion:6
import * as types from './actionTypes';
import serviceCategoryApi from '../api/serviceCategoryApi';
import {startAjaxCall, errorAjaxCall} from '../actions/ajaxCallActions';

export function getServiceCategoriesSuccess(serviceCategories) {
    return {type: types.LOAD_SERVICE_CATEGORIES_SUCCESS, payload: serviceCategories};
}

export function getServiceCategories() {
    return (dispatch => {
        dispatch(startAjaxCall());
        //console.log("getServiceCategories - being called");
        serviceCategoryApi.getServiceCategories()
        .then(serviceCategories => {
            dispatch(getServiceCategoriesSuccess(serviceCategories));
        })
        .catch(reason => {
            console.log(reason);
            dispatch(errorAjaxCall(reason));
        });
    });
}