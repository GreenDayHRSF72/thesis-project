import React, { Component } from 'react';
import ReactNative from 'react-native';
import Prompt from 'react-native-prompt';
import Geocoder from 'react-native-geocoding';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

const {
  View,
  Text,
  Button,
  Alert,
} = ReactNative;


let baseURL;

// allows for multiuse url
if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://hst-friend-ly.herokuapp.com';
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://hst-friend-ly-staging.herokuapp.com';
} else {
  baseURL = 'http://127.0.0.1:5000';
}

class SuggesterResultsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
      return (<View>
        <Text>
          You have reached the page
        </Text>
      </View>)
  }
}

export default SuggesterResultsItem;