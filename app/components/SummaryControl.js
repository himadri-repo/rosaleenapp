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
import Icon from 'react-native-vector-icons/Ionicons';
//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

export class SummaryControl extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { mode: 'pricereview', totalValue: this.props.TotalValue, serviceCount: 0};
        //this.OnManageCart = this.OnManageCart.bind(this);
        //this.processServiceValues = this.processServiceValues.bind(this);
        // let storedCart = AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(value => {
        //     let storedCart = JSON.parse(value);
        //     //console.log('stored cart: ' + JSON.stringify(storedCart));
        //     this.state.cart = Object.assign({}, {selectedServices:[], customer: {}}, storedCart, this.props.cart);
        //     // console.log('stored cart: ' + JSON.stringify(this.state.cart));

        //     this.props.actions.updateCartSuccess(this.state.cart);
        // }).done();
        // this.loadUpdatedState(this.props.cart);
    }

    // componentWillReceiveProps = (nextProps) => {
    //     console.log('componentDidMount - Child \n' + JSON.stringify(this.props.Services));
    //     this.calculateTotalValue(this.props.Services);
    // }

    componentDidMount = () => {
        //this.setState({ServiceItem: this.props.ServiceItem});

        // this.state.ServiceItem = this.props.ServiceItem; //Object.assign({}, this.state.ServiceItem, this.props.ServiceItem);

        // console.log(JSON.stringify(this.state.ServiceItem));
        //console.log('componentDidMount - Child \n' + JSON.stringify(this.props.Services));
        //this.calculateTotalValue(this.props.Services);
    }
    
    serviceCount = (services) => {
        let srvCount = 0;
        services.forEach((srv, idx) => {
            srvCount += ((srv && srv.commercial.quantity>0)?1:0);
        });
        this.setState({serviceCount: srvCount});

        return srvCount;
    }

    calculateTotalValue(services) {
        let totalValue = 0;
        services.map(srv=> {
            //console.log('id : ' + srv.id + ' - ' + srv.commercial.quantity);
            totalValue += Math.round(parseInt(srv.commercial.quantity) * parseFloat(srv.commercial.rate),0);
            //this.setState({totalValue: totalValue});

        });
        //this is correct code
        this.updateTotalValueToState(totalValue);
        return totalValue;
    }

    updateTotalValueToState = (totalValue) => {
        this.setState({totalValue: totalValue});
        //console.log('Total value : ' + totalValue);
    }

    // processServiceValues(services) {
    //     console.log('hi');
    // }

    OnManageCart = (services) => {
        this.calculateTotalValue(services);
        this.serviceCount(services);
    }

    render() {
        let platform = Platform.OS === 'ios' ? 'ios' : 'md';
        let iconName = `${platform}-checkmark`;
        let headIconName = this.state.expand?'angle-double-up':'angle-double-down';
        let headVideoIconName = this.state.expandVideo?'angle-double-up':'angle-double-down';

        const BackButton = (props) => {
            const {mode} = props;
            if(mode==='pricereview') {
                return null;
            }
            else {
                return (<TouchableOpacity 
                    onPress = {() => {
                        this.setState({mode: 'pricereview'});

                        this.props.OnBackClick({mode: 'pricereview'});
                    }}
                    style={{height: '100%', alignItems: 'center', flex:1, flexDirection: 'row'}}>
                    <Text style = { styles.TouchableOpacityButtonTitleText}>
                        <Icon name='ios-arrow-back' size={25} color="#900" style={styles.TouchableOpacityButtonTitleIcon}/> 
                        {this.state.mode==='pricereview'? '': ' Back'}</Text>
                </TouchableOpacity>);
            }
        }

        return (
            <View style={{flexDirection:'row', backgroundColor: '#0000ff', margin: 6, height: '10%'}}>
                <BackButton mode={this.state.mode} />
                <TouchableOpacity 
                    onPress = {() => {
                        if(this.state.mode==="pricereview") {
                            //this.calculateTotalValue(this.props.Services);
                            this.setState({mode: 'customer'});
                        }
                        this.props.SaveCart();
                    }}
                    style={{height: '100%', alignItems: 'center', flex:3, flexDirection: 'row'}}>
                    <Text style = {{color: '#ffffff', textAlign: 'left', textAlignVertical:'center', width: '40%', paddingLeft: 5, fontSize: 17, fontWeight: '700'}}>
                        {`(${parseInt(this.state.serviceCount)}) ₹ ${parseInt(this.state.totalValue).toFixed(2)}`}</Text>
                    <Text style = { styles.TouchableOpacityButtonTitleText}>
                        <Icon name={iconName} size={25} color="#900" style={styles.TouchableOpacityButtonTitleIcon}/> {this.state.mode==='pricereview'? 'Customer Info': 'Checkout'}&nbsp;&nbsp;
                        <Icon name='ios-arrow-forward' size={25} color="#900" style={styles.TouchableOpacityButtonTitleIcon}/>&nbsp;&nbsp;</Text>
                </TouchableOpacity>
            </View>
        );
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
//export default connect(mapStateToProps)(withNavigationFocus(SummaryControl));
export default SummaryControl;

const styles = StyleSheet.create({
    menuIcon: {
        flex: 1,
        color: '#ffffff',
        marginLeft: 10,
        marginRight: 10
    },    
    MainContainer:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        /*borderWidth: 1,*/
    },
    ChildView:
    {
        borderWidth: 1,
        borderColor: '#00BCD4',
        margin: 5,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,        
    },
    TouchableOpacityStyle:
    {
        padding: 10,
        backgroundColor: '#00BCD4',
        flexDirection: 'row',
    },
    TouchableOpacityStyleTitle: {
        padding: 10,
        backgroundColor: '#00BCD4',
        flexDirection: 'row',
    },
    TouchableOpacityTitleText:
    {
        textAlign: 'left',
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 20,
        width: '88%'
    },
    TouchableOpacityButtonTitleText:
    {
        textAlign: 'right',
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        width: '60%',
        height: '100%',
        /*borderWidth: 1*/
    },    
    TouchableOpacityTitleIcon: {
        textAlign: 'right',
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 20,
        marginRight: 8,
    },
    TouchableOpacityButtonTitleIcon: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 20,
        marginRight: 8,
        paddingRight: 10,
        paddingLeft: 10,
    },
    deleteIcon: {
        textAlign: 'right',
        textAlignVertical: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
    ExpandViewInsideVideo: {
        width: 300,
        height: 300,
    },
    ExpandViewInsideText:
    {
        fontSize: 16,
        color: '#000',  
        padding: 12
    },
    ExpandSubViewInsideView:
    {
        flex:1,
        /*padding: 6,*/
        /*borderWidth: 1,*/
    },
    ButtonContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0000ff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        height: 40,
        width: '97%',
        marginTop: 10
        /*padding: 10,*/
    },
    paymentContainer: {
        flex: 1, 
        flexDirection: 'row',  
        marginTop: 10, 
        marginLeft: 20, 
        marginRight: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#121212'
    },
    paymentLebel: {
        width: 30, 
        justifyContent:'flex-start', 
        alignContent:'flex-start', 
        paddingLeft: 0, 
        marginLeft: 0
    },
    marktext: {
        position: 'absolute',
        paddingRight: 14,
        marginTop: -5,
        fontFamily: 'arial',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 20,
        color: '#ff0000',
        backgroundColor: 'rgba(255,255,255, 0)',
        /*width: 5,
        height: 10*/
    },
    listitem: {
        padding: 7, 
        margin: 5,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        height: 60,
    },
    listitemContainer: {
        flex: 1, 
        flexDirection: 'row', 
        height: 60
    }
});