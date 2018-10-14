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
import {getInvoicesByQuery} from '../../actions/invoiceActions';

export class CustomerSummaryControl extends React.PureComponent {
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

        //this.getSalesByDate(this.getDate());
    }

    //utility method can be moved to base class or utility class
    getDate() {
        var date2 = new Date();
        var date3 = new Date((Date.now()+(1*24*60*60*1000)));
        var day = date2.getDate()<=9?'0'+date2.getDate():date2.getDate();
        var tomday = date3.getDate()<=9?'0'+date3.getDate():date3.getDate();
        var mnth = date2.getMonth()+1<=9?'0'+date2.getMonth()+1:date2.getMonth()+1;
        var tommnth = date3.getMonth()+1<=9?'0'+date3.getMonth()+1:date3.getMonth()+1;
        var yr = date2.getFullYear();
        var tomyr = date3.getFullYear();
        //var today = new Date(mnth+'/'+day+'/'+yr+' 12:00 AM')
        //var tomorrow = new Date(tommnth+'/'+tomday+'/'+tomyr+' 12:00 AM')
        var today = (mnth+'/'+day+'/'+yr);
        var tomorrow = (tommnth+'/'+tomday+'/'+tomyr);

        return {
            start: today,
            end: tomorrow
        }
    }    

    async getSalesByDate(dateFilter) {
        console.log('Query Date :' + dateFilter.start);
        console.log('Next Query Date :' + dataFilter.end);
        this.props.actions.getInvoicesByQuery({start: dateFilter.start, end: dateFilter.end});
    }

    render() {
        let platform = Platform.OS === 'ios' ? 'ios' : 'md';
        return (
            <View style={{width: '100%',}}>
                <TouchableOpacity 
                    onPress = {() => {
                        console.log('Summary item clicked!!');
                    }}>
                    <View style={{flexDirection:'column', marginTop: 5, marginBottom: 5, height: 150, width: '100%', borderColor: '#000000', borderWidth: 1, borderRadius: 5,  shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 1}}>
                        <View style={{alignItems: 'center', flex:1.5, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#0000ff'}}>
                            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 20}}>Customer Card</Text>
                        </View>
                        <View style={{alignItems: 'center', flex:3, flexDirection: 'row',  borderColor: '#000000', borderWidth: 1}}>
                            <View style={{alignItems: 'center',flex:3, flexDirection: 'column',  borderRightColor: '#000000', borderRightWidth: 1}}>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#87b44a'}}>
                                    <Text style={{flex:2,fontSize: 18, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>Today's Customer Count</Text>
                                    <Text style={{flex:1,fontSize: 18, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>12</Text>
                                </View>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#edeef0'}}>
                                    <Text style={{flex: 1, textAlign: 'left', fontSize: 18, color: '#000000'}}>New: 3</Text>
                                    <Text style={{flex: 1, textAlign: 'right', fontSize: 18, color: '#000000'}}>Repeat: 9</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center', flex:1, justifyContent: 'center', flexDirection: 'row'}}>
                                <Icon style={{color: '#00ff00', marginRight: 5}} name="md-arrow-up" title="Value higher than previous month/day" size={25} onPress={ () => console.log('up arrow clicked') } />
                                <Text style={{textAlign: 'center', fontSize: 24, fontWeight:"800" ,color: '#0000ff'}}>10%</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'center', flex:3, flexDirection: 'row',  borderColor: '#000000', borderWidth: 1}}>
                            <View style={{alignItems: 'center',flex:3, flexDirection: 'column',  borderRightColor: '#000000', borderRightWidth: 1}}>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#87b44a'}}>
                                    <Text style={{flex:2, fontSize: 16, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>This Month's Customer Count</Text>
                                    <Text style={{flex:1, fontSize: 18, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>32</Text>
                                </View>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#edeef0'}}>
                                    <Text style={{flex: 1, textAlign: 'left', fontSize: 18, color: '#000000'}}>New: 7</Text>
                                    <Text style={{flex: 1, textAlign: 'right', fontSize: 18, color: '#000000'}}>Repeat: 25</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center', flex:1, justifyContent: 'center', flexDirection: 'row'}}>
                                <Icon style={{color: '#ff0000', marginRight: 5}} name="md-arrow-down" title="Value higher than previous month/day" size={25} onPress={ () => console.log('down arrow clicked') } />
                                <Text style={{textAlign: 'center', fontSize: 24, fontWeight:"800", color: '#0000ff'}}>12%</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

/*
    <Text style = {{color: '#ffffff', textAlign: 'left', textAlignVertical:'center', width: '40%', paddingLeft: 5, fontSize: 17, fontWeight: '700'}}>
        {`(${parseInt(this.state.serviceCount)}) ₹ ${parseInt(this.state.totalValue).toFixed(2)}`}</Text>
    <Text style = { styles.TouchableOpacityButtonTitleText}>
        <Icon name={iconName} size={25} color="#900" style={styles.TouchableOpacityButtonTitleIcon}/> {this.state.mode==='pricereview'? 'Customer Info': 'Checkout'}&nbsp;&nbsp;
        <Icon name='ios-arrow-forward' size={25} color="#900" style={styles.TouchableOpacityButtonTitleIcon}/>&nbsp;&nbsp;</Text>
*/

function mapStateToProps(state, ownProps) {
    if(state.invoices) {
        console.log('Invoices : ' + JSON.stringify(state.invoices));
    }

    return {
        ...state
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        actions: bindActionCreators({getInvoicesByQuery}, dispatch),
        //cartActions: bindActionCreators({updateCart}, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(CustomerSummaryControl));

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