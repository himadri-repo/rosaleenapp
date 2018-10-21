/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
//jshint esversion:6
//jshint ignore:start
import React, { Component } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  Alert,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  Platform
} from 'react-native';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons'
import { YellowBox } from 'react-native'
import {withNavigationFocus, NavigationEvents} from 'react-navigation';
//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getCustomers, getCustomersByQuery} from '../../actions/customerActions';
//import {getInvoices, getInvoicesByQuery} from '../../actions/invoiceActions';
import SaleSummaryControl from '../components/SaleSummaryControl';
import CustomerSummaryControl from '../components/CustomerSummaryControl';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
//import Router from '../routes';
//import {AppRegistry} from 'react-native';

export class LandingScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.credentials = this.props.navigation.state.params.credentials;
        this.profile = this.props.navigation.state.params.profile;
        this.state = {userlist: [{}], postlist: [{}], api: '', refreshing: false, 
            refreshSalesSummary: new Date(), refreshCustomerSummary: new Date()};

        //this.props.refreshSalesSummary = new Date();
        //this.onRefresh = this.onRefresh.bind(this);

        //Alert.alert("Title", 'In Landing...');

        //console.log("Credentials : " + JSON.stringify(this.credentials));
        //console.log("Current User : " + JSON.stringify(this.props.currentUser));
        //this.props.actions.getInvoices();
        try
        {
          this.props.actions.getCustomers();
        }
        catch(e) {
          console.log(e);
        }

        // AsyncStorage.setItem('credentials', JSON.stringify(this.credentials)).then(result => {
        //   //console.log(`[credentials] Value saved to state ${result}`);
        // }).catch(reason=> {
        //   //console.log('credentials:ERROR: ' + reason);
        // });
        // AsyncStorage.setItem('profile', JSON.stringify(this.profile)).then(result => {
        //   console.log(`[profile] Value saved to state ${result}`);
        // }).catch(reason=> {
        //   //console.log('profile:ERROR: ' + reason);
        // });
        //this.itemClicked = this.itemClicked.bind(this);
    }

    componentDidMount() {
      //this.props.onRef(this);
      
      console.log(JSON.stringify(this.props.customers));
      this.state.customers = Object.assign([{}], this.props.customers);

      //console.log("Current User : " + JSON.stringify(this.props.currentUser));
    }

    onRefresh = () => {
    //onRefresh() {
      this.setState({refreshing: true});

      //this.props.actions.getServiceCategories();
      console.log('Refresh called :' + (typeof this.salesControl));
      this.setState({refreshSalesSummary: new Date()});
      this.setState({refreshCustomerSummary: new Date()});

      // if(this.salesControlRef && this.salesControlRef.current && this.salesControlRef.current.show) {
      //   this.salesControlRef.current.show();
      // }
      // else {
      //   console.log('ref of salesControl not found');
      // }
      //this.customerSummaryControl.refresh();
      
      this.setState({refreshing: false});
      // .then(() => {
      //   this.setState({refreshing: false});
      // });
    }

    render () {
        const CustList = (props) => {
          if(this.props.customers && this.props.customers.length>0) {
            console.log('true');
            return this.props.customers.map((cust, idx) => {
              return (<Text key={idx}>{cust.name}</Text>);
            });
          }
          else
          {
            console.log('false');
            return null;
          }
        };

        return (
            <View style={styles.rootcontainer}>
                <StatusBar
                translucent={false}
                animated={false}
                hidden={false}
                backgroundColor="blue"
                barStyle="light-content"/>
                <ScrollView style={{backgroundColor: '#ffffff', flex: 1}} showsHorizontalScrollIndicator={false} 
                  showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} title='Refreshing...'/>
                  }>
                  <View style={styles.container}>
                    <SaleSummaryControl style={{flex: 1}} refresh={this.state.refreshSalesSummary}/>
                    <CustomerSummaryControl style={{flex: 1}} refresh={this.state.refreshCustomerSummary}/>
                  </View>
                </ScrollView>
            </View>
        );
    }
}
// <Text>{Object.prototype.toString.apply(this.props.customers)}</Text>
// <CustomerSummaryControl style={{flex: 1}} ref={(customerummary) => this.customerSummaryControl = customerummary}/>
// <CustomerSummaryControl style={{flex: 1}} ref={(customerummary) => this.customerSummaryControl = customerummary}/>
// <CustList />

// <Text>I am landing screen ({this.props.currentUser.username}) - {this.props.currentUser.type}</Text>

function mapStateToProps(state, ownProps) {
  //console.log("mapState2Props : " + (state.currentUser) + " - " + state.currentUser.length);
  //console.log("Current User : " + JSON.stringify(state.currentUser));

  return {
      ...state
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  //console.log('mapDispatchToProps - Landing Page called');
  return {
      //actions: bindActionCreators(Object.assign({}, {getCustomers}, {getCustomersByQuery}, {getInvoices}, {getInvoicesByQuery}), dispatch)
      actions: bindActionCreators(Object.assign({}, {getCustomers}, {getCustomersByQuery}), dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(LandingScreen));

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 10,
      paddingRight: 10,
    },
    flatlist: {
      flex: 16,
      backgroundColor: '#dceaf1',
    },
    headerTitle: {
      height: 40,
      backgroundColor: '#010179',
      color: '#ffffff',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: '700',
      fontSize: 28
    },
    background: {
      flex: 1,
    },
    userlist: {
      flex: 11,
      flexDirection: "column",
      backgroundColor: '#dceaf1',
    },
    headersection: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      /*alignItems: 'center',*/
      backgroundColor: '#ffffff',
      /*borderWidth: 1,
      borderColor: '#000',*/
      borderBottomWidth: 1,
      borderBottomColor: '#cdcdcd',
    },
    header: {
      /*padding: 20,*/
      /*borderWidth: 1,
      borderColor: '#ff0000',*/
      alignItems: 'center',
      fontWeight: '400',
      fontSize: 18,
    },
    rootcontainer: {
      flex: 1,
      backgroundColor: '#fff',
      /*borderWidth: 1,
      borderColor: '#ff0000'*/
    }
  });
//jshint ignore:end