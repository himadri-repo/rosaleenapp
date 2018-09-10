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
import {ScrollView, View, Image, StatusBar} from 'react-native';
import { Container, Content, Text, List, ListItem } from "native-base";

//redux specific imports
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUsers} from '../actions/userActions';

const routes = ["Home", "Chat", "Profile"];

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
          <Image
            source={{
              uri: "https://cdn-images-1.medium.com/max/2000/1*l3wujEgEKOecwVzf_dqVrQ.jpeg"
            }}
            style={{
              height: 120,
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "center"
            }}>
          </Image>
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(data)}>
                  <Text>{data}</Text>
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