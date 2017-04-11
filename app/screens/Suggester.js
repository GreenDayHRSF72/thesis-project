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

const locationOptions = [
  {text: 'At my current location', value: 1},
  {text: 'At another location', value: 2}
]
const distanceOptions = [
  {text: '1 - I\'m too lazy to go anywher else', value: 500},
  {text: '2 - I don\'t mind a bit of a stroll', value: 1000},
  {text: '3 - Let\'s go on an adventure!' , value: 2400}
]


class Suggester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: 2,
      distance: 500,
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
        <Text>
          Welcome to the Suggester!{'\n'}
        </Text>
        <Text style={{ marginTop: 20 }}>
          Don't know what to do for your hangout?{'\n'}
          Just answer a few quickquestions and we'll help you figure it out!{'\n'}
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