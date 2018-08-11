/**
 * Auth0Sample 01-Custom-Form
 * https://github.com/auth0/react-native-auth0
 * @flow
 */
//jshint ignore:start
//jshint esversion: 6
import React, { Component } from 'react';
import {
  AppRegistry,
  Platform
} from 'react-native';
import HomeScreen from './app/screens/HomeScreen'
import ProfileScreen from './app/screens/ProfileScreen'
import DetailScreen from './app/screens/DetailScreen'
import LandingScreen from './app/screens/LandingScreen'
import ServiceCategory from './app/screens/ServiceCategoryScreen'
import ServicesScreen from './app/screens/ServicesScreen'
import ServiceItemScreen from './app/screens/ServiceItemsScreen'
import SalesReviewScreen from './app/screens/SalesReviewScreen'
import OfferScreen from './app/screens/OfferScreen'
import SearchScreen from './app/screens/SearchScreen'
import CartControl from './app/components/CartControl';
import SideMenu from './app/SideMenu'
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, NavigationActions, StackActions } from 'react-navigation';
import { YellowBox, View, Text, StyleSheet, StatusBar, Icon, Alert, Easing, Animated, AsyncStorage, BackHandler } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Auth0 from 'react-native-auth0';
import RNExitApp from 'react-native-exit-app';

//import CardStackStyleInterpolator from "react-navigation/src/views/CardStack/CardStackStyleInterpolator";
//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);

var credentials = require('./app/AuthCredential');
const auth0 = new Auth0(credentials);

const StackNav = createStackNavigator({
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
  Details: { screen: DetailScreen },
  // Landing: 
  // { 
  //   screen: LandingScreen,
  //   navigationOption: {
  //     header: null
  //   }
  // }
});

// const titleAndIcon =
//   <View>
//     <Text>Weather App</Text>
//   </View>;

const ACCESS_TOKEN = "accessToken";
const logout = () => {
  Alert.alert("Confirm", "Do you want to exit the app?",[
    {text: "Ok", onPress: () => {
      console.log("Exiting app");
      AsyncStorage.removeItem(ACCESS_TOKEN, (error) => {
        if(!error) {
          //auth0.auth.logoutUrl({clientId: credentials.clientId, returnTo: ''});
        }
        else {
          console.log(error);
        }
      });
      //this.navigation.navigate('Home');
      BackHandler.exitApp();
    }}, {text: "Cancel", onPress: () => {
      console.log("Not existing app");
    }, style: 'cancel'}
  ], {cancelable: true});
};

const LandingScreenStack = createStackNavigator({
  TabLanding: {screen: LandingScreen },
},{
  navigationOptions: ({navigation}) => ({
      headerStyle: {
        backgroundColor: '#2424de'
      },
      /*headerTitle: titleAndIcon,*/
      headerTintColor: 'white',
      title: 'Dashboard',
      headerLeft: <Ionicons style={styles.menuIcon} name="ios-menu-outline" size={35} onPress={ () => navigation.toggleDrawer() } />,
      headerRight: <View style={styles.headerIconContainer}>
        <CartControl />
        <Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />
        </View>
  })
});
//<Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />

// const resetServiceScreenAction = NavigationActions.reset({
//   index: 0,
//   actions: [
//     NavigationActions.navigate({routeName: 'ServiceCatTabLanding'})
//   ]
// });

const resetAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'ServiceCatTabLanding' }),
    NavigationActions.navigate({ routeName: 'ServiceTabLanding' }),
  ],
});

const ServicesScreenStack = createStackNavigator({
    ServiceCatTabLanding: {screen: ServiceCategory , navigationOptions: ({navigation})=> ({
      title: 'Service Categories',
      headerLeft: <Ionicons style={styles.menuIcon} name="ios-menu-outline" size={35} onPress={ () => navigation.toggleDrawer() } />,
    })},
    ServiceTabLanding: {screen: ServicesScreen, },
    // ServiceTabLanding: {screen: ServicesScreen, navigationOptions: ({navigation})=> ({
    //   title: 'Services'
    // })}
    ServiceItemsTabLanding: {screen: ServiceItemScreen, },
    ServiceSalesReviewTabLanding: {screen: SalesReviewScreen},
  },{
    initialRouteName: 'ServiceCatTabLanding',
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        backgroundColor: '#2424de',
      },
      gesturesEnabled: true,
      // tabBarOnPress: (tab, jumpToIndex) => {
      //   console.log("\ntabBarOnPress :: " + JSON.stringify(tab));
      //   jumpToIndex(tab.index)
      //   navigation.dispatch(NavigationActions.reset({
      //     index: 0,
      //     actions: [
      //       NavigationActions.navigate({ routeName: 'ServiceCatTabLanding' }) // go to first screen of the StackNavigator
      //     ]
      //   }))
      // },
      /*headerTitle: titleAndIcon,*/
      
      headerTintColor: 'white',
      /*title: 'Services',*/
      /*headerLeft: <Ionicons style={styles.menuIcon} name="ios-menu-outline" size={35} onPress={ () => navigation.toggleDrawer() } />,*/
      // headerRight: <Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />
      headerRight: <View style={styles.headerIconContainer}>
        <CartControl />
        <Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />
        </View>
  }),
  transitionConfig: (sceneProps) => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
    },
    screenInterpolator: sceneProps => {
      const {layout, position, scene} = sceneProps;
      const {index} = scene;

      const width = layout.initWidth;
      const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, 0],
      });
      const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
      });

      return {opacity, transform: [{translateX: translateX}]};
    },
  }),
});

