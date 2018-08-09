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
  Platform
} from 'react-native';
import {ListItem} from 'react-native-elements';
//import Icon from 'react-native-vector-icons'
import Icon from 'react-native-vector-icons/Ionicons';
import {withNavigationFocus, StackActions, NavigationActions} from 'react-navigation';
//redux specific imports
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getServices} from '../../actions/serviceActions';
import {updateCart} from '../../actions/cartManagementActions';

const CURRENT_CART_INFORMATION = 'current_cart_information';

export class ServiceItemsScreen extends React.Component {

    constructor(props) {
      super(props);
  
      //this.credentials = AsyncStorage.getItem('credentials').done();
      //this.profile = AsyncStorage.getItem('profile').done();
  
      //Alert.alert("Title", 'Hi am in Profile');
  
      /*this.credentials = this.props.navigation.state.params.credentials;
      this.profile = this.props.navigation.state.params.profile;*/
      this.profile = {name: '', picture: ''};
      this.state = {userlist: [{}], postlist: [{}], api: '', refreshing: false, cart: {selectedServices:[], customer: {}}};

      this.state.category = '';
      this.state.categoryItem = {};
      this.state.technician = Object.assign({}, {technician: this.props.navigation.state.params.technician, 
        name: this.props.navigation.state.params.name});
      //this.state.technician = this.props.navigation.state.params.technician;
      if(this.props.navigation.state.params) {
        this.state.category = this.props.navigation.state.params.serviceCategory.name;
        this.state.categoryItem = Object.assign({}, this.props.navigation.state.params.serviceCategory);
      }

      let storedCart = AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(value => {
        let storedCart = JSON.parse(value);
        //console.log('stored cart: ' + JSON.stringify(storedCart));
        this.state.cart = Object.assign({}, {selectedServices:[], customer: {}}, storedCart, this.props.cart);
      });


      this.state.services = Object.assign([{}], this.props.services);

      //console.log("\n\nServiceItems [props]: " + JSON.stringify(this.props));

    //   this.state.category = {};
    //   if(this.props.navigation.state.params) {
    //     this.state.category = this.props.navigation.state.params.serviceCategory.name;
    //   }
      
      //console.log("Services [users]: " + JSON.stringify(this.state.userlist));
      //this.itemClicked = this.itemClicked.bind(this);
    }

    componentWillUnmount() {
      console.log("\nServiceItemsScreen unmounting ...");
    }
  
    static navigationOptions = ({ navigation }) => ({
        title: `Select services (${navigation.state.params.serviceCategory.name})`,
        /*headerRight: <Button title="Logout" onPress={() => navigation.navigate('Home')} />*/
    });

    pressItem(service) { 
      let selectedServices = this.state.cart.selectedServices;

      let index = selectedServices.findIndex(srv=> srv.id===service.id);
      if(index<0) {
        selectedServices.push(service);
      }
      else {
        selectedServices.splice(index, 1);
      }

      this.setState({selectedServices: selectedServices});

      try
      {
        //console.log('actions: ' + JSON.stringify(this.props.actions.updateCart));
        //console.log('cart : ' + JSON.stringify(this.state.cart))
        AsyncStorage.setItem(CURRENT_CART_INFORMATION, JSON.stringify(this.state.cart)).then(value=> {
          //console.log('cart in actions: ' + JSON.stringify(cart));
          this.props.actions.updateCart(this.state.cart);
        }).catch(reason => {
            console.log('Unable to save cart to local state [Error: ' + reason + "]");
        });

        // AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(value => {
        //   console.log('cart after pulling from AsyncStorage: ' + value);
        // });
        //this.props.actions.cartServices(this.state.cart);
      }
      catch(error) {
        console.log(error);
      }

      //console.log('Cart -> ' + JSON.stringify(this.state.cart));
      // services = services.map((srv, idx) => {
      //   if(srv.id===service.id)
      //   {
      //     if(srv.operation_time==30) {
      //       srv.operation_time = 40;
      //     }
      //     else if(srv.operation_time==40) {
      //       srv.operation_time = 30;
      //     }
      //     console.log(srv.operation_time);
      //   }

      //   return srv;
      // });
      // //console.log(`\nuser clicked : ${JSON.stringify(services)}`);
      // this.setState({services: services});
    }

