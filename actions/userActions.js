//jshint esversion:6

import * as types from './actionTypes';
import { startAjaxCall, errorAjaxCall } from './ajaxCallActions';
import userApi from '../api/userApi';

export function getUsersSuccess(users) {
    return {type: types.LOAD_USERS_SUCCESS, payload: users};
}

export function getUsers() {
    return (dispatch => {
        dispatch(startAjaxCall());
        userApi.getUsers().then(users => {
            dispatch(getUsersSuccess(users));
        })
        .catch(reason => {
            console.log(reason);
            dispatch(errorAjaxCall(reason));
        });
    });
}

export function authorizationSuccess(credentials, profile) {
    return {type: types.USER_AUTHORIZATION_SUCCESS, payload: {
            credentials,
            profile
        }
    };
}

export function getCurrentUserSuccess(currentUser) {
    return { type: types.GET_CURRENTUSER_SUCCESS, payload: currentUser };
}

export function getCurrentUser(profile) {
    return (dispatch=> {
        userApi.getUsers().then(users => {
            let currentUser = users.find(user=> {
                return (user && user.email && user.email===profile.email);
            });
        
            if(currentUser) {
                //console.log("Current User: " + JSON.stringify(currentUser));
                dispatch(getCurrentUserSuccess(currentUser));
            }
        })
        .catch(reason => {
            console.log(reason);
            dispatch(errorAjaxCall(reason));
        });
    });
}

export function authorize(credentials, profile) {
    return (dispatch=> {
        //console.log('Authorized action: ' + JSON.stringify(credentials));
        dispatch(authorizationSuccess(credentials, profile));

        dispatch(getCurrentUser(profile));
    });
}