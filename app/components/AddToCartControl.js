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
import Ionicons from 'react-native-vector-icons/Ionicons';
//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

export class AddToCartControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ServiceItem: this.props.ServiceItem};
        // let storedCart = AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(value => {
        //     let storedCart = JSON.parse(value);
        //     //console.log('stored cart: ' + JSON.stringify(storedCart));
        //     this.state.cart = Object.assign({}, {selectedServices:[], customer: {}}, storedCart, this.props.cart);
        //     // console.log('stored cart: ' + JSON.stringify(this.state.cart));

        //     this.props.actions.updateCartSuccess(this.state.cart);
        // }).done();
        // this.loadUpdatedState(this.props.cart);
    }

    componentDidMount = () => {
        //this.setState({ServiceItem: this.props.ServiceItem});

        this.state.ServiceItem = this.props.ServiceItem; //Object.assign({}, this.state.ServiceItem, this.props.ServiceItem);

        console.log(JSON.stringify(this.state.ServiceItem));
    }
    
    OnManageCartItem = (value) => {
        //this.props.CartCount += value;
        //this.setState({cartCount: this.state.cartCount++});
        let count = this.state.ServiceItem.commercial.quantity;
        count += value;

        this.state.ServiceItem.commercial.quantity = count;

        //this.state.ServiceItem.commercial.quantity = count;
        //this.setState({ServiceItem: {commercial: {quantity: count}}});
        this.setState({ServiceItem: {...this.state.ServiceItem}});

        console.log('CartCount: ' + this.state.ServiceItem.commercial.quantity);

        if(this.props.OnChange) {
            this.props.OnChange(this.state.ServiceItem);
        }
    }

    render() {
        //this.loadUpdatedState();
        //let cart = this.state.cart;
        //let cart = Object.assign({}, {selectedServices:[], customer: {}}, this.state.cart);
        //let cart = Object.assign({}, {selectedServices:[], customer: {}}, this.state.cart, this.props.cart);
        //console.log('cart in CartControl: ' + JSON.stringify(cart));
        //console.log('cart in props: ' + JSON.stringify(this.props.cart));
        //console.log('cart in state: ' + JSON.stringify(this.state.cart));
        //let platform = Platform.OS === 'ios' ? 'ios' : 'md';
        //let iconName = cart.selectedServices.length>0? `${platform}-cart` : `${platform}-cart`;
        //cart.selectedServices.length
        console.log('count: ' + this.state.ServiceItem.commercial.quantity);
        //let cartItemValue = this.state.cartCount>0?this.state.cartCount:'Add';

        if(this.state.ServiceItem.commercial.quantity>0) {
            return (
                <View style={{marginTop: 20, height: 30, flexDirection: 'row', borderWidth: 2, borderColor: '#ff0000', backgroundColor: '#ffffff', alignContent: 'center', justifyContent: 'center', alignItems: "center", borderRadius: 7}}>
                    <TouchableOpacity activeOpacity={0.7} onPress={()=>this.OnManageCartItem(-1)} style={{width: 30, borderRightWidth: 1, backgroundColor: '#e1e1e1', borderRightColor: '#ffffff', marginRight: 2, height: 26, alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 7, borderTopLeftRadius: 7}}>
                        <Text style={{color: '#ff0000', margin: 4, fontSize: 25}}>-</Text>
                    </TouchableOpacity>
                    <Text style={{color: '#ff0000', margin: 2, fontSize: 16, borderWidth: 0}}>{this.state.ServiceItem.commercial.quantity}</Text>
                    <TouchableOpacity activeOpacity={0.7} onPress={()=>this.OnManageCartItem(1)} style={{width: 30, borderWidth: 0, backgroundColor: '#e1e1e1', marginLeft: 2, height: 26, alignItems: 'center', justifyContent: 'center', borderBottomRightRadius: 7, borderTopRightRadius: 7}}>
                        <Text style={{color: '#ff0000', margin: 4, fontSize: 25}}>+</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        else {
            return (
                <View style={{marginTop: 20, height: 30, flexDirection: 'row', borderWidth: 2, borderColor: '#ff0000', backgroundColor: '#ffffff', alignContent: 'center', justifyContent: 'center', alignItems: "center", borderRadius: 7}}>
                    <TouchableOpacity activeOpacity={0.7} onPress={()=>this.OnManageCartItem(-1)} style={{width: 30, borderRightWidth: 1, backgroundColor: '#e1e1e1', borderRightColor: '#ffffff', marginRight: 2, height: 26, alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 7, borderTopLeftRadius: 7, display: 'none'}}>
                        <Text style={{color: '#ff0000', margin: 4, fontSize: 25}}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={()=>this.OnManageCartItem(1)} >
                        <Text style={{color: '#ff0000', margin: 2, fontSize: 16, borderWidth: 0}}>ADD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={()=>this.OnManageCartItem(1)} style={{width: 30, borderWidth: 0, backgroundColor: '#e1e1e1', marginLeft: 2, height: 26, alignItems: 'center', justifyContent: 'center', borderBottomRightRadius: 7, borderTopRightRadius: 7}}>
                        <Text style={{color: '#ff0000', margin: 4, fontSize: 25}}>+</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        ...state
    };
}

// function mapDispatchToProps(dispatch, ownProps) {
//     return {
//         actions: bindActionCreators({updateCartSuccess}, dispatch),
//         //cartActions: bindActionCreators({updateCart}, dispatch),
//     }
// }
  

//export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(AddToCartControl));
export default connect(mapStateToProps)(withNavigationFocus(AddToCartControl));

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