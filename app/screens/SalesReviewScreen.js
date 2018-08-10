//jshint esversion:6
//jshint ignore:start
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform, AsyncStorage, Alert, ScrollView, Picker } from 'react-native';
import {withNavigationFocus, StackActions, NavigationActions} from 'react-navigation';
//redux specific imports
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUsers} from '../../actions/userActions'
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

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
           updatedHeight: 0, 
           updatedVideoHeight: 0, 
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
        })
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
                  updatedHeight: 340, //this.state.textLayoutHeight, 
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
                  updatedVideoHeight: 300, /*this.state.textLayoutHeight,*/ 
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
 
    getHeight(height)
    {
        //console.log('Height => ' + height);
        height = CUSTOMERSECTION_HEIGHT;
        this.setState({ textLayoutHeight: height });
    }

    changePaymentMethod(paymentMethod) {
        console.log('Payment Method: ' + paymentMethod);
        this.setState({cart: {paymentMethod: paymentMethod}});
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
                <TouchableOpacity activeOpacity={0.7} style={styles.ButtonContent} 
                    onPress = {() => Alert.alert('Confirmation', 'Proceed to purchase >>')}>
                    <Text style = { styles.TouchableOpacityButtonTitleText}><Icon name={iconName} size={25} color="#900" style={styles.TouchableOpacityButtonTitleIcon}/> Checkout</Text>
                </TouchableOpacity>
            </View>
        );

        const ServiceList = () => {
            //console.log(JSON.stringify(this.props.navigation.state.params.cart.selectedServices));
            return this.props.navigation.state.params.cart.selectedServices.map(srv=> {
                return (<Text key={'txt-' + srv.id}>{srv.name}</Text>);
            });
        }
        //, height:30, width: 30
        //styles.TouchableOpacityStyle && 
        // <CustomerInfo onLayout = {( value ) => this.getHeight( value.nativeEvent.layout.height )}/>
        // <Text style = { styles.ExpandViewInsideText } 
        //         onLayout = {( value ) => this.getHeight( value.nativeEvent.layout.height )}>
        //     This is another collapsible section, where we can put apply cupon etc into it. We can also show user the 
        //     billing information and total amount to be paid. We can capture mode of payment also here.
        // </Text>
        // || {flex:1, justifyContent:'flex-start', marginRight:5}

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
                            <View style={styles.ExpandSubViewInsideView}>
                                <ServiceList />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        ...state
    };
}
  
function mapDispatchToProps(dispatch, ownProps) {
    return {
        actions: bindActionCreators({getUsers}, dispatch)
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
        borderWidth: 1,
    },

    ChildView:
    {
        borderWidth: 1,
        borderColor: '#00BCD4',
        margin: 5
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
        padding: 6,
        /*borderWidth: 1,*/
    },
    ButtonContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0000ff',
        justifyContent: 'center',
        alignItems: 'center',
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
    }
});

//jshint ignore:end