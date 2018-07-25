//jshint ignore:start
import React, { Component } from 'react';
import {
    Modal
} from 'react-native';
import Login from '../components/Login'
//redux
import {connect} from 'react-redux';
//import {bindActionCreators} from 'redux';


export class LoginModal extends React.Component {
    constructor(props) {
      super(props);

      this.state = {modalVisible: false};

      //alert(this.state.modalVisible);
    }

    componentWillReceiveProps(newProps) {
        //alert(newProps.modalVisible);
        this.setState({modalVisible: newProps.modalVisible});
    }
      
    render() {
        return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                //alert('Hi')
                this.setState({modalVisible: false})
            }}>
            <Login onAuth={this.props.onAuth}/>
        </Modal>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        ...state
    };
}

// function mapDispatchToProps(dispatch, ownProps) {
//     return {
//         someactions: bindActionCreators(userActions, dispatch)
//     }
// }

export default connect(mapStateToProps)(LoginModal);

//jshint ignore:end