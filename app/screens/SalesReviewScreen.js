//jshint esversion:6
//jshint ignore:start
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform, AsyncStorage, Alert, ScrollView } from 'react-native';
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
           buttonTextVideo: 'Click Here To Expand',
           cart: {},
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
        /*headerRight: <Button title="Logout" onPress={() => navigation.navigate('Home')} />*/
    });

    expand_collapse_Function =(item)=>
    {
        LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );
 
        if(item==1) {
            if( this.state.expand == false )
            {
                this.setState({ 
                  updatedHeight: this.state.textLayoutHeight, 
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
                this.setState({ 
                  updatedVideoHeight: this.state.textLayoutHeight, 
                  expandVideo: true, 
                  buttonTextVideo: 'Click Here To Collapse'
                }); 
            }
            else
            {
                this.setState({ 
                  updatedVideoHeight: 0, 
                  expandVideo: false, 
                  buttonTextVideo: 'Click Here To Expand'
                });
            }        
        }
    }
 
    getHeight(height)
    {
        console.log('Height => ' + height);
        height = CUSTOMERSECTION_HEIGHT;
        this.setState({ textLayoutHeight: height });
    }
 
    render()
    {
        let platform = Platform.OS === 'ios' ? 'ios' : 'md';
        let iconName = `${platform}-checkmark`;
        let headIconName = this.state.expand?'angle-double-up':'angle-double-down';
        const CustomerInfo = (props) => (
            <View style={styles.ExpandSubViewInsideView}>
                <ScrollView>
                    <FormLabel>Mobile</FormLabel>
                    <FormInput onChangeText={(input) => Alert.alert('Confirmation', input)} placeholder='Enter mobile number' keyboardType='phone-pad'></FormInput>
                    <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                    <FormLabel>Name</FormLabel>
                    <FormInput onChangeText={(input) => Alert.alert('Confirmation', input)} placeholder='Enter name' keyboardType='default'></FormInput>
                </ScrollView>
                <TouchableOpacity activeOpacity={0.7} style={styles.ButtonContent} 
                    onPress = {() => Alert.alert('Confirmation', 'Proceed to purchase >>')}>
                    <Text style = { styles.TouchableOpacityButtonTitleText}><Icon name={iconName} size={25} color="#900" style={styles.TouchableOpacityButtonTitleIcon}/> Checkout</Text>
                </TouchableOpacity>
            </View>
        );
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
                            <Text style = { styles.TouchableOpacityTitleText }>{this.state.buttonTextVideo}</Text>
                        </TouchableOpacity>
                        <View style = {{ height: this.state.updatedVideoHeight, overflow: 'hidden' }}>
                            <Text style = { styles.ExpandViewInsideText } 
                                onLayout = {( value ) => this.getHeight( value.nativeEvent.layout.height )}>
                                This is another collapsible section, where we can put apply cupon etc into it. We can also show user the 
                                billing information and total amount to be paid. We can capture mode of payment also here.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

// <Text style = { styles.ExpandViewInsideText } 
// onLayout = {( value ) => this.getHeight( value.nativeEvent.layout.height )}>
// Hello Developers, A warm welcome on ReactNativeCode.com, The best website for react native developers.
// You can find high quality dynamic type of tutorials with examples on my website and to support us please like our Facebook page.
// </Text>

// <TouchableOpacity activeOpacity = { 0.7 } 
// onPress = {()=> this.expand_collapse_Function(2) } 
// style = { styles.TouchableOpacityStyle }>
// <Text style = { styles.TouchableOpacityTitleText }>{this.state.buttonTextVideo}</Text>
// </TouchableOpacity>
// <View style = {{ height: this.state.updatedVideoHeight, overflow: 'hidden' }}>
// <Video source={{uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'}}
//     ref={(ref)=>{this.player=ref}} style={styles.ExpandViewInsideVideo}
//     onLayout = {( value ) => this.getHeight( value.nativeEvent.layout.height )}/>
// </View>


// <Video
// source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
// style={styles.ExpandViewInsideVideo}/>

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
    MainContainer:
    {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
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
        width: '85%'
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
        padding: 12
    },
    ButtonContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0000ff',
        justifyContent: 'center',
        alignItems: 'center',
        /*padding: 10,*/
    }
});

//jshint ignore:end