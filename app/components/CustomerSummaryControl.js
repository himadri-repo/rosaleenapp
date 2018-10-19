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

//utility methods
Date.prototype.SubtractMonth = function(numberOfMonths) {
    let dt = this;
    dt.setMonth(dt.getMonth() - numberOfMonths);
    dt.setDate(1);

    return dt;
}

Date.prototype.SubtractDays = function(numberOfDays) {
    let dt = this;
    dt.setDate(dt.getDate() - numberOfDays);
    //dt.setDate(1);

    return dt;
}
//end of utility methods

export class CustomerSummaryControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mode: 'pricereview', totalValue: this.props.TotalValue, serviceCount: 0, saleStat: {today: {totalValue: 0, cash: 0, card: 0}, month: {totalValue: 0, cash: 0, card: 0}}};
        this.getSalesByDate = this.getSalesByDate.bind(this);
        this.getDate = this.getDate.bind(this);
    }

    componentDidMount = () => {
        this.getSalesByDate(this.getDate());
    }

    componentWillReceiveProps = (newprops) => {
        //console.log('componentWillReceiveProps : ' + JSON.stringify(newprops.invoices));
        if(newprops.invoices!=null) {
            this.computeSalesState(newprops.invoices);
        }
    }

    computeSalesState(invoices) {
        if(invoices==null) return;
        let yesterdayCustomer = 0;
        let todaysCustomers = 0;
        let todayNewCustomer = 0;
        let todayRepeatCustomer = 0;
        let previousmonthsCustomer = 0;
        let monthsCustomer = 0;
        let monthsNewCustomer = 0;
        let monthsRepeatCustomer = 0;

        // let todayDate = new Date(2018, 8, 11); //hardcoded value
        // let tomorrowDate = new Date(2018, 8, 12); //hardcoded value
        // let previousDate = new Date(2018, 8, 11).SubtractDays(1);
        // let previousMonth = new Date(2018, 8, 11).SubtractMonth(1);

        let todayDate = new Date(); //hardcoded value
        let tomorrowDate = new Date().setDate(todayDate.getDate()+1);
        let previousDate = new Date().SubtractDays(1);
        let previousMonth = new Date().SubtractMonth(1);

        console.log('Today : ' + todayDate + ' == ' + tomorrowDate + ' == ' + todayDate.getDate() + ' - ' + (todayDate.getMonth()+1) + ' - ' + todayDate.getFullYear());
        console.log('Previous Day : ' + previousDate + ' == ' + previousDate.getDate() + ' - ' + (previousDate.getMonth()+1) + ' - ' + previousDate.getFullYear());
        console.log('Previous Month : ' + previousMonth + ' == ' + previousMonth.getDate() + ' - ' + (previousMonth.getMonth()+1) + ' - ' + previousMonth.getFullYear());
        let customerInvoices = {};
        console.log('Size of Invoices : ' + (invoices.length));
        for (let index = 0; index < invoices.length; index++) {
            inv = invoices[index];
            let invDate = new Date(inv.date);

            if(invDate.getMonth()==todayDate.getMonth() && 
                invDate.getFullYear()==todayDate.getFullYear()) 
            {
                customerInvoices[inv.customer.mobile] = parseInt('0'+customerInvoices[inv.customer.mobile])+1;
            }

            console.log('Inv.Date: ' + inv.date + ' <-> Value: ' + inv.totalValue + ' == ' + invDate.getDate() + ' - ' + (invDate.getMonth()+1) + ' - ' + invDate.getFullYear());
            
            //current day's customer
            if( invDate.getDate()==todayDate.getDate() && 
                invDate.getMonth()==todayDate.getMonth() && 
                invDate.getFullYear()==todayDate.getFullYear()) 
            {
                todaysCustomers += 1;
                if(customerInvoices[inv.customer.mobile]>1) {
                    todayRepeatCustomer = parseInt('0' + customerInvoices[inv.customer.mobile]);
                }
                else if(customerInvoices[inv.customer.mobile]==1) {
                    todayNewCustomer = parseInt('0' + customerInvoices[inv.customer.mobile]);
                }
            }

            //previous day's customer
            if( invDate.getDate()==previousDate.getDate() && 
                invDate.getMonth()==previousDate.getMonth() && 
                invDate.getFullYear()==previousDate.getFullYear()) 
            {
                yesterdayCustomer = parseInt('0' + customerInvoices[inv.customer.mobile]);
            }

            //month's customer
            if(invDate.getMonth()==todayDate.getMonth() && 
            invDate.getFullYear()==todayDate.getFullYear()) {
                monthsCustomer = customerInvoices[inv.customer.mobile];
                if(customerInvoices[inv.customer.mobile]>1) {
                    monthsNewCustomer = parseInt('0' + customerInvoices[inv.customer.mobile]);
                }
                else if(customerInvoices[inv.customer.mobile]>1) {
                    monthsRepeatCustomer = parseInt('0' + customerInvoices[inv.customer.mobile]);
                }
            }

            //previous month's sale
            if(invDate.getMonth()==previousMonth.getMonth() && 
            invDate.getFullYear()==previousMonth.getFullYear()) {
                previousmonthsCustomer = parseInt('0' + customerInvoices[inv.customer.mobile]);
            }
        }

        console.log('Customer stat: ' + JSON.stringify(customerInvoices));

        let dayCustomerGrowth = 0;
        let monthCustomerGrowth = 0;
        if(yesterdayCustomer>0 && todaysCustomers>0) {
            dayCustomerGrowth = Math.round(((todaysCustomers-yesterdayCustomer)/yesterdayCustomer)*100);
        }
        else if(todaysCustomers>0) {
            dayCustomerGrowth = 100;
        }
        else {
            dayCustomerGrowth = 0;
        }

        if(previousmonthsCustomer>0 && monthsCustomer>0) {
            monthCustomerGrowth = Math.round(((monthsCustomer-previousmonthsCustomer)/previousmonthsCustomer)*100); 
        }
        else if(monthsCustomer>0) {
            monthCustomerGrowth = 100;
        }
        else {
            monthCustomerGrowth = 0;
        }

        console.log(todaysCustomers + ' - ' + monthsCustomer + ' - ' + yesterdayCustomer + ' - ' + previousmonthsCustomer + ' - ' + dayCustomerGrowth + ' = ' + monthCustomerGrowth);

        this.setState(Object.assign({}, {
            saleStat: {'today': {totalValue: todaysCustomers, cash: todayNewCustomer, card: todayRepeatCustomer}, 
            yesterday: yesterdayCustomer,
            daySaleGrowth: dayCustomerGrowth,
            month: {totalValue: monthsCustomer, cash: monthsNewCustomer, card: monthsRepeatCustomer}, 
            previousmonth: previousmonthsCustomer,
            monthSaleGrowth: monthCustomerGrowth}
        }));
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
        var startDayOfMonth = (mnth+'/'+1+'/'+yr);
        var startDayOfPreviousMonth = '';
        if(mnth==1) {
            startDayOfPreviousMonth = (12+'/'+1+'/'+(yr-1));
        }
        else {
            startDayOfPreviousMonth = ((mnth-1)+'/'+1+'/'+yr);
        }
        var tomorrow = (tommnth+'/'+tomday+'/'+tomyr);

        return {
            start: startDayOfPreviousMonth,
            end: tomorrow
        }
    }

    async refresh() {
        console.log('Sale summary control refreshed ...');
        this.getSalesByDate(this.getDate());
    }

    async getSalesByDate(dateFilter) {
        console.log('Query Date :' + dateFilter.start);
        console.log('Next Query Date :' + dateFilter.end);
        //console.log('getInvoicesByQuery : ' + JSON.stringify(this.props.actions.getInvoicesByQuery));
        //this.props.actions.getInvoicesByQuery({start: dateFilter.start, end: dateFilter.end});
        //this.props.actions.getInvoicesByQuery({start: '08/01/2018', end: '10/01/2018'});
        this.props.actions.getInvoicesByQuery({end: dateFilter.end});
        console.log('getInvoicesByQuery returned value ...');
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
                                    <Text style={{flex:2,fontSize: 18, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>Today's Customer</Text>
                                    <Text style={{flex:1,fontSize: 18, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>{this.state.saleStat.today.totalValue}</Text>
                                </View>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#edeef0'}}>
                                    <Text style={{flex: 1, textAlign: 'left', fontSize: 18, color: '#000000'}}>New: {this.state.saleStat.today.cash}</Text>
                                    <Text style={{flex: 1, textAlign: 'right', fontSize: 18, color: '#000000'}}>Repeat: {this.state.saleStat.today.card}</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center', flex:1, justifyContent: 'center', flexDirection: 'row'}}>
                                <Icon style={this.state.saleStat.daySaleGrowth>0?styles.uparrow:styles.downarrow} name={this.state.saleStat.daySaleGrowth>0?'md-arrow-up':'md-arrow-down'} title="Value higher than previous month/day" size={25} onPress={ () => console.log('up arrow clicked') } />
                                <Text style={{textAlign: 'center', fontSize: 24, fontWeight:"800" ,color: '#0000ff'}}>{this.state.saleStat.daySaleGrowth}%</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'center', flex:3, flexDirection: 'row',  borderColor: '#000000', borderWidth: 1}}>
                            <View style={{alignItems: 'center',flex:3, flexDirection: 'column',  borderRightColor: '#000000', borderRightWidth: 1}}>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#87b44a'}}>
                                    <Text style={{flex:2, fontSize: 16, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>This Month's Customer</Text>
                                    <Text style={{flex:1, fontSize: 18, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>{this.state.saleStat.month.totalValue}</Text>
                                </View>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#edeef0'}}>
                                    <Text style={{flex: 1, textAlign: 'left', fontSize: 18, color: '#000000'}}>New: {this.state.saleStat.month.cash}</Text>
                                    <Text style={{flex: 1, textAlign: 'right', fontSize: 18, color: '#000000'}}>Repeat: {this.state.saleStat.month.card}</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center', flex:1, justifyContent: 'center', flexDirection: 'row'}}>
                            <Icon style={this.state.saleStat.daySaleGrowth>0?styles.uparrow:styles.downarrow} name={this.state.saleStat.daySaleGrowth>0?'md-arrow-up':'md-arrow-down'} title="Value higher than previous month/day" size={25} onPress={ () => console.log('up arrow clicked') } />
                                <Text style={{textAlign: 'center', fontSize: 24, fontWeight:"800", color: '#0000ff'}}>{this.state.saleStat.monthSaleGrowth}%</Text>
                            </View>
                        </View>
                    </View>
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

function mapDispatchToProps(dispatch, ownProps) {
    return {
        actions: bindActionCreators({getInvoicesByQuery}, dispatch),
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
    },
    uparrow: {
        color: '#00ff00', 
        marginRight: 5     
    },
    downarrow: {
        color: '#ff0000', 
        marginRight: 5     
    }
});
