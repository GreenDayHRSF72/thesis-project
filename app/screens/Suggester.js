import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

const {
  View,
  Text,
  TouchableHighlight,
  Button, 
  TextInput,
} = ReactNative;


class Suggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: 0,
      distance: 0,
      location: 'Hack Reactor, San Francisco',
      dislikes: []
    };
  }

  render() {
    return <View>
        <Text style={{ marginTop: 20 }}>
          Don\'t know what to do for your hangout? Just answer a few quick
          questions and we\'ll help you figure it out! \n
        </Text>
        
      </View>
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Me);