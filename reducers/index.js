//jshint esversion:6
import { combineReducers } from 'redux';
import services from './serviceReducer';
import serviceCategories from './serviceCategryReducer';
import users from './userReducer';
import ajaxCallInProgress from './ajaxStatusReducer';
import {authorize, currentUser} from './currentUserReducer';
import general from './generalReducer';
import cart from './cartReducer';
import rates from './rateReducer';
import customers from './customerReducer';
import invoices from './invoiceReducer';

const rootReducer = combineReducers({
    rates, services, serviceCategories, users, customers,
    ajaxCallInProgress,
    credentials: authorize,
    currentUser: currentUser,
    navigator: general,
    cart, invoices
});

export default rootReducer;