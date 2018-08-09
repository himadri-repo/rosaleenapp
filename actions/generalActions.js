//jshint esversion:6
//jshint ignore:start
import * as types from './actionTypes';
import {startAjaxCall, errorAjaxCall} from './ajaxCallActions';
import serviceApi from '../api/serviceApi';

export function setNavigatorSuccess(navigation) {
    return {type: types.SAVE_NAVIGATOR, payload: navigation};
}

//jshint ignore:end