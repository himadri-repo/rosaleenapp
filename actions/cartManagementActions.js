//jshint esversion:6

import * as types from './actionTypes';
import { startAjaxCall, errorAjaxCall } from './ajaxCallActions';
import {AsyncStorage} from 'react-native';

export function updateCartSuccess(cart) {
    return {type: types.UPDATE_CART_SUCCESS, payload: cart};
}

const CURRENT_CART_INFORMATION = 'current_cart_information';
export function updateCart(cart) {
    //console.log('cart in actions top: ' + JSON.stringify(cart));
    return (dispatch => {
        dispatch(updateCartSuccess(cart));
    });
}