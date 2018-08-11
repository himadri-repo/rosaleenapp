//jshint esversion:6
//jshint ignore:start
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, LayoutAnimation, UIManager, Platform, AsyncStorage, Alert, ScrollView, Picker } from 'react-native';
import {withNavigationFocus, StackActions, NavigationActions} from 'react-navigation';
//redux specific imports
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUsers} from '../../actions/userActions'
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Card, ListItem, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import CartControl from '../components/CartControl';
import {updateCart} from '../../actions/cartManagementActions';


const CURRENT_CART_INFORMATION = 'current_cart_information';
const CUSTOMERSECTION_HEIGHT = 300;


export class SalesReviewScreen extends Component
{
    constructor(props)
    {
        super(props);
        if( Platform.OS === 'android' )
        {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = { 
           textLayoutHeight: 0,
           updatedHeight: 0, //340
           updatedVideoHeight: 0,  //400
           expand: false,
           expandVideo: false,
           buttonText: 'Customer Info',
           buttonTextVideo: 'Selected service(s)',
           cart: {selectedServices:[], customer: {}, paymentMethod:'Cash'},
           errorMessage: ''
        };
    }
 
    componentDidMount() {
        AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(cartObject => {
            this.setState({cart: JSON.parse(cartObject)});
            this.calculateTotalValue();
        })
        
        //console.log('state : ' + JSON.stringify(this.props));
    }

    componentWillUnmount() {
        console.log("\nServiceItemsScreen unmounting ...");
    }

    static navigationOptions = ({ navigation }) => ({
        title: `Review orders (Services: ${navigation.state.params.cart.selectedServices.length})`,
        headerRight: <Icon style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />
    });

    expand_collapse_Function =(item)=>
    {
        LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );
        if(item==1) {
            if( this.state.expand == false )
            {
                this.setState({ 
                  updatedHeight: 300, //this.state.textLayoutHeight, 
                  expand: true, 
                  buttonText: 'Customer Info' 
                }); 
            }
            else
            {
                this.setState({ 
                  updatedHeight: 0, 
                  expand: false, 
                  buttonText: 'Customer Info' 
                });
            }        
        }
        else if(item==2) {
            if( this.state.expandVideo == false )
            {
                //console.log('item TRUE -> ' + item);
                this.setState({ 
                  updatedVideoHeight: 400, /*this.state.textLayoutHeight,*/ 
                  expandVideo: true, 
                  buttonTextVideo: 'Selected service(s)'
                }); 
            }
            else
            {
                //console.log('item FALSE -> ' + item);
                this.setState({ 
                  updatedVideoHeight: 0, 
                  expandVideo: false, 
                  buttonTextVideo: 'Selected service(s)'
                });
            }        
        }
    }

    manageCart = () => {
        Alert.alert('Confirm', 'Do you want to clear the cart (Yes/No)?', [
            {text: "Yes", onPress: ()=> {
                //console.log('Clearing cart state');
                AsyncStorage.removeItem(CURRENT_CART_INFORMATION, error=> {
                    if(error)
                        console.log(error);
                    this.state.cart = {selectedServices:[], customer: {}, paymentMethod: 'Cash'};
                    this.props.actions.updateCart(this.state.cart);
                    this.props.navigation.navigate('ServiceCatTabLanding');
                });
            }},
            {text: "No", onPress: ()=> {
                console.log('Not clearing cart state');
            }, style:'cancel'},
        ], {cancelable: true});
    }

    deleteCartItem = (service) => {
        Alert.alert('Confirm', `Do you want to delete ${service.name} service item (Yes/No)?`, [
            {text: "Yes", onPress: ()=> {
                let selectedServices = this.state.cart.selectedServices;
                let index = selectedServices.findIndex(srv=> srv.id===service.id);
                if(index>=0) {
                selectedServices.splice(index, 1);
                }
        
                this.updateCart();
                this.state.cart.selectedServices = selectedServices;
            }},
            {text: "No", onPress: ()=> {
                console.log('Not clearing cart state');
            }, style:'cancel'},
        ], {cancelable: true});
    }

    updateCart() {
        try
        {
            AsyncStorage.setItem(CURRENT_CART_INFORMATION, JSON.stringify(this.state.cart)).then(value=> {
                this.props.actions.updateCart(this.state.cart);
                if(this.state.cart.selectedServices.length==0) {
                    this.props.navigation.navigate('ServiceCatTabLanding');
                }
            }).catch(reason => {
                console.log('Unable to save cart to local state [Error: ' + reason + "]");
            });
        }
        catch(error) {
          console.log(error);
        }
    }
 
