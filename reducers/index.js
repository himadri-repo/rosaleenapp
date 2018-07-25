//jshint esversion:6
import { combineReducers } from 'redux';
import services from './serviceReducer';
import serviceCategories from './serviceCategryReducer';
import users from './userReducer';
import ajaxCallInProgress from './ajaxStatusReducer';
import {authorize, currentUser} from './currentUserReducer';

const rootReducer = combineReducers({
    services, serviceCategories, users,
    ajaxCallInProgress,
    credentials: authorize,
    currentUser: currentUser,
});

export default rootReducer;