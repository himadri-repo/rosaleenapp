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
    BackHandler
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import Auth0 from 'react-native-auth0';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

var credentials = require('../AuthCredential');
const auth0 = new Auth0(credentials);

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { viewLogin: true };
        this.realmLogin = this.realmLogin.bind(this);
        this.createUser = this.createUser.bind(this);

    }

    onSuccess(credentials) {
        //alert('success');
        auth0.auth
            .userInfo({ token: credentials.accessToken })
            .then(profile => {
                this.props.onAuth(credentials, profile);
            })
            .catch(error => this.alert('Error', error.json.error_description));
    }

    alert(title, message) {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
        );
    }

    realmLogin(username, password) {
        //this.alert("Information","Logging in ...");
        auth0.auth
            .passwordRealm({
                username: username,
                password: password,
                realm: 'Username-Password-Authentication',
                scope: 'openid profile email',
                audience: 'https://' + credentials.domain + '/userinfo'
            })
            .then(credentials => {
                this.onSuccess(credentials);
            })
            .catch(error => this.alert('Error', error.json.error_description));
    }

    createUser(username, password) {
        //this.alert('Information', 'Registering user ...');
        auth0.auth
            .createUser({
                email: username,
                username: username,
                password: password,
                connection: 'Username-Password-Authentication',
            })
            .then(success => {
                //console.log(success)
                this.alert('Success', 'New user created');
                this.realmLogin(username, password);
            })
            .catch(error => { 
                this.alert('Error', error.json.description) 
            });
    }

    webAuth(connection) {
        //this.alert("Information","Logging in ...");
        auth0.webAuth
            .authorize({
                scope: 'openid profile email',
                connection: connection,
                // redirectUri: 'http://localhost/api/authentication/callback',
                responseType: 'code',
                responseMode: 'query',
                audience: 'https://' + credentials.domain + '/userinfo',
            })
            .then(credentials => {
                this.onSuccess(credentials);
            })
            .catch(error => this.alert('Error', error.error_description));
    };

    //behavior="padding"

    render() {
        let form = null;
        let socialContainer = null;
        if (this.state.viewLogin) {
            form = <LoginForm realmLogin={this.realmLogin} />;
            socialContainer = <View style={styles.socialContainer}>
                                <TouchableHighlight onPress={() => this.webAuth('facebook')}>
                                    <Image
                                        style={styles.socialIcon}
                                        source={require('../images/facebook.png')}
                                    />
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => this.webAuth('google-oauth2')}>
                                    <Image
                                        style={styles.socialIcon}
                                        source={require('../images/google.png')}
                                    />
                                </TouchableHighlight>
                            </View>;
        } else {
            form = <SignupForm createUser={this.createUser} />;
        }
        return (
            <KeyboardAvoidingView style={styles.container}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"/>
                <View style={styles.headerContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../images/logo.png')}
                    />
                </View>
                <View style={styles.tabContainer}>
                    <Button
                        onPress={() => this.setState({viewLogin: true})}
                        title="Log In"
                    />
                    <Button
                        onPress={() => this.setState({viewLogin: false})}
                        title="Sign up"
                    />
                </View>
                {socialContainer}
                <View style={styles.formContainer}>
                    {form}
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    formContainer: {
        flex: 4,
    },
    headerContainer: {
        flex: 0.5,
        marginTop: 0,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
    },
    socialContainer: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContainer: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 1,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    title: {
        marginTop: 10,
        width: 100,
        textAlign: 'center',
        fontSize: 16
    },
    socialIcon: {
        marginTop: 10
    }
});

//jshint ignore:end