    getHeight(height)
    {
        //console.log('Height => ' + height);
        height = CUSTOMERSECTION_HEIGHT;
        this.setState({ textLayoutHeight: height });
    }

    calculateValue(service) {
        let serviceItem = this.state.cart.selectedServices.find(srv=> srv.id===service.id);

        if(serviceItem) {
            let qty = parseInt(service.commercial.quantity);
            serviceItem.commercial.quantity = qty;
            let rate = parseFloat(service.commercial.rate);
            serviceItem.commercial.rate = rate;
            serviceItem.commercial.value = Math.round(qty * rate, 0);
            
            console.log('Service Item : ' + JSON.stringify(serviceItem));

            this.updateCart();
        }
        this.calculateTotalValue();

        console.log('cart: ' + JSON.stringify(this.state.cart));
    }

    calculateTotalValue() {
        let totalValue = 0;
        this.state.cart.selectedServices.map(srv=> {
            totalValue += Math.round(parseInt(srv.commercial.quantity) * parseFloat(srv.commercial.rate),0);
            //this.setState({totalValue: totalValue});

        });
        this.setState({totalValue: totalValue});
        console.log('Total value : ' + totalValue);
        return totalValue;
    }

    changePaymentMethod(paymentMethod) {
        //console.log('Payment Method: ' + paymentMethod);
        this.state.cart = Object.assign({}, this.state.cart, {paymentMethod: paymentMethod});
        //this.setState({paymentMethod: paymentMethod});
        AsyncStorage.setItem(CURRENT_CART_INFORMATION, JSON.stringify(this.state.cart)).then(value=> {
            //console.log('cart in actions: ' + JSON.stringify(cart));
            this.props.actions.updateCart(this.state.cart);
            // if(this.state.cart.selectedServices.length==0) {
            //     this.props.navigation.navigate('ServiceCatTabLanding');
            // }

            console.log('cart in actions: ' + JSON.stringify(this.state.cart));
          }).catch(reason => {
              console.log('Unable to save cart to local state [Error: ' + reason + "]");
        });
    }
 
