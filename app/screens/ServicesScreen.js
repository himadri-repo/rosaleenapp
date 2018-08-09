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
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons'
import {withNavigationFocus, StackActions, NavigationActions} from 'react-navigation';
//redux specific imports
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUsers} from '../../actions/userActions'

export class ServiceScreen extends React.Component {

    constructor(props) {
      super(props);
  
      //this.credentials = AsyncStorage.getItem('credentials').done();
      //this.profile = AsyncStorage.getItem('profile').done();
  
      //Alert.alert("Title", 'Hi am in Profile');
  
      /*this.credentials = this.props.navigation.state.params.credentials;
      this.profile = this.props.navigation.state.params.profile;*/
      this.profile = {name: '', picture: ''};
      this.state = {userlist: [{}], postlist: [{}], api: '', refreshing: false};

      this.state.userlist = Object.assign([{}], this.props.users);

      this.state.category = {};
      if(this.props.navigation.state.params) {
        this.state.category = this.props.navigation.state.params.serviceCategory.name;
      }
      
      //console.log("Services [users]: " + JSON.stringify(this.state.userlist));
      //console.log("\n\nServices [users]: " + JSON.stringify(this.props));
  
      //this.itemClicked = this.itemClicked.bind(this);
    }

    componentWillUnmount() {
      console.log("\nServiceScreen unmounting ...");
    }
  
    static navigationOptions = ({ navigation }) => ({
        title: `Services (${navigation.state.params.serviceCategory.name})`,
        /*headerRight: <Button title="Logout" onPress={() => navigation.navigate('Home')} />*/
    });

    pressItem(user) { 
      console.log(`\nuser clicked : ${user.username}`);
    }

    onRefresh = () => {
      this.setState({refreshing: true});
      this.props.actions.getUsers();
      this.setState({refreshing: false});
    }

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
        // const Row = (props) => (
        //   <TouchableOpacity style={styles.gridItem} onPress={()=> this.pressItem(props.item)}>
        //     <View style={styles.listitemcontainer}>
        //       {console.log(JSON.stringify(props))}
        //       <Image source={require('../images/jaya1.jpg')} style={styles.listitemphoto} />
        //       <Text style={styles.listitemtext}>
        //         {`${props.item.username}`}
        //       </Text>
        //     </View>
        //   </TouchableOpacity>
        // );

        return (
            <View style={styles.rootcontainer}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"/>
                <Text style={styles.headerTitle}>Technicians</Text>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} title='Refreshing ...'/>
                  } style={styles.listcontainer}>
                  {
                    this.state.userlist.filter(user => !user.isowner && user.active).map((usr, idx) => (
                      <ListItem key={'li' + idx} roundAvatar avatar={{uri: usr.profilepic}} 
                        title={usr.username} subtitle={usr.speciality}
                        onPress={() => this.props.navigation.navigate('ServiceItemsTabLanding', {technician: usr.id, name: usr.username, serviceCategory: this.props.navigation.state.params.serviceCategory})}/>
                    ))
                  }                  
                </ScrollView>
            </View>
        );
    }
}

/*
  <FlatList
  style={styles.listcontainer}
  data={this.state.userlist.filter(user => !user.isowner && user.active)}
  renderItem={(item) => <Row {...item}/>}
  keyExtractor={(item, index) => 'li-' + index}/>
*/

function mapStateToProps(state, ownProps) {
  //console.log('cart [Services] : ' + JSON.stringify(state.cart));
  return {
      ...state
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
      actions: bindActionCreators({getUsers}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(ServiceScreen));

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
    height: 35,
    backgroundColor: '#2424de',
    color: '#ffffff',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontWeight: '600',
    fontSize: 22,
    padding: 0,
    paddingLeft: 10,
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
    /*padding: 10,*/
    /*borderWidth: 1,
    borderColor: '#ff0000'*/
  },
  listcontainer: {
    flex: 1,
    marginTop: 10,
    padding: 10,
  },
  listitem: {
    /*borderWidth: 0,
    backgroundColor: '#cdcdcd',*/
    padding: 5
  },
  /* list item style */
  listitemcontainer: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  listitemtext: {
    marginLeft: 12,
    fontSize: 16,
    justifyContent: 'center'
  },
  listitemphoto: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  gridItem: {
    margin:5,
    //width: 100, //150,
    height: 100, //150,
    /*justifyContent: 'center',
    alignItems: 'center',*/
    borderBottomWidth: 1,
    borderBottomColor: '#0e03ea'
  },  
});

//jshint ignore:end