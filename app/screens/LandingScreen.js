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
  AsyncStorage
} from 'react-native';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons'
import { YellowBox } from 'react-native'
import {withNavigationFocus} from 'react-navigation';
//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getCustomers, getCustomersByQuery} from '../../actions/customerActions';
import {getInvoices, getInvoicesByQuery} from '../../actions/invoiceActions';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
//import Router from '../routes';
//import {AppRegistry} from 'react-native';

export class LandingScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.credentials = this.props.navigation.state.params.credentials;
        this.profile = this.props.navigation.state.params.profile;
        this.state = {userlist: [{}], postlist: [{}], api: ''};
        
        //Alert.alert("Title", 'In Landing...');

        //console.log("Credentials : " + JSON.stringify(this.credentials));
        //console.log("Profile : " + JSON.stringify(this.profile));
        //this.props.actions.getInvoices();
        this.props.actions.getCustomers();

        AsyncStorage.setItem('credentials', JSON.stringify(this.credentials)).then(result => {
          //console.log(`[credentials] Value saved to state ${result}`);
        }).catch(reason=> {
          //console.log('credentials:ERROR: ' + reason);
        });
        AsyncStorage.setItem('profile', JSON.stringify(this.profile)).then(result => {
          //console.log(`[profile] Value saved to state ${result}`);
        }).catch(reason=> {
          //console.log('profile:ERROR: ' + reason);
        });
        //this.itemClicked = this.itemClicked.bind(this);
    }

    componentDidMount() {
      console.log(JSON.stringify(this.props.customers));
      this.state.customers = Object.assign([{}], this.props.customers);
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
                <View style={styles.container}>
                    <Text>I am landing screen ({this.props.currentUser.username}) - {this.props.currentUser.type}</Text>
                </View>
                <CustList />
            </View>
        );
    }
}
// <Text>{Object.prototype.toString.apply(this.props.customers)}</Text>

function mapStateToProps(state, ownProps) {
  //console.log("mapState2Props : " + (state.currentUser) + " - " + state.currentUser.length);

  return {
      ...state
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
      actions: bindActionCreators(Object.assign({}, {getCustomers}, {getCustomersByQuery}, {getInvoices}, {getInvoicesByQuery}), dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(LandingScreen));

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
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