    render()
    {
        let platform = Platform.OS === 'ios' ? 'ios' : 'md';
        let iconName = `${platform}-checkmark`;
        let headIconName = this.state.expand?'angle-double-up':'angle-double-down';
        let headVideoIconName = this.state.expandVideo?'angle-double-up':'angle-double-down';
        const CustomerInfo = (props) => (
            <View style={styles.ExpandSubViewInsideView}>
                <ScrollView>
                    <FormLabel>Mobile</FormLabel>
                    <FormInput onChangeText={(input) => Alert.alert('Confirmation', input)} placeholder='Enter mobile number' keyboardType='phone-pad'></FormInput>
                    <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                    <FormLabel>Name</FormLabel>
                    <FormInput onChangeText={(input) => Alert.alert('Confirmation', input)} placeholder='Enter name' keyboardType='default'></FormInput>
                    <View style={styles.paymentContainer}>
                        <FormLabel style={styles.paymentLebel}>Payment Mode</FormLabel>
                        <Picker
                            selectedValue={this.state.cart.paymentMethod}
                            style={{ height: 50, width: 100, marginLeft: 50 }}
                            onValueChange={(itemValue, itemIndex) => this.changePaymentMethod(itemValue)}>
                            <Picker.Item label="Cash" value="Cash" />
                            <Picker.Item label="Card" value="Card" />
                        </Picker>
                    </View>
                </ScrollView>
            </View>
        );

        const ServiceList = () => {
            //console.log(JSON.stringify(this.props.navigation.state.params.cart.selectedServices));
            //return this.props.navigation.state.params.cart.selectedServices.map(srv=> {
            return this.state.cart.selectedServices.map(srv=> {
                return (
                    <ListItem
                        key={'key-' + srv.id}
                        roundAvatar
                        title={srv.name}
                        subtitle={<View style={{marginLeft:7}}>
                            <Text>Technician: {(srv.technician?srv.technician.name:'')} | Service time: {srv.operation_time} min(s)</Text>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <TextInput
                                    style={{width: 75, marginRight: 7, textAlign: 'right'}}
                                    placeholder="Quantity"
                                    placeholderTextColor="rgba(44,44,44,0.4)"
                                    returnKeyType="next"
                                    keyboardType="numeric"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    defaultValue={srv.commercial.quantity.toString()}
                                    onEndEditing={(event) => {   
                                        let text = event.nativeEvent.text;
                                        srv.commercial.quantity=parseInt(text);
                                        this.calculateValue(srv);
                                    }}/>
                                <TextInput
                                    style={{width: 75, marginRight: 7, textAlign: 'right'}}
                                    placeholder="Rate"
                                    placeholderTextColor="rgba(44,44,44,0.4)"
                                    returnKeyType="next"
                                    keyboardType="numeric"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    defaultValue={srv.commercial.rate.toString()}
                                    onEndEditing={(event) => {
                                            let text = event.nativeEvent.text;
                                            srv.commercial.rate=parseFloat(text.trim());
                                            this.calculateValue(srv);
                                        }
                                    }/>
                                <Text style={{width: 100, marginTop: 15}}>= {srv.commercial.value}</Text>
                            </View>
                        </View>}
                        avatar={{uri:srv.image}}
                        rightIcon={<FAIcon name='trash-o' size={35} color='#ff0000' style={styles.deleteIcon} onPress={()=> this.deleteCartItem(srv)}/>}
                        style={styles.listitem}>
                    </ListItem>
                );
            });
        }
        //{`Technician: ${(srv.technician?srv.technician.name:'')} | Service time: ${srv.operation_time} min(s)`}
        //hideChevron={true}
        
        return(
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={ styles.MainContainer }>
                    <View style = { styles.ChildView }>
                        <TouchableOpacity activeOpacity = { 0.7 } 
                                onPress = {()=> this.expand_collapse_Function(1) } 
                                style = { styles.TouchableOpacityStyle }>
                            <FAIcon name='female' size={25} color='#900' style={styles.TouchableOpacityTitleIcon}/>
                            <Text style = { styles.TouchableOpacityTitleText}>{this.state.buttonText}</Text>
                            <FAIcon name={headIconName} size={25} color='#900' style={styles.TouchableOpacityTitleIcon}/>
                        </TouchableOpacity>
                        <View style = {{ height: this.state.updatedHeight, overflow: 'hidden'}}>
                            <CustomerInfo onLayout= {( value ) => this.getHeight( value.nativeEvent.layout.height )} />
                        </View>
                    </View>
                    <View style = { styles.ChildView }>
                        <TouchableOpacity activeOpacity = { 0.7 } 
                                onPress = {()=> this.expand_collapse_Function(2) } 
                                style = { styles.TouchableOpacityStyle }>
                            <FAIcon name='female' size={25} color='#900' style={styles.TouchableOpacityTitleIcon}/>
                            <Text style = { styles.TouchableOpacityTitleText}>{this.state.buttonTextVideo}</Text>
                            <FAIcon name={headVideoIconName} size={25} color='#900' style={styles.TouchableOpacityTitleIcon}/>
                        </TouchableOpacity>
                        <View style = {{ height: this.state.updatedVideoHeight, overflow: 'hidden' }}>
                            <View>
                                <TouchableOpacity activeOpacity={0.7} onPress={()=> this.manageCart()}
                                    style={{backgroundColor:'#044075', height:40, alignItems:'flex-end'}}>
                                    <Icon visible style={styles.menuIcon} name='md-cart' color='white' size={35} title='cart info'/>
                                    <Text style={styles.marktext}>{this.state.cart.selectedServices.length}</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.ExpandSubViewInsideView} display={this.state.expandVideo?'flex':'none'}>
                                <ServiceList />
                                <ListItem key='id1' title={'Total value : ' + this.state.totalValue} style={{textAlign: 'right', alignContent: 'flex-end', margin: 5, padding:4}} hideChevron={true}></ListItem>
                            </ScrollView>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={styles.ButtonContent} 
                        onPress = {() => Alert.alert('Confirmation', 'About to save billing')}>
                        <Text style = { styles.TouchableOpacityButtonTitleText}><Icon name={iconName} size={25} color="#900" style={styles.TouchableOpacityButtonTitleIcon}/> Checkout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
// <Card containerStyle={{padding: 0, width: '82%', borderWidth: 1}}>
// <ServiceList />
// </Card>

// <View style={styles.ExpandSubViewInsideView}>
// <ServiceList />
// </View>



function mapStateToProps(state, ownProps) {
    return {
        ...state
    };
}
  
function mapDispatchToProps(dispatch, ownProps) {
    return {
        actions: bindActionCreators(Object.assign({}, {getUsers}, {updateCart}), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(SalesReviewScreen));

const styles = StyleSheet.create(
{
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
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#fff',
        fontSize: 20,
        width: '90%'
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
    }
});

//jshint ignore:end