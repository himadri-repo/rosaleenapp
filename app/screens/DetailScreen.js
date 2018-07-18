//jshint ignore:start
import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import LoginModal from '../modals/LoginModal';
import {StackActions, NavigationActions} from 'react-navigation';

export default class DetailScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = { };
    }
  
    static navigationOptions = {
      title: 'Details',
      headerRight: <Button title="Logout" onPress={() => navigation.navigate('Home')} />
    };

    render() {
        const { navigate } = this.props.navigation;
        const api = this.props.navigation.state.params.api;
        const { id, name, email, username } = this.props.navigation.state.params.userinfo;
        const { userId, body } = this.props.navigation.state.params.postinfo;
        const pid = this.props.navigation.state.params.postinfo.id;
        const pname = this.props.navigation.state.params.postinfo.name;

        let content = null;

        if(api==="post") {  
            content =   <View style={styles.contentsection}>
                            <View style={styles.contenttop}>
                                <Text style={styles.fieldtitle}>Post Title </Text><Text style={styles.fieldvalue}>{pname} ({pid})</Text>
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.fieldvalue}>{body}</Text>
                            </View>
                        </View>
        }
        else if(api==="user") {
            content =   <View style={styles.contentsection}>
                            <View style={styles.contenttop}>
                                <Text style={styles.fieldtitle}>Name </Text><Text style={styles.fieldvalue}>{username} ({id})</Text>
                            </View>
                            <View style={styles.contenttop}>
                                <Text style={styles.fieldtitle}>Email </Text><Text style={styles.fieldvalue}>{email}</Text>
                            </View>
                        </View>
        }

        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"/>
                {content}
            </View>
        );
    }
}

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        /*alignItems: 'left',
        justifyContent: 'center'*/
    },
    contentsection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#cdcdcd',
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
        borderRadius: 5,
    },
    contenttop: {
        height: 50,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#cdcdcd',
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
        borderRadius: 5,
    },
    fieldtitle: {
        /*flex: 2,*/
        width: 100,
        fontSize: 18,
        textAlign: 'left',
        textAlignVertical: 'top',
        color: '#ffffff',
        backgroundColor: '#05599a',
        padding: 5
    },
    fieldvalue: {
        flex: 5,
        fontSize: 16,
        textAlign: 'left',
        textAlignVertical: 'top',
        backgroundColor: '#ffffff',
        color: '#05599a',
        padding: 5,
    },
    headerContainer: {
        flex: 1,
        marginTop: 0,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
    },
    text: {
        fontStyle: 'normal',
        fontSize: 18,
        marginLeft: 10,
        marginTop: 20,
        marginRight: 10
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