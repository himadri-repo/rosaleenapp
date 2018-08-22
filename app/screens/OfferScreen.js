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
import {getServiceCategories} from '../../actions/serviceCategoryActions';
import {ListItem} from 'react-native-elements';
import { YellowBox } from 'react-native'
import {withNavigationFocus} from 'react-navigation';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//import Icon from 'react-native-vector-icons'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export class OfferScreen extends React.Component {

    constructor(props) {
      super(props);
      this.Mounted = true;
      this.profile = {name: '', picture: ''};
      this.state = {userlist: [{}], postlist: [{}], api: '', servicecategories: ds};
      //console.log("Offers : " + JSON.stringify(this.props));
      //this.itemClicked = this.itemClicked.bind(this);
    }
  
    componentWillUnmount() {
        console.log("\nOffer unmounted ...");
        this.Mounted = false;
    }

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
          if(this.Mounted)
            this.setState({ servicecategories: ds.cloneWithRows(jsonResponse)});

          //this.state.userlist = jsonResponse;
          //alert("User : " + this.state.userlist.length);
        }
        else {
          //alert(JSON.stringify(jsonResponse));
          //this.setState({postlist: jsonResponse});
          if(this.Mounted)
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
        try
        {
            //console.log("credentials: " + JSON.parse(result));
            this.credentials = JSON.parse(result);
            //this.callAPI('servicecat');
            this.props.actions.getServiceCategories();
            //console.log("Offer Action Functions: " + JSON.stringify(this.props.actions.getServiceCategories));
            //this.setState({ servicecategories: ds.cloneWithRows(this.props.serviceCategories)});
        }
        catch(e) {
            console.log(e);
        }
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

        //console.log("\nFocused [Offer]: " + this.props.isFocused);
        if(!this.props.isFocused) {
          return null;
        }

        return (
            <View style={styles.rootcontainer}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"/>
                <ScrollView style={{backgroundColor: '#ffffff', flex: 1}} >
                    <ListView 
                        contentContainerStyle={styles.grid}
                        //dataSource={this.state.servicecategories}
                        dataSource={ds.cloneWithRows(this.props.serviceCategories)}
                        renderRow={(item, index) => this.renderGridItem(item, index)}
                    />
                </ScrollView>                    
            </View>
        );
    }
}


function mapStateToProps(state, ownProps) {
    //console.log("mapState2Props : " + (JSON.stringify(state.serviceCategories)) + " - " + state.serviceCategories.length);

    //console.log('updated state [offer]: ' + JSON.stringify(state.cart));
    return {
        ...state
    };
}
  
 function mapDispatchToProps(dispatch, ownProps) {
    return {
        actions: bindActionCreators({getServiceCategories}, dispatch)
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(OfferScreen));

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
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'stretch'
  },
  gridItem: {
      margin:5,
      width: 100, //150,
      height: 100, //150,
      justifyContent: 'center',
      alignItems: 'center',
  },
  gridItemImage: {
      width: 70, //100,
      height: 70, //100,
      borderWidth: 1.5, 
      borderColor: 'blue',
      borderRadius: 50,
      justifyContent:'center',
      alignItems:'center'
  },
  gridItemText: {
      marginTop: 5,
      textAlign:'center',
      fontSize: 14, //18
      color: '#d34a2e'
  }
});

//jshint ignore:end