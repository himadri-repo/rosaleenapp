//jshint esversion:6
//jshint ignore:start
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform, AsyncStorage } from 'react-native';
import {withNavigationFocus, StackActions, NavigationActions} from 'react-navigation';
//redux specific imports
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUsers} from '../../actions/userActions'

const CURRENT_CART_INFORMATION = 'current_cart_information';

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
           expand: false,
           buttonText: 'Click Here To Expand',
           cart: {}
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

    expand_collapse_Function =()=>
    {
        LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );
 
        if( this.state.expand == false )
        {
            this.setState({ 
              updatedHeight: this.state.textLayoutHeight, 
              expand: true, 
              buttonText: 'Click Here To Collapse' 
            }); 
        }
        else
        {
            this.setState({ 
              updatedHeight: 0, 
              expand: false, 
              buttonText: 'Click Here To Expand' 
            });
        }
    }
 
    getHeight(height)
    {
        this.setState({ textLayoutHeight: height });
    }
 
    render()
    {
        return(
            <View style = { styles.MainContainer }>
                <View style = { styles.ChildView }>
                    <TouchableOpacity activeOpacity = { 0.7 } 
                                      onPress = { this.expand_collapse_Function } 
                                      style = { styles.TouchableOpacityStyle }>
                        <Text style = { styles.TouchableOpacityTitleText }>{this.state.buttonText}</Text>
                    </TouchableOpacity>
                    <View style = {{ height: this.state.updatedHeight, overflow: 'hidden' }}>
                        <Text style = { styles.ExpandViewInsideText } 
                              onLayout = {( value ) => this.getHeight( value.nativeEvent.layout.height )}>
                            Hello Developers, A warm welcome on ReactNativeCode.com, The best website for react native developers.
                            You can find high quality dynamic type of tutorials with examples on my website and to support us please like our Facebook page.
                        </Text>
                    </View>
                </View>
            </View>
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
        backgroundColor: '#00BCD4'
    },

    TouchableOpacityTitleText:
    {
        textAlign: 'center',
        color: '#fff',
        fontSize: 20
    },

    ExpandViewInsideText:
    {
        fontSize: 16,
        color: '#000',
        padding: 12
    }
});

//jshint ignore:end