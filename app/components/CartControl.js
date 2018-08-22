//jshint ignore:start
import React, { Component } from 'react';
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    StatusBar,
    BackHandler,
    Platform,
    AsyncStorage,
    TouchableOpacity,
} from 'react-native';
import {withNavigationFocus, StackActions, NavigationActions} from 'react-navigation';
import Auth0 from 'react-native-auth0';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Loader from './Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {updateCartSuccess} from '../../actions/cartManagementActions';
//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const CURRENT_CART_INFORMATION = 'current_cart_information';

export class CartControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cart: {selectedServices: [], customer:{} }};
        // let storedCart = AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(value => {
        //     let storedCart = JSON.parse(value);
        //     //console.log('stored cart: ' + JSON.stringify(storedCart));
        //     this.state.cart = Object.assign({}, {selectedServices:[], customer: {}}, storedCart, this.props.cart);
        //     // console.log('stored cart: ' + JSON.stringify(this.state.cart));

        //     this.props.actions.updateCartSuccess(this.state.cart);
        // }).done();
        this.loadUpdatedState();
    }
    //didFocus
    focusListener = this.props.navigation.addListener('willFocus', payload => {
        //this.loadUpdatedState();
        //console.log('Focused -> ' + JSON.stringify(payload));
        console.log('count: ' + this.state.cart.selectedServices.length);
        console.log(JSON.stringify(this.state.cart.selectedServices));
        
        if(payload.state.params && payload.state.params.cart) {
            this.state.cart = payload.state.params.cart;

            this.props.actions.updateCartSuccess(this.state.cart);
            console.log('cart -> ' + JSON.stringify(this.state.cart));
        }
    });

    // componentDidMount = () => {
    //     focusListener = this.navigation.addListener('focus', doStuff);
    // }

    componentWillUnmount = () => {
        this.focusListener.remove();
    }

    // componentDidMount = () => {
    //     let storedCart = AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(value => {
    //         let storedCart = JSON.parse(value);
    //         //console.log('stored cart: ' + JSON.stringify(storedCart));
    //         this.state.cart = Object.assign({}, {selectedServices:[], customer: {}}, storedCart, this.props.cart);
    //         // console.log('stored cart: ' + JSON.stringify(this.state.cart));

    //         this.props.actions.updateCartSuccess(this.state.cart);
    //     }).done();
    // };

    // componentWillReceiveProps(nextProps) {
    //     let storedCart = AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(value => {
    //         let storedCart = JSON.parse(value);
    //         //console.log('stored cart: ' + JSON.stringify(storedCart));
    //         this.state.cart = Object.assign({}, {selectedServices:[], customer: {}}, storedCart, this.props.cart);
    //         // console.log('stored cart: ' + JSON.stringify(this.state.cart));

    //         this.props.actions.updateCartSuccess(this.state.cart);
    //     });
    // }

    loadUpdatedState = () => {
        let storedCart = AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(value => {
            let storedCart = JSON.parse(value);
            //console.log('stored cart: ' + JSON.stringify(storedCart));
            this.state.cart = Object.assign({}, {selectedServices:[], customer: {}}, storedCart, this.props.cart);
            // console.log('stored cart: ' + JSON.stringify(this.state.cart));

            this.props.actions.updateCartSuccess(this.state.cart);
        });
    }
    
    OnSalesReview = () => {
        //Alert.alert('Confirm', 'Do you want to proceed with billing?');
        //await AsyncStorage.setItem(CURRENT_CART_INFORMATION, JSON.stringify(this.state.cart));
        //console.log(`Cart is stored into storage -> Services count: ${this.state.cart.selectedServices.length}`);
        this.props.navigation.navigate('ServiceSalesReviewTabLanding', {cart: this.state.cart});
    }
  
    manageCart = () => {
        Alert.alert('Confirm', 'Do you want to clear the cart (Yes/No)?', [
            {text: "Yes", onPress: ()=> {
                console.log('Clearing cart state');
                AsyncStorage.removeItem(CURRENT_CART_INFORMATION, error=> {
                    if(error)
                        console.log(error);
                    this.state.cart = {selectedServices:[], customer: {}};
                    this.props.actions.updateCartSuccess(this.state.cart);
                });
            }},
            {text: "No", onPress: ()=> {
                console.log('Not clearing cart state');
            }, style:'cancel'},
        ], {cancelable: true});
    }

    render() {
        //this.loadUpdatedState();
        let cart = this.state.cart;
        //let cart = Object.assign({}, {selectedServices:[], customer: {}}, this.state.cart);
        //let cart = Object.assign({}, {selectedServices:[], customer: {}}, this.state.cart, this.props.cart);
        //console.log('cart in CartControl: ' + JSON.stringify(cart));
        //console.log('cart in props: ' + JSON.stringify(this.props.cart));
        //console.log('cart in state: ' + JSON.stringify(this.state.cart));
        let platform = Platform.OS === 'ios' ? 'ios' : 'md';
        let iconName = cart.selectedServices.length>0? `${platform}-cart` : `${platform}-cart`;
        //cart.selectedServices.length
        //console.log('count: ' + this.state.cart.selectedServices.length);
        
        if(this.state.cart.selectedServices.length>0) {
            return (
                <TouchableOpacity activeOpacity={0.7} onPress={()=>this.OnSalesReview()}>
                    <Ionicons visible style={styles.menuIcon} name={iconName} color='white' size={35} title='cart info'/>
                    <Text style={styles.marktext}>{this.state.cart.selectedServices.length}</Text>
                </TouchableOpacity>
            );
        }
        else {
            return null;
        }
    }
}
// <Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => this.logout() } />

// <Ionicons style={styles.menuIcon} name={iconName} color='white' size={35} onPress={()=>Alert.alert('Confirm', 'You have some items in your cart')} title='cart info'/>;

function mapStateToProps(state, ownProps) {
    return {
        ...state
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        actions: bindActionCreators({updateCartSuccess}, dispatch),
        //cartActions: bindActionCreators({updateCart}, dispatch),
    }
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(CartControl));

const styles = StyleSheet.create({
    menuIcon: {
      flex: 1,
      color: '#ffffff',
      marginLeft: 10,
      marginRight: 10
    },
    headerIconContainer: {
      flex: 1,
      flexDirection: 'row',
      padding: 5,
    },
    marktext: {
        position: 'absolute',
        marginLeft: 22,
        marginTop: -5,
        fontFamily: 'arial',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 20,
        color: '#ff0000',
        backgroundColor: 'rgba(255,255,255, 0)',
        /*width: 5,
        height: 10*/
    }
});