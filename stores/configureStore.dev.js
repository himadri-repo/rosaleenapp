//jshint esversion: 6
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
//import initialState from './initialState';

//create store and pass it to provider
export default function configStore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(thunk));
    //return createStore(rootReducer, applyMiddleware(thunk));
}