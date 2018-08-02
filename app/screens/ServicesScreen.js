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
import {withNavigationFocus, StackActions, NavigationActions} from 'react-navigation';
//redux specific imports
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

export class ServiceScreen extends React.Component {

    constructor(props) {
      super(props);
  
      //this.credentials = AsyncStorage.getItem('credentials').done();
      //this.profile = AsyncStorage.getItem('profile').done();
  
      //Alert.alert("Title", 'Hi am in Profile');
  
      /*this.credentials = this.props.navigation.state.params.credentials;
      this.profile = this.props.navigation.state.params.profile;*/
      this.profile = {name: '', picture: ''};
      this.state = {userlist: [{}], postlist: [{}], api: ''};
      this.state.category = {};
      if(this.props.navigation.state.params) {
        this.state.category = this.props.navigation.state.params.serviceCategory.name;
      }
      
      //console.log("Services : " + JSON.stringify(this.props));
  
      //this.itemClicked = this.itemClicked.bind(this);
    }

    componentWillUnmount() {
      console.log("\nServiceScreen unmounting ...");
    }
  
    static navigationOptions = ({ navigation }) => ({
        title: `Services (${navigation.state.params.serviceCategory.name})`,
        /*headerRight: <Button title="Logout" onPress={() => navigation.navigate('Home')} />*/
    });

    render() {
        let titleSection = null;

        //console.log("\nFocused [Service]: " + JSON.stringify(this.props));
        //console.log("\nNavigation : " + this.props.isFocused);
        if(!this.props.isFocused) {
          return null;
        }
        // else {
        //   //StackActions.reset({index: 0, })
        //   this.props.navigation.dispatch(resetAction);
        // }

        return (
            <View style={styles.rootcontainer}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"/>
                <Text>Service Screen</Text>
            </View>
        );
    }
}

function mapStateToProps(state, ownProps) {
  return {
      ...state
  };
}

// function mapDispatchToProps(dispatch, ownProps) {
//   return {
//       actions: bindActionCreators(getServiceCategories, dispatch)
//   }
// }

export default connect(mapStateToProps)(withNavigationFocus(ServiceScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
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
    padding: 10,
    /*borderWidth: 1,
    borderColor: '#ff0000'*/
  }
});

//jshint ignore:end