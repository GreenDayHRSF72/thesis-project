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
  PickerIOS,
  ScrollView,
  Alert,
} = ReactNative;

var PickerItemIOS = PickerIOS.Item;

const locationOptions = [
  {text: '1 - Close to my current location', value: 1},
  {text: '2 - At another location', value: 2}
]

const distanceOptions = [
  {text: '1 - I\'m too lazy to go anywhere else', value: 500},
  {text: '2 - I don\'t mind a bit of a stroll', value: 1000},
  {text: '3 - Let\'s go on an adventure!' , value: 2400}
]

const priceOptions = [
  {text: '1 - I\'m super broke right now!', value: 1},
  {text: '2 - Something reasoble would be nice', value: 2},
  {text: '3 - I think I can splurge a little bit I suppose', value: 3},
  {text: '4 - Let\'s make it rain! Treat Yo\'self!', value: 4}
]

class Suggester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: 1,
      radius: 500,
      location: 1,
      coords: {latitude: 'unknown', longitude: 'unknown'},
      dislikes: [],
    };

    this.getCoords = this.getCoords.bind(this);
  }

  getCoords(value) {
  if (value === 1) {
      // use geolocation
    } else if (value === 2) {
      // input the adress into googles geocoding
      
      Alert.alert('We\'re gonna use geocoding')
    }  
  }

  getUserInfo() {

  }

  queryYelp() {
    fetch('')
  }

  render() {
    return <ScrollView>
        <Text>
          {'\n'}
          Welcome to the Suggester!{'\n'}
        </Text>
        <Text>
          Don't know what to do for your hangout?
          Just answer a few quick questions and we'll help you figure it out!{'\n'}
        </Text>
        <Text>
          Where do you want to go?
        </Text>
        <PickerIOS
          selectedValue={this.state.location}
          onValueChange={(value) => {
            this.getCoords(value);
            this.setState({location: value});
          }}
        >
          {locationOptions.map((option, index) => (
            <PickerIOS.Item
              key={index}
              value={option.value}
              label={option.text}
            />
          ))}   
        </PickerIOS>
        <Text>
          How from the that place are you willing to go?
        </Text>
        <PickerIOS
          selectedValue={this.state.radius}
          onValueChange={(value) => {
            this.setState({radius: value});
          }}
        >
          {distanceOptions.map((option, index) => (
            <PickerIOS.Item
              key={index}
              value={option.value}
              label={option.text}
            />
          ))}   
        </PickerIOS>
        <Text>
          What are you and your friends willing to spend?
        </Text>
        <PickerIOS
          selectedValue={this.state.budget}
          onValueChange={(value) => {this.setState({budget: value})}}
        >
          {priceOptions.map((option, index) => (
            <PickerIOS.Item
              key={index}
              value={option.value}
              label={option.text}
            />
          ))}   
        </PickerIOS>

        <Button
          title='Get my suggestions!'
          onPress={this.getLocation}
        />
      </ScrollView>
  }
}




export default Suggester;