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
  ListView
} from 'react-native';
import {ListItem} from 'react-native-elements';
//import Icon from 'react-native-vector-icons'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ServiceScreen extends React.Component {

    constructor(props) {
      super(props);
      this.profile = {name: '', picture: ''};
      this.state = {userlist: [{}], postlist: [{}], api: '', servicecategories: ds};
      console.log("Services : " + JSON.stringify(this.props));
      //this.itemClicked = this.itemClicked.bind(this);
    }
  
    // static navigationOptions = ({ navigation }) => ({
    //     title: 'Services',
    //     headerRight: <Button title="Logout" onPress={() => navigation.navigate('Home')} />
    // });

    callAPI = (api) => {
      let url = '';
      this.setState({api: api});
  
      if(api==="servicecat") {
        //url = 'https://jsonplaceholder.typicode.com/posts';
        url = 'http://139.59.92.9:3000/services/categories';
      }
      // else if(api==="user") {
      //   //url = 'https://jsonplaceholder.typicode.com/users';
      //   url = 'http://139.59.92.9:3000/users';
      // }

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
        if(api==="servicecat") {
          //this.setState({userlist: jsonResponse});
          
          //this.setState((prevState)=> (Object.assign({}, prevState, {servicecategories: jsonResponse})));
          this.setState({ servicecategories: ds.cloneWithRows(jsonResponse)});

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

    componentDidMount = () => {
      AsyncStorage.getItem('credentials').then(result => {
        console.log("credentials: " + JSON.parse(result));
        this.credentials = JSON.parse(result);
        this.callAPI('servicecat');
      }).catch(reason => {
        console.log(`componentDidMount:ERROR ${reason}`);
      });
    };
    
    renderGridItem(item, index) {
      return (
        <TouchableOpacity style={styles.gridItem}>
          <View style={styles.gridItemImage}>
              <Text style={{fontSize:25, color:'blue'}}>
                  {item.name}
              </Text>
          </View>
          <Text style={styles.gridItemText}>{item.name}</Text>
        </TouchableOpacity>
      );
    }

    render() {
        let titleSection = null;

        return (
            <View style={styles.rootcontainer}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"/>
                <ScrollView style={{backgroundColor: '#ffffff', flex: 1}} >
                    <ListView 
                        contentContainerStyle={styles.grid}
                        dataSource={this.state.servicecategories}
                        renderRow={(item, index) => this.renderGridItem(item, index)}
                    />
                </ScrollView>                    
            </View>
        );
    }
}

const styles = StyleSheet.create({
  servicecatcontainer: {
    flex: 0.5,
    flexDirection: 'row',
/*    width: 40,
    height: 40,*/
    alignItems: 'center',
    justifyContent: 'space-between'
  },
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
  },
  logo: {
    flex: 1,
    margin: 10,
    paddingBottom: 10,
  },
  cardItem: {
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categoryItem: {
    flex: 1,
    fontSize: 16
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  gridItem: {
      margin:5,
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
  },
  gridItemImage: {
      width: 100,
      height: 100,
      borderWidth: 1.5, 
      borderColor: 'blue',
      borderRadius: 50,
      justifyContent:'center',
      alignItems:'center'
  },
  gridItemText: {
      marginTop: 5,
      textAlign:'center',
      fontSize: 18,
      color: '#d34a2e'
  }
});

//jshint ignore:end