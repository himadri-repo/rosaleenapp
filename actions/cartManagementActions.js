//jshint esversion:6

import * as types from './actionTypes';
import { startAjaxCall, errorAjaxCall } from './ajaxCallActions';
//import {AsyncStorage} from 'react-native';
import cartApi from '../api/cartApi';

export function updateCartSuccess(cart) {
    return {type: types.UPDATE_CART_SUCCESS, payload: cart};
}

const CURRENT_CART_INFORMATION = 'current_cart_information';
export function updateCart(cart, callback) {
    console.log('cart in actions top: ' + JSON.stringify(cart));
    return (dispatch => {
        dispatch(startAjaxCall());
        cartApi.saveCart(cart).then(savedCart=> {
            //console.log('SAVED CART: ' + JSON.stringify(savedCart));
            dispatch(updateCartSuccess(cart));
            if(callback) {
                callback(savedCart);
            }
        })
        .catch(error => {
            console.log(error);
            dispatch(errorAjaxCall(error));
            if(callback) {
                callback(error);
            }
        });
    });
}