//jshint ignore:start
import React from 'react'
import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])

/*Redux specific imports */
import { Provider } from 'react-redux'
import configStore from './stores/configureStore.dev';
/*Actions*/
import {getServices} from './actions/serviceActions';
import {getServiceCategories} from './actions/serviceCategoryActions';
import {getUsers} from './actions/userActions';
import {getRates} from './actions/rateActions';
import initialState from './stores/initialState';

const store = configStore(initialState);
//console.log("\n0." + JSON.stringify(store.getState()));
store.dispatch(getUsers());
store.dispatch(getServices());
store.dispatch(getServiceCategories());
store.dispatch(getRates());
// setTimeout(() => {
//     console.log("\n1." + JSON.stringify(store.getState()));
//     store.dispatch(getServices());
// }, 5000);

// setTimeout(() => {
//     console.log("\n2." + JSON.stringify(store.getState()));
//     store.dispatch(getServices());
// }, 10000);

// store.subscribe(()=> {
//     console.log("\nUpdated State: " + JSON.stringify(store.getState()));
// });

// setTimeout(() => {
//     console.log("\n3." + JSON.stringify(store.getState()));
// }, 5000);



// store.subscribe(() => {
//     try
//     {
//         console.log("Value : " + JSON.stringify(store.getState()));
//     }
//     catch(e) {
//         console.log(e);
//     }
// });


const rootApp = () => (
    <Provider store={store}>
        <App/>
    </Provider>
)

AppRegistry.registerComponent('rosaleenapp', () => rootApp);

//jshint ignore:end