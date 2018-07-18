//jshint ignore:start
import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import LoginModal from '../modals/LoginModal';
import {StackActions, NavigationActions} from 'react-navigation';

export default class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = { modalVisible: false };
      this.onAuth = this.onAuth.bind(this)
    }
  
    static navigationOptions = {
      title: 'Home',
      headerLeft: false,
      header: null
    };

    onAuth = (credentials, profile) => {
      //Alert.alert('Title', credentials);
      this.setState({modalVisible: false}, () => 
      //this.props.navigation.navigate('Landing', {credentials: credentials, profile: profile}) )
      //this.props.navigation.navigate('Profile', {credentials: credentials, profile: profile}) )
      //this.props.navigation.navigate('HomeAfterLogin', {credentials: credentials, profile: profile}) )
      this.props.navigation.navigate('TabLanding', {credentials: credentials, profile: profile}) )
    };

    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.headContainer}>
          <StatusBar
            backgroundColor="blue"
            barStyle="light-content"/>
          <ImageBackground source={require('../images/bg1.png')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Image style={styles.logo} source={require('../images/logo.png')}/>
                <Text style={styles.text}>
                  Rosaleen Ladies Beauty Parlour is a renowned parlour in South Kolkata, West Bengal. Here you will have ample encouragement to pamper your beauty. Rosaleen will help you to discover the beauty within. It is best rated ladies beauty parlour on Jadavpur Area of South Kolkata.
                </Text>
                <Text style={styles.title}>
                  -:: Services ::-
                </Text>
            </View>
            <View style={styles.services}>
              <View style={styles.servicecart}>
                <Text style={styles.serviceItem}>{'\u2023 Bridal Makeup'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Party Makeup'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Facial'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Hair Cut'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Hair SPA'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Hair Straightening'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Highlight'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Global Hair Color'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Hair Curling'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Oil Massage'}</Text>
              </View>
              <View style={styles.servicecart}>
                <Text style={styles.serviceItem}>{'\u2023 D-TAN'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Clean-up'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Bleach'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Pedicure'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Manicure'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Waxing'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Threading'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Hair styling'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Shampoo'}</Text>
                <Text style={styles.serviceItem}>{'\u2023 Blow Dryer'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button}
              onPress={() => this.setState({modalVisible: true})}>
              <Text style={styles.buttontext}>LOG IN</Text>
            </TouchableOpacity> 
            <LoginModal modalVisible={this.state.modalVisible} onAuth={this.onAuth}/>
          </ImageBackground>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    servicecart: {
      flex: 1,
      flexDirection: 'column',
    },
    title: {
      fontStyle: 'normal',
      fontSize: 24,
      marginLeft: 10,
      marginTop: 10,
      marginRight: 10,
      color: '#e40995'
    },
    services: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'rgba(0,0,0,0)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 10,
    },
    serviceItem: {
      fontStyle: 'normal',
      fontSize: 18,
      marginLeft: 10,
      marginTop: 10,
      marginRight: 10,
      color: '#2424de',
      /*borderWidth: 2,
      borderColor: '#ff0000'*/
    },
    headContainer: {
      flex: 1,
      backgroundColor: '#ffffff'
    },
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      /*alignItems: 'left',
      justifyContent: 'center'*/
      width: null,
      height:null,
      /*opacity: .2,*/
      /*resizeMode: 'center'*/
    },
    headerContainer: {
      flex: .7,
      marginTop: 0,
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0)', //#ffffff
      justifyContent: 'flex-start',
      paddingTop: 10,
    },
    text: {
      fontStyle: 'normal',
      fontSize: 18,
      marginLeft: 10,
      marginTop: 10,
      marginRight: 10,
      color: '#2424de'
    },
    button: {
      marginTop: 10,
      height: 50,
      borderWidth: 1,
      borderColor: '#cdcdcd',
      alignItems: 'center',
      backgroundColor: '#2424de',
      justifyContent: 'center',
    },
    buttontext: {
      color: '#ffffff',
      fontWeight: '700',
    },
    logo: {
      marginTop: 0,
      paddingBottom: 10,
    }
  });
  //jshint ignore:end