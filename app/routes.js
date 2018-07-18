//jshint esversion:6
//jshint ignore:start
import React, { Component } from 'react';
import Home1 from './screens/ServicesScreen';
import Home2 from './screens/ServicesScreen';
import Home3 from './screens/ServicesScreen';
import SideMenu from './SideMenu';
import {DrawerNavigator} from 'react-navigation';

export default DrawerNavigator({
  Home1: {
    screen: (props)=><Home1 {...props} credentials="data1" profile="prof1" screenProps={{nav: props.navigation}}/>
  },
  Home2: {
    screen: (props)=><Home2 {...props} credentials="data2" profile="prof2" screenProps={{nav: props.navigation}}/>
  },
  Home3: {
    screen: (props)=><Home3 {...props} credentials="data3" profile="prof3" screenProps={{nav: props.navigation}}/>
  }
}, {
  contentComponent: SideMenu,
  drawerWidth: 300,
  initialRouteName: 'Home1',
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  navigationOptions: {
    header: null
  }
});
//jshint ignore:end