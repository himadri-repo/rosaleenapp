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
import Auth0 from 'react-native-auth0';

var credentials = require('../AuthCredential');
const auth0 = new Auth0(credentials);

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);

    //this.credentials = AsyncStorage.getItem('credentials').done();
    //this.profile = AsyncStorage.getItem('profile').done();

    //Alert.alert("Title", 'Hi am in Profile');

    /*this.credentials = this.props.navigation.state.params.credentials;
    this.profile = this.props.navigation.state.params.profile;*/
    this.profile ={name: '', picture: ''};
    this.state = {userlist: [{}], postlist: [{}], api: ''};

    //this.itemClicked = this.itemClicked.bind(this);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Profile',
    headerRight: <Button title="Logout" onPress={() => navigation.navigate('Home')} />
  });
  
  callAPI = (api) => {
    // You need to set a working URL to your API server.
    //,
    // body: JSON.stringify({
    //   firstParam: 'yourValue',
    // })
    //http://10.0.2.2:3000/users/
    let url = '';
    this.setState({api: api});

    if(api==="post") {
      //url = 'https://jsonplaceholder.typicode.com/posts';
      url = 'http://139.59.92.9:3000/services';
    }
    else if(api==="user") {
      //url = 'https://jsonplaceholder.typicode.com/users';
      url = 'http://139.59.92.9:3000/users';
    }


    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.credentials.accessToken
      }
    })
    .then((response) => response.json())
    .then((jsonResponse) => {
      //console.log(response.json());
      if(api==="user") {
        //this.setState({userlist: jsonResponse});
        this.setState((prevState)=> (Object.assign({}, prevState, {userlist: jsonResponse})));
        //this.state.userlist = jsonResponse;
        //alert("User : " + this.state.userlist.length);
      }
      else {
        //alert(JSON.stringify(jsonResponse));
        //this.setState({postlist: jsonResponse});
        this.setState((prevState)=> (Object.assign({}, prevState, {postlist: jsonResponse})));
        //this.state.postlist = jsonResponse;
        //alert("Posts : " + this.state.postlist.length);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };

  // formatUserList = (users) => {
  //   const items = users.map(user=> 
  //     <li key={user.EmployeeID}>{user.Name}</li>
  //   );
  //   return(
  //     <ul>
  //       {items}
  //     </ul>
  //   )
  // };
//        <Image source={require('../images/logo_old.png')} style={styles.background} resizeMode="contain"/>

  renderListItem(item, api) {
    if(api==="user") {
      return(
        // <ListItem button key={"Key-" + item.id} 
        //       title={item.name} subtitle={item.email} leftIcon={{name: 'contacts'}} onPress={() => this.itemClicked(item, this.state.api)}/>
        <ListItem button key={"Key-" + item.id} 
          title={item.username} subtitle={item.email} leftIcon={{name: 'contacts'}} onPress={() => this.itemClicked(item, api)}/>
      )
    }
    else if(api==="post") {
      return(
        // <ListItem button key={"Key-" + item.id} 
        //       title={item.title} leftIcon={{name: 'comment'}} onPress={() => this.itemClicked(item, this.state.api)}/>
        <ListItem button key={"Key-" + item.id} 
              title={item.name} leftIcon={{name: 'comment'}} onPress={() => this.itemClicked(item, api)}/>
      )
    }
  }

  itemClicked(item, api) {
    if(api==="user") {
      //Alert.alert('User', item.name);
      this.props.navigation.navigate('Details', {userinfo: item, postinfo: {}, api: api});
    }
    else if(api==="post") {
      //Alert.alert('My Post', item.title);
      this.props.navigation.navigate('Details', {userinfo: {}, postinfo: item, api: api});
    }
  }

  render() {
    //const userList = this.formatUserList(this.state.userlist);
    //<Text>{JSON.stringify(this.profile, null, 2)}</Text>
    // renderItem={({item}) => <ListItem key={"Key-" + item.id} 
    //     title={item.name} subtitle={item.email} leftIcon={{name: 'done'}} rightIcon={{name: null}}/>}
    // icon= {<Icon name='envelope' size={15} color='white' />}
    // icon= {<Icon name='address-card' size={15} color='white' />}

    let titleSection = null;
    
    if(this.state.api!=='') {
      titleSection =  <Text style={styles.headerTitle} visible >
                        {(this.state.api==='user'? 'Users' : (this.state.api==='post'? 'Services' : ''))}
                      </Text>;
    }

    return (
      <View style={styles.rootcontainer}>
        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"/>
        <View style={styles.headersection}>
          <Text style={styles.header} >
            Welcome {this.profile.name} <Image source={{ uri: this.profile.picture }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#ff0000'}}/>
          </Text>
        </View>
        <View style={styles.container}>
          <Button
            onPress={() => this.callAPI('user')}
            title="Users"/>
          <Button
            onPress={() => this.callAPI('post')}
            title="Services"/>
        </View>
        <View style={styles.userlist}>
          {titleSection}
          <FlatList style={styles.flatlist} data={(this.state.api==="user"? this.state.userlist : this.state.postlist)} 
            renderItem={({item}) => this.renderListItem(item, this.state.api)}
            keyExtractor={(item, index) => "Key-" + item.id}
          />
        </View>
      </View>
    );
  }
}

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
    /*borderWidth: 1,
    borderColor: '#ff0000'*/
  }
});

//jshint ignore:end