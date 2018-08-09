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
//redux
import {connect} from 'react-redux';
//import {bindActionCreators} from 'redux';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
//import Router from '../routes';
//import {AppRegistry} from 'react-native';

export class LandingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.credentials = this.props.navigation.state.params.credentials;
        this.profile = this.props.navigation.state.params.profile;
        this.state = {userlist: [{}], postlist: [{}], api: ''};
        
        //Alert.alert("Title", 'In Landing...');

        //console.log("Credentials : " + JSON.stringify(this.credentials));
        //console.log("Profile : " + JSON.stringify(this.profile));


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

    render () {
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
            </View>
        );
    }
}


function mapStateToProps(state, ownProps) {
  //console.log("mapState2Props : " + (state.currentUser) + " - " + state.currentUser.length);

  return {
      ...state
  };
}

// function mapDispatchToProps(dispatch, ownProps) {
//     return {
//         someactions: bindActionCreators(userActions, dispatch)
//     }
// }

export default connect(mapStateToProps)(LandingScreen);

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