const OfferScreenStack = createStackNavigator({
  TabLanding: {screen: OfferScreen },
},{
  navigationOptions: ({navigation}) => ({
      headerStyle: {
        backgroundColor: '#2424de'
      },
      /*headerTitle: titleAndIcon,*/
      headerTintColor: 'white',
      title: 'Offers',
      headerLeft: <Ionicons style={styles.menuIcon} name="ios-menu-outline" size={35} onPress={ () => navigation.toggleDrawer() } />,
      headerRight: <View style={styles.headerIconContainer}>
        <CartControl />
        <Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />
        </View>
  })
});
//<Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />


const SearchScreenStack = createStackNavigator({
  TabLanding: {screen: SearchScreen },
},{
  navigationOptions: ({navigation}) => ({
      headerStyle: {
        backgroundColor: '#2424de'
      },
      /*headerTitle: titleAndIcon,*/
      headerTintColor: 'white',
      title: 'Search',
      headerLeft: <Ionicons style={styles.menuIcon} name="ios-menu-outline" size={35} onPress={ () => navigation.toggleDrawer() } />,
      headerRight: <View style={styles.headerIconContainer}>
        <CartControl />
        <Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />
        </View>
  })
});
//<Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />

const TabVab = createBottomTabNavigator({
  HomeAfterLogin: { screen: LandingScreenStack, navigationOptions: ({navigation}) => ({
    /*tabBarOnPress: (previousScene, scene, jumpToIndex) => {
      console.log("\ntabBarOnPress: " + scene + "\n");
    },*/
    title: 'Dashboard'
  }) },
  Services: { screen: ServicesScreenStack, navigationOptions: ({navigation}) => ({
    title: 'Services',
  }) },
  Offers: { screen: OfferScreenStack , navigationOptions: ({navigation}) => ({
    /*tabBarOnPress: (previousScene, scene, jumpToIndex) => {
      console.log("\ntabBarOnPress: " + scene + "\n");
    },*/
    title: 'Offers'
  }) },
  Search: { screen: SearchScreenStack , navigationOptions: ({navigation}) => ({
    /*tabBarOnPress: (previousScene, scene, jumpToIndex) => {
      console.log("\ntabBarOnPress: " + scene + "\n");
    },*/
    title: 'Search'
  }) },
}, 
{
  headerMode: 'none',
  headerVisible: false,
  initialRouteName: 'HomeAfterLogin',
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'HomeAfterLogin') {
        iconName = `ios-home${focused ? '' : '-outline'}`;
      } else if (routeName === 'Services') {
        iconName = `ios-apps${focused ? '' : '-outline'}`;
      } else if (routeName === 'Offers') {
        iconName = `ios-list-box${focused ? '' : '-outline'}`;
      } else if (routeName === 'Search') {
        iconName = `ios-search${focused ? '' : '-outline'}`;
      }

      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
    tabBarOnPress: ({navigation, defaultHandler}) => {
      if(navigation.state.key.toLowerCase()=="services") {
        //console.log(JSON.stringify(defaultHandler));
        if(navigation.state.index==1) {
          console.log('\npop action should be called');
          //navigation.setParams({resetNavigation: true});
          //navigation.state.params.resetNavigation=true; //.dispatch(resetServiceScreenAction);
          //navigation.goBack();
          //navigation.dispatch(resetAction);
        }
      }
      if(defaultHandler) {
        //console.log('\ntabBarOnPress [app.js] clicked before defaultHandler');
        defaultHandler();
      }
    },
  }),
  lazy: false,
  /*lazyLoad: false,*/
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: '#bf3509',  //'tomato',
    inactiveTintColor: '#655ce4', //'gray',
    labelStyle: {
      fontSize: 14,
    },
    style: {
      backgroundColor: '#eff5fb' //'#eff0f1'
    }
  },
  swipeEnabled: true,
  animationEnabled: true,
  backBehavior: "none"
});

