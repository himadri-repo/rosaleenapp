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
  Alert,
  AsyncStorage
} from 'react-native';
import LoginModal from '../modals/LoginModal';
import Loader from '../components/Loader';
//import {StackActions, NavigationActions} from 'react-navigation';
import { YellowBox } from 'react-native'
import Auth0 from 'react-native-auth0';

//import configStore from '../../stores/configureStore.dev';

import * as userActions from '../../actions/userActions';

//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);

var credentials = require('../AuthCredential');
const auth0 = new Auth0(credentials);

//const store = configStore();

const ACCESS_TOKEN = "accessToken";

export class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.isMounted = false;
      this.state = { modalVisible: false, token: '', loading: false };
      this.onAuth = this.onAuth.bind(this)
    }
  
    static navigationOptions = {
      title: 'Home',
      headerLeft: false,
      header: null
    };

    componentDidMount = () => {
      this.isMounted = true;

      // store.subscribe(() => {
      //   let stateObject = store.getState();

      //   console.log("STATE in Subscribe: " + JSON.stringify(stateObject));
      // });
      try
      {
        let credential = this.getToken().then(cred => {
          //console.log('Token in DidMount: ' + JSON.stringify(cred));
          if(cred && cred.accessToken) {
            //console.log('Token in Auto Login: ' + JSON.stringify(cred.accessToken));
            this.setState({loading: true});
            this.authenticateUser(cred);
          }
        });
      }
      catch(error) {
        console.log(error);
      }
    };
    
    componentWillUnmount() {
      this.isMounted = false;
    }

    authenticateUser(credential) {
      try
      {
        //console.log('Token in AuthenticateUser: ' + credential.accessToken);
        auth0.auth
        .userInfo({ token: credential.accessToken })
        .then(profile => {
            //this.props.onAuth(credentials, profile);
            this.props.actions.authorize(credential, profile);
            this.setState({loading: false});
            this.props.navigation.navigate('TabLanding', {credentials: credential, profile: profile});
          })
        .catch(error => {
          this.setState({loading: false});
          Alert.alert('Error', JSON.stringify(error));
        });
      }
      catch(error) {
        this.setState({loading: false});
        console.log(error);
      }
    }

    async storeAccessToken(credential) {
      try {
        await AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify(credential));
        let token = await this.getToken();
        //console.log("Token logged: " + token.toString());
      }
      catch(error) {
        console.log(error);
      }
    }

    async getToken() {
      try {
        let credential = await AsyncStorage.getItem(ACCESS_TOKEN).then(cred => JSON.parse(cred));

        // if(credential)
        //   console.log("Token logged (getToken): " + credential.accessToken);

        return credential;
      }
      catch(error) {
        console.log(error);
      }

      return null;
    }

    onAuth = (credentials, profile) => {
      //Alert.alert('Title', credentials);
      //this.props.actions.authorize(credentials);

      try
      {
        //console.log("credentials :: " + JSON.stringify(credentials));
        //console.log(JSON.stringify(this.props.someactions.authorize));
        //console.log("Home Action Functions: " + JSON.stringify(this.props.actions.authorize));
        AsyncStorage.removeItem(ACCESS_TOKEN).done();
        this.props.actions.authorize(credentials, profile);
        this.storeAccessToken(credentials).then(value => {
          //console.log('data stored locally : ' + JSON.stringify(credentials));
          this.props.navigation.navigate('TabLanding', {credentials: credentials, profile: profile});
        });
      }
      catch(e) {
        console.log(e);
      }
      // if(this.isMounted) {
      //   // this.setState({modalVisible: false}, () => 
      //   //   this.props.navigation.navigate('TabLanding', {credentials: credentials, profile: profile})
      //   // );
      // }
      // else {
      //   this.props.navigation.navigate('TabLanding', {credentials: credentials, profile: profile});
      // }
      //this.props.navigation.navigate('Landing', {credentials: credentials, profile: profile}) )
      //this.props.navigation.navigate('Profile', {credentials: credentials, profile: profile}) )
      //this.props.navigation.navigate('HomeAfterLogin', {credentials: credentials, profile: profile}) )

    };

    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.headContainer}>
          <StatusBar
            backgroundColor="blue"
            barStyle="light-content"/>
          <Loader loading={this.state.loading} />
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

function mapStateToProps(state, ownProps) {
  return {
    ...state
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

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