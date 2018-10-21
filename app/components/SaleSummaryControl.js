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


export class SaleSummaryControl extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { mode: 'pricereview', totalValue: this.props.TotalValue, serviceCount: 0, saleStat: {today: {totalValue: 0, cash: 0, card: 0}, month: {totalValue: 0, cash: 0, card: 0}}};
        this.getSalesByDate = this.getSalesByDate.bind(this);
        this.getDate = this.getDate.bind(this);
        this.refresh = this.refresh.bind(this);
        this.show = this.show.bind(this);
        this.invoiceUpdated = false;
    }

    componentDidMount = () => {
        this.getSalesByDate(this.getDate());
    }

    
    componentWillReceiveProps = (newprops) => {
        //console.log('componentWillReceiveProps : ' + JSON.stringify(newprops.invoices));
        if(newprops.refresh!==this.props.refresh) {
            this.getSalesByDate(this.getDate());
            this.invoiceUpdated = false;
            console.log('Refreshing sales summary ....');
        }

        if(newprops.invoices!=null && newprops.invoices.length>0 && !this.invoiceUpdated) {
            this.computeSalesState(newprops.invoices);
            this.invoiceUpdated = true;
        }
    }

    // shouldComponentUpdate = (newProps, newState) => {
    //     //console.log(newProps, newState);
    //     //console.log('Invoices : ' + JSON.stringify(newState.invoices) + ' - ' + (newState.invoices!=null));

    //     return newState.invoices!=null;
    // }

    computeSalesState(invoices) {
        if(invoices==null) return;
        let yesterdaySale = 0.0;
        let todaysSale = 0.0;
        let todayCashSale = 0.0;
        let todayCardSale = 0.0;
        let previousmonthsSale = 0.0;
        let monthsSale = 0.0;
        let monthsCashSale = 0.0;
        let monthsCardSale = 0.0;

        // let todayDate = new Date(2018, 8, 11); //hardcoded value
        // let previousDate = new Date(2018, 8, 11).SubtractDays(1);
        // let previousMonth = new Date(2018, 8, 11).SubtractMonth(1);
        
        let todayDate = new Date(); //hardcoded value
        let previousDate = new Date().SubtractDays(1);
        let previousMonth = new Date().SubtractMonth(1);

        console.log('Today : ' + todayDate + ' == ' + todayDate.getDate() + ' - ' + (todayDate.getMonth()+1) + ' - ' + todayDate.getFullYear());
        console.log('Previous Day : ' + previousDate + ' == ' + previousDate.getDate() + ' - ' + (previousDate.getMonth()+1) + ' - ' + previousDate.getFullYear());
        console.log('Previous Month : ' + previousMonth + ' == ' + previousMonth.getDate() + ' - ' + (previousMonth.getMonth()+1) + ' - ' + previousMonth.getFullYear());

        //console.log('computeSalesState: ' + (JSON.stringify(invoices)));
        for (let index = 0; index < invoices.length; index++) {
            inv = invoices[index];
            let invDate = new Date(inv.date);

            console.log('Inv.Date: ' + inv.date + ' <-> Value: ' + inv.totalValue + ' == ' + invDate.getDate() + ' - ' + (invDate.getMonth()+1) + ' - ' + invDate.getFullYear());
            
            //current day's sale
            if( invDate.getDate()==todayDate.getDate() && 
                invDate.getMonth()==todayDate.getMonth() && 
                invDate.getFullYear()==todayDate.getFullYear()) 
            {
                todaysSale += parseFloat(inv.totalValue);
                if(inv.paymentMethod=='Cash') {
                    todayCashSale += parseFloat(inv.totalValue);
                }
                else if(inv.paymentMethod=='Card') {
                    todayCardSale += parseFloat(inv.totalValue);                   
                }
            }

            //previous day's sale
            if( invDate.getDate()==previousDate.getDate() && 
                invDate.getMonth()==previousDate.getMonth() && 
                invDate.getFullYear()==previousDate.getFullYear()) 
            {
                yesterdaySale += parseFloat(inv.totalValue);
            }

            //month's sale
            if(invDate.getMonth()==todayDate.getMonth() && 
            invDate.getFullYear()==todayDate.getFullYear()) {
                monthsSale += parseFloat(inv.totalValue);
                if(inv.paymentMethod=='Cash') {
                    monthsCashSale += parseFloat(inv.totalValue);
                }
                else if(inv.paymentMethod=='Card') {
                    monthsCardSale += parseFloat(inv.totalValue);
                }
            }

            //previous month's sale
            if(invDate.getMonth()==previousMonth.getMonth() && 
            invDate.getFullYear()==previousMonth.getFullYear()) {
                previousmonthsSale += parseFloat(inv.totalValue);
            }
        }

        let daySaleGrowth = 0;
        let monthSaleGrowth = 0;
        if(yesterdaySale>0 && todaysSale>0) {
            daySaleGrowth = Math.round(((todaysSale-yesterdaySale)/yesterdaySale)*100);
        }
        else if(todaysSale>0) {
            daySaleGrowth = 100;
        }
        else {
            daySaleGrowth = 0;
        }

        if(previousmonthsSale>0 && monthsSale>0) {
            monthSaleGrowth = Math.round(((monthsSale-previousmonthsSale)/previousmonthsSale)*100); 
        }
        else if(monthsSale>0) {
            monthSaleGrowth = 100;
        }
        else {
            monthSaleGrowth = 0;
        }

        console.log(todaysSale + ' - ' + monthsSale + ' - ' + yesterdaySale + ' - ' + previousmonthsSale + ' - ' + daySaleGrowth + ' = ' + monthSaleGrowth);

        this.setState(Object.assign({}, {
            saleStat: {'today': {totalValue: todaysSale, cash: todayCashSale, card: todayCardSale}, 
            yesterday: yesterdaySale,
            daySaleGrowth: daySaleGrowth,
            month: {totalValue: monthsSale, cash: monthsCashSale, card: monthsCardSale}, 
            previousmonth: previousmonthsSale,
            monthSaleGrowth: monthSaleGrowth}
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

    show = () => {
        console.log('I am show of SalesSummaryControl');
    }

    async refresh() {
        this.invoiceUpdated = false;
        console.log('Sale summary control refreshed ...');
        this.getSalesByDate(this.getDate());
    }

    async getSalesByDate(dateFilter) {
        console.log('Query Date :' + dateFilter.start);
        console.log('Next Query Date :' + dateFilter.end);
        //console.log('getInvoicesByQuery : ' + JSON.stringify(this.props.actions.getInvoicesByQuery));
        this.props.actions.getInvoicesByQuery({start: dateFilter.start, end: dateFilter.end});
        //this.props.actions.getInvoicesByQuery({start: '08/01/2018', end: '10/01/2018'});
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
                            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 20}}>Sales Card</Text>
                        </View>
                        <View style={{alignItems: 'center', flex:3, flexDirection: 'row',  borderColor: '#000000', borderWidth: 1}}>
                            <View style={{alignItems: 'center',flex:3, flexDirection: 'column',  borderRightColor: '#000000', borderRightWidth: 1}}>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#87b44a'}}>
                                    <Text style={{flex:2,fontSize: 18, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>Today's Sale</Text>
                                    <Text style={{flex:1,fontSize: 18, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>{this.state.saleStat.today.totalValue}</Text>
                                </View>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#edeef0'}}>
                                    <Text style={{flex: 1, textAlign: 'left', fontSize: 18, color: '#000000'}}>Cash: {this.state.saleStat.today.cash}</Text>
                                    <Text style={{flex: 1, textAlign: 'right', fontSize: 18, color: '#000000'}}>Card: {this.state.saleStat.today.card}</Text>
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
                                    <Text style={{flex:2, fontSize: 16, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>This Month's</Text>
                                    <Text style={{flex:1, fontSize: 18, textAlignVertical: 'center', fontFamily: 'Georgia,"Times New Roman",Times,serif', color: '#ffffff'}}>{this.state.saleStat.month.totalValue}</Text>
                                </View>
                                <View style={{alignItems: 'flex-start', padding: 5, flex:1, flexDirection: 'row', backgroundColor: '#edeef0'}}>
                                    <Text style={{flex: 1, textAlign: 'left', fontSize: 18, color: '#000000'}}>Cash: {this.state.saleStat.month.cash}</Text>
                                    <Text style={{flex: 1, textAlign: 'right', fontSize: 18, color: '#000000'}}>Card: {this.state.saleStat.month.card}</Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'center', flex:1, justifyContent: 'center', flexDirection: 'row'}}>
                                <Icon style={this.state.saleStat.monthSaleGrowth>0?styles.uparrow:styles.downarrow} name={this.state.saleStat.monthSaleGrowth>0?'md-arrow-up':'md-arrow-down'} title="Value higher than previous month/day" size={25} onPress={ () => console.log('up arrow clicked') } />
                                <Text style={{textAlign: 'center', fontSize: 24, fontWeight:"800", color: '#0000ff'}}>{this.state.saleStat.monthSaleGrowth}%</Text>
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

<Icon style={{color: '#ff0000', marginRight: 5}} name="md-arrow-down" title="Value higher than previous month/day" size={25} onPress={ () => console.log('down arrow clicked') } />

*/

function mapStateToProps(state, ownProps) {
    // if(state.invoices) {
    //     console.log('Invoices (111) : ' + JSON.stringify(state.invoices));
    // }

    return {
        ...state
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    //console.log('mapDispatchToProps - SaleSummaryControl called');
    return {
        actions: bindActionCreators({getInvoicesByQuery}, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(SaleSummaryControl));

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