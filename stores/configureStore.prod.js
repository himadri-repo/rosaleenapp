//jshint esversion: 6
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

//create store and pass it to provider
export default function configStore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(thunk));
}