const DashboardNav = createStackNavigator({
  Dashboard: TabVab
}, {
  headerMode: 'none',
  navigationOptions: ({navigation}) => ({
      headerVisible: false,
      headerStyle: {
        backgroundColor: '#2424de'
      },
      /*headerTitle: titleAndIcon,*/
      headerTintColor: 'white',
      title: 'Your Location',
      headerLeft: <Ionicons style={styles.menuIcon} name="ios-menu-outline" size={35} onPress={ () => navigation.toggleDrawer() } />,
      headerRight: <View style={styles.headerIconContainer}>
        <CartControl />
        <Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />
        </View>
  })
});
// <Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />
//<Ionicons style={styles.menuIcon} name="ios-exit-outline" title="Logout" size={35} onPress={ () => logout() } />

const DrawerNavigation = createDrawerNavigator({
    Home: StackNav,
    Dashboard: {screen: DashboardNav, navigationOption: { title: 'Dashboard' }}
    // Services: {
    //   screen: (props)=><Home1 {...props} credentials="data1" profile="prof1" screenProps={{nav: props.navigation}}/>
    // },
    // Home2: {
    //   screen: (props)=><Home2 {...props} credentials="data2" profile="prof2" screenProps={{nav: props.navigation}}/>
    // },
    // Home3: {
    //   screen: (props)=><Home3 {...props} credentials="data3" profile="prof3" screenProps={{nav: props.navigation}}/>
    // }
  }, {
  contentComponent: SideMenu,
  drawerWidth: 300,
  initialRouteName: 'Home',
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  // navigationOptions: {
  //    header: null
  // }
});

const CURRENT_CART_INFORMATION = 'current_cart_information';

export class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {userlist: [{}], postlist: [{}], api: '', refreshing: false, cart: {selectedServices:[], customer: {}}};

    // let storedCart = AsyncStorage.getItem(CURRENT_CART_INFORMATION).then(value => {
    //   let storedCart = JSON.parse(value);
    //   console.log('stored cart: ' + JSON.stringify(storedCart));
    //   this.state.cart = Object.assign({}, {selectedServices:[], customer: {}}, storedCart, this.props.cart);
    //   console.log('stored cart: ' + JSON.stringify(this.state.cart));
    // });
  }

  exitApp = () => {
    //console.log(JSON.stringify(val));
    Alert.alert('Confirm', 'Do you want to exit (Yes/No)?', [
      {text: 'Yes', onPress: () => {
        //console.log('NAV-> ' + JSON.stringify(this.props.navigator));
        //this.reset();
        RNExitApp.exitApp();
        //BackHandler.exitApp();
      }},
      {text: 'No', onPress: () => console.log('No need to exit the app'), style: 'cancel'}
    ], {cancelable: true});
    return true;
  }  

  componentDidMount() {
    //console.log('Props: ' + JSON.stringify(this.props.navigation));
    BackHandler.addEventListener('hardwareBackPress', this.exitApp);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.exitApp);
  }

  render() {
    //const {navigate} = this.props.navigation;

    //this.setState({navigation: navigate});

    return (
        <DrawerNavigation>
          <StatusBar
          backgroundColor="blue"
          barStyle="light-content"/>
        </DrawerNavigation>
    );
  }
}

function mapStateToProps(state, properties)
{
//  console.log("mapState2Props : " + JSON.stringify(state));

  return {
    ...state
  };
}

const styles = StyleSheet.create({
  menuIcon: {
    flex: 1,
    color: '#ffffff',
    marginLeft: 10,
    marginRight: 10
  },
  headerIconContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
  }
});

// more info https://goo.gl/eawcVg
export const colors = {
  "background_dark": '#455a64',
  "background_medium": '#b3c4cb',
  "background_light": '#d9e3f0',
  "button_bg": '#0693e3',
  "button_fg": '#d9e3f0',
  "text_light": '#d9d9d9',
  "text_medium": '#455a64',
  "text_dark": '#263238',
};

export const values = {
  "font_title": 'NotoSans-Bold',
  "font_body": 'NotoSans-Regular',
  "font_body_size": 14,
  "font_title_size": 20,
  'border_radius': 2,
};

export const tabs = {
  // text
  labelStyle: {
    fontFamily: values.font_body,
    fontSize: values.font_body_size,
  },
  activeTintColor: colors.text_dark, // text color active tab
  inactiveTintColor: colors.text_medium, // text color inactive tab
  indicatorStyle: {backgroundColor: colors.button_bg}, // active tab highlight top
  style: {
    backgroundColor: colors.background_medium, // background color of tabs
    borderTopColor: colors.background_light // active tab highlight bottom
  }
};

export default connect(mapStateToProps)(App);

//jshint ignore:end