    onRefresh = () => {
        try
        {
          this.setState({refreshing: true});
          this.props.actions.getServices();
          //this.props.serviceActions.getServices();
          this.setState({refreshing: false});
        }
        catch(error) {
          console.log(error);
        }
    }

    async OnSalesReview() {
      //Alert.alert('Confirm', 'Do you want to proceed with billing?');
      //await AsyncStorage.setItem(CURRENT_CART_INFORMATION, JSON.stringify(this.state.cart));
      console.log(`Cart is stored into storage -> Services count: ${this.state.cart.selectedServices.length}`);
      this.props.navigation.navigate('ServiceSalesReviewTabLanding', {cart: this.state.cart});
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
        const SelectionIcon = (props) => {
          let selectedServices = this.state.cart.selectedServices;
          let selectedService = selectedServices.find(srv => srv.id===props.id);

          let platform = Platform.OS === 'ios' ? 'ios' : 'md';
          let iconName = selectedService? `${platform}-checkbox` : `${platform}-square-outline`;
          let iconColor = selectedService? 'green' : 'black';
          return <Icon style={styles.selectIcon} name={iconName} color={iconColor} size={20}/>;
        };

        const Row = (props) => (
          <TouchableOpacity style={styles.gridItem} onPress={()=> this.pressItem(props)} key={'id-' + props.id}>
            <View style={styles.listitemcontainer}>
              {
                //console.log('Row -> ' + JSON.stringify(props))
              }
              <SelectionIcon {...props} />
              <Image source={{uri: props.image}} style={styles.listitemphoto} />
              <Text style={styles.listitemtext}>{props.name}</Text>
            </View>
          </TouchableOpacity>
        );
        //{navigation.state.params.serviceCategory.name}
        //${props.item.username}
        return (
            <View style={styles.rootcontainer}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"/>
                <Text style={styles.headerTitle}>Services of {this.state.category} Category</Text>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} title='Refreshing ...'/>
                    } style={styles.listcontainer}>
                  {
                    this.state.services.filter(service => service.category_id==this.state.categoryItem.id && service.active).map((srv, idx) => (
                      // <ListItem key={'li' + idx} roundAvatar avatar={{uri: srv.image}}
                      //   title={srv.name} subtitle={(srv.description.length>40? srv.description.substring(0,39):srv.description)}/>
                      <Row {...srv} key={'id-'+idx} />
                    ))
                  }
                </ScrollView>
                <TouchableOpacity disabled={this.state.cart.selectedServices.length<=0} 
                    style={styles.Button} 
                    onPress={()=> this.OnSalesReview()}>
                      <Text style={this.state.cart.selectedServices.length<=0? styles.disabled 
                        : styles.proceedButtonText}>
                        Proceed to Billing ({this.state.cart.selectedServices.length} services) >>
                      </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
//styles.Button
function mapStateToProps(state, ownProps) {
  //console.log('Cart [ServiceItemsScreen]-> ' + JSON.stringify(state.cart));

  return {
      ...state
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
      actions: bindActionCreators(Object.assign({}, {getServices}, {updateCart}), dispatch),
      //cartActions: bindActionCreators({updateCart}, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(ServiceItemsScreen));

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
    /*padding: 10*/
    width: '100%',
  },
  proceedButton: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: "100%",
    backgroundColor: '#1c1ccd',
    color: '#ffffff',
    alignContent: 'center',
  },
  proceedButtonText: {
    backgroundColor: '#1c1ccd',
    color: '#ffffff',
    height: 50,
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    fontWeight: '300',
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignContent: 'center',
  },
  disabled: {
    display: 'none',
    // color: '#cdcdcd',
    // fontSize: 14,
    // fontWeight: '100',
  },
  listitem: {
    /*borderWidth: 0,
    backgroundColor: '#cdcdcd',*/
    padding: 5
  },
  /* list item style */
  listitemcontainer: {
    flex: 1,
    padding: 5,
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
    height: 50, //150,
    /*justifyContent: 'center',
    alignItems: 'center',*/
    borderBottomWidth: 1,
    borderBottomColor: '#0e03ea'
  },
  selectIcon: {
    height: 40,
    width: 40,
    marginRight: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    /*borderWidth: 1,
    borderColor: '#000000',*/
    fontSize: 30,
  },
});

//jshint ignore:end