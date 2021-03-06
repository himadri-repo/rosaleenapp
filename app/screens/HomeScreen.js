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
  AsyncStorage,
  NetInfo,
  Dimensions,
  BackHandler
} from 'react-native';
import LoginModal from '../modals/LoginModal';
import Loader from '../components/Loader';
//import {StackActions, NavigationActions} from 'react-navigation';
import { YellowBox } from 'react-native'
import Auth0 from 'react-native-auth0';

//import configStore from '../../stores/configureStore.dev';

import * as userActions from '../../actions/userActions';
//import * as generalActions from '../../actions/generalActions';

//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);

var credentials = require('../AuthCredential');
const auth0 = new Auth0(credentials);

const { width } = Dimensions.get('window');
//const store = configStore();

const ACCESS_TOKEN = "accessToken";
const ACCESS_PROFILE = "accessProfile";

export class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
      this.isMounted = false;
      this.state = { modalVisible: false, token: '', loading: false, isConnected: true };
      this.onAuth = this.onAuth.bind(this)
    }
  
    static navigationOptions = {
      title: 'Home',
      headerLeft: false,
      header: null
    };

    handleConnectivityChange = (isConnected) => {
      if(this.isMounted) {
        this.setState({ isConnected });
      }

      console.log("Is Connected: " + isConnected);
    }

    componentDidMount = () => {
      this.isMounted = true;

      // store.subscribe(() => {
      //   let stateObject = store.getState();

      //   console.log("STATE in Subscribe: " + JSON.stringify(stateObject));
      // });
      NetInfo.isConnected.fetch().then(isConnected => {
        console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        if(this.isMounted) {
          this.setState({ isConnected });
        }
      });      

      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);

      try
      {
        let credential = this.getToken().then(cred => {
          console.log('Token in DidMount: ' + JSON.stringify(cred));
          if(cred && cred.credentials && cred.credentials.accessToken) {
            //console.log('Cred in Auto Login: ' + JSON.stringify(cred.credentials));
            if(this.isMounted) {
              this.setState({loading: true});
            }
            //this.authenticateUser(cred);
            this.realmLogin(cred);
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

    realmLogin(credInfo) {
      let username = credInfo.username;
      let password = credInfo.password;

      //this.alert("Information","Logging in ...");
      //console.log("Logging in ... " + username + ' - ' + password);
      //if(this.isMounted) {
        this.setState({loading: true});
      //}
      auth0.auth
        .passwordRealm({
            username: username,
            password: password,
            realm: 'Username-Password-Authentication',
            scope: 'openid profile email',
            audience: 'https://' + credentials.domain + '/userinfo'
        })
        .then(credentials => {
            this.authenticateUser({credentials, username, password});
        })
        .catch(error => {
            //if(this.isMounted) {
              this.setState({loading: false});
            //}
            if(error && error.json)
              this.alert('Error', error.json.error_description);
            else {
              console.log('Error: ' + error.toString());
              if(error.toString().indexOf('Network request failed')>-1 && 
                credInfo.credentials.accessToken) 
              {
                console.log('Force redirecting: ');
                this.props.actions.authorize(credInfo, this.state.profile);
                //if(this.isMounted) {
                  this.setState({loading: false});
                //}
                this.props.navigation.navigate('TabLanding', {credentials: credInfo, profile: this.state.profile});
              }
            }
        });
    }

    authenticateUser(credential) {
      try
      {
        //console.log('Pre AuthenticateUser: ' + JSON.stringify(credential));
        auth0.auth
        .userInfo({ token: credential.credentials.accessToken })
        .then(profile => {
            //this.props.onAuth(credentials, profile);
            this.props.actions.authorize(credential, profile);
            //if(this.isMounted) {
              this.setState({loading: false});
            //}
            console.log('I am changing to Dashboard');
            this.props.navigation.navigate('TabLanding', {credentials: credential, profile: profile});
            //this.props.navigation.navigate('Dashboard', {credentials: credential, profile: profile});
          })
        .catch(error => {
          //if(this.isMounted) {
            this.setState({loading: false});
          //}
          console.log ('Error : ' + error);
          Alert.alert('Error', 'Unable to auto login. Please login with your valid credential.');
        });
      }
      catch(error) {
        //if(this.isMounted) {
          this.setState({loading: false});
        //}
        console.log(error);
      }
    }

    async storeAccessToken(credential, profile) {
      try {
        await AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify({credential, profile}));
        let token = await this.getToken();
        //console.log("Token logged: " + token.toString());
      }
      catch(error) {
        console.log(error);
      }
    }

    async getToken() {
      try {
        let credential = await AsyncStorage.getItem(ACCESS_TOKEN).then(cred => {
          console.log(cred);
          cred = JSON.parse(cred);
          if(cred.credential && cred.profile)
            this.setState({credential: cred.credential, profile: cred.profile});

          return cred.credential;
        });
        return credential;
      }
      catch(error) {
        console.log(error);
      }

      return null;
    }

    async getProfile() {
      try {
        let profile = await AsyncStorage.getItem(ACCESS_TOKEN).then(cred => {
          cred = JSON.parse(cred);
          if(cred.credential && cred.profile)
            this.setState({credential: cred.credential, profile: cred.profile});
          
          return cred.profile;
        });
        return profile;
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
        console.log("credentials :: " + JSON.stringify(credentials));
        //console.log(JSON.stringify(this.props.someactions.authorize));
        //console.log("Home Action Functions: " + JSON.stringify(this.props.actions.authorize));
        AsyncStorage.removeItem(ACCESS_TOKEN).done();
        this.props.actions.authorize(credentials, profile);
        this.storeAccessToken(credentials, profile).then(value => {
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
      //const { navigate } = this.props.navigation;
      //generalActions.setNavigatorSuccess(navigate);
      const MiniOfflineSign = (props) => {
        if(!this.state.isConnected) {
          return (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineText}>No Internet Connection</Text>
            </View>
          );
        }
        else {
          return null;
        }
      };

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
            <MiniOfflineSign />
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
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    bottom: 50
  },
  offlineText: { 
    color: '#fff'
  }  
});
//jshint ignore:end