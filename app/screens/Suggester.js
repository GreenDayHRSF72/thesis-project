import React, { Component } from 'react';
import ReactNative from 'react-native';
import Prompt from 'react-native-prompt';
import Geocoder from 'react-native-geocoding';
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
  {text: 'Please select an option below', value: 0},
  {text: 'Close to my current location', value: 1},
  {text: 'At another location', value: 2}
];

const distanceOptions = [
  {text: 'I\'m too lazy to go anywhere else', value: 500},
  {text: 'I don\'t mind a bit of a stroll', value: 1000},
  {text: 'Let\'s go on an adventure!' , value: 2400}
];

const priceOptions = [
  {text: 'I don\'t have much of a preference', value: '1,2,3,4'},
  {text: 'I\'m super broke right now!', value: '1'},
  {text: 'Something reasonable would be nice', value: '1,2'},
  {text: 'I think I can splurge a little bit I suppose', value: '2,3'},
  {text: 'Let\'s make it rain! Treat Yo\'self!', value: '4'}
];

const freshOptions = [
  {text: 'I really don\'t care', value: false},
  {text: 'I would prefer to try something new', value: true}
];

class Suggester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationVisible: false,
      budget: '1,2,3,4',
      radius: 500,
      location: 0,
      coords: {latitude: 0, longitude: 0},
      openNow: '',
      dislikes: [],
      findNew: false,
    };

    // bind all the things
    this.getCoords = this.getCoords.bind(this);
    this.alertState = this.alertState.bind(this);
    this.geocodeLocation = this.geocodeLocation.bind(this);
  }

  getCoords(value) {
  var suggester = this;
  if (value === 1) {
      navigator.geolocation.getCurrentPosition((position) => {
        suggester.setState({coords: {latitude: position.coords.latitude, longitude: position.coords.longitude}})
      })
    } else if (value === 2) {

      suggester.setState({locationVisible: true});
      // this will open up the address asker, which will then get your coords
    }  
  }

  geocodeLocation(submit) { 
    var suggester = this;
    Geocoder.setApiKey('AIzaSyAx_7pT4ayHbBHuVOYK0kjPfqmEUfRHcQo');
    Geocoder.getFromLocation(submit).then((json) => {
      var location = json.results[0].geometry.location;
      // I'm assuming that coords are found here, so.... yeah...
      //come back and refactor it to default to another set of coords if neccesary
      suggester.setState({coords: {latitude: location.lat, longitude: location.lng}});
    }).catch((err) => {Alert.alert('Something went Wrong');});
  }

  getUserInfo() {

  }

  alertState() {
    var suggester = this;
    var coords = JSON.stringify(suggester.state.coords.latitude) + ', ' + JSON.stringify(suggester.state.coords.longitude);
    var radius = JSON.stringify(suggester.state.radius);
    var price = JSON.stringify(suggester.state.budget);
    Alert.alert(`You want to be within ${radius} meters of ${coords}\n You want to only spend ${price} out of 4`)
  }

  queryYelp() {

    fetch('https://api.yelp.com/v3/businesses/search', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'x3QcdEQMOwKXj-1XI_KUrpaVHvGw6PFKtrCA7lt3RPAnPdDnpEuzfcGZoaWNLERaxivB4uA09qnMGoTi2HWFweXymIABaMFXKbN-01E5dEsoCG3quOnQTVdILqXtWHYx'
      },
    })
    .then((res) => {
      Alert.alert(res);
    })
    .catch((error) => {
      Alert.alert('Error', JSON.stringify(error));
    })
  }

  render() {
    return <ScrollView>
        <Text>
          {'\n'}
          Welcome to the Suggester!{'\n'}
          INSERT AN IMAGE HERE AND MAKE SURE ITS FUN{'\n'}
        </Text>
        <Text>
          Don't know what to do for your hangout?
          Just answer a few quick questions and we'll find something for you!{'\n'}
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
        <Prompt
          title='Please enter the address of where you want to be'
          placeholder='ex. 944 Market Street (or) Halal Guys, San Francisco'
          visible={this.state.locationVisible}
          onCancel={() => {
            this.setState({locationVisible: false});

          }}
          onSubmit={(value) => {
            this.setState({locationVisible: false});
            this.geocodeLocation(value);

          }}
        />
        <Text>
          How far from the that place are you willing to go?
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
          What are you willing to spend?
        </Text>
        <PickerIOS
          selectedValue={this.state.budget}
          onValueChange={(value) => {
            this.setState({budget: value})
          }}
        >
          {priceOptions.map((option, index) => (
            <PickerIOS.Item
              key={index}
              value={option.value}
              label={option.text}
            />
          ))}   
        </PickerIOS>
         <Text>
          Are you looking to spice things up a bit?
        </Text>
        <PickerIOS
          selectedValue={this.state.findNew}
          onValueChange={(value) => {
            this.setState({findNew: value})
          }}
        >
          {freshOptions.map((option, index) => (
            <PickerIOS.Item
              key={index}
              value={option.value}
              label={option.text}
            />
          ))}   
        </PickerIOS>

        <Button
          title='Get my suggestions!'
          onPress={this.queryYelp}
        />
        <Text 
          style={{textAlign: 'center'}}
        >
          Powered by Google Maps, Yelp, and You!
        </Text>
      </ScrollView>
  }
}

export default Suggester;