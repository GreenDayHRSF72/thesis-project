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
  PickerIOS
} = ReactNative;

var o


class Suggester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: 0,
      distance: 0,
      location: 'Hack Reactor, San Francisco',
      dislikes: []
    };
  }

  getUserInfo() {

  }

  queryYelp() {

  }

  render() {
    return <View>
        <Text style={{ marginTop: 20 }}>
          Don\'t know what to do for your hangout? Just answer a few quick
          questions and we\'ll help you figure it out! \n
        </Text>
        <Text>
          Where do you want to go?
        </Text>
        <PickerIOS

        >
        </PickerIOS>
        <Text>
          How from the that place are you willing to go?
        </Text>
        <Text>
          What are you and your friends willing to spend?
        </Text>

      </View>
  }
}




export default Suggester;