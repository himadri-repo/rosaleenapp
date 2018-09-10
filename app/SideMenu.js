//jshint esversion:6
//jshint ignore:start
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './SideMenu.style';
import {withNavigationFocus, NavigationActions} from 'react-navigation';
import {ScrollView, Image, ImageBackground, View, StatusBar} from 'react-native';
import { Container, Content, Text, List, ListItem } from "native-base";

//redux specific imports
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUsers} from '../actions/userActions';

const routes = [
  {name: 'Home', route: 'HomeAfterLogin'},
  {name: 'Services', route: 'ServiceCatTabLanding'},
  {name: 'Offers', route: 'Offers'},
  {name: 'Search', route: 'Search'},
];

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
    return (
      <Container>
        <Content>
          <ImageBackground
            source={{
              uri: "https://cdn-images-1.medium.com/max/2000/1*l3wujEgEKOecwVzf_dqVrQ.jpeg"
            }}
            style={{
              height: 120,
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Image
              style={{ height: 80, width: 80, borderWidth: 1, borderColor: '#F44336', borderRadius: 40 }}
              source={{
                uri: "https://media.licdn.com/dms/image/C5603AQEUrvvwkf1jOg/profile-displayphoto-shrink_200_200/0?e=1542240000&v=beta&t=Ry1WqHqSdS2UzwYTWb4L5C_jArm8RnIjmxDWn-bVwAw"
              }}
            />
          </ImageBackground>
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(data.route)}
                  style={{borderBottomColor: '#e1e1e1', borderBottomWidth: 1, marginLeft: 0, paddingLeft: 0}}
                  >
                  <Text style={{marginLeft: 8}}>{data.name}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(SideMenu));
//export default SideMenu;
//jshint ignore:end