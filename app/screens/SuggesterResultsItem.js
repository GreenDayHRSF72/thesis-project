import React, { Component } from 'react';
import ReactNative from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

const {
  WebView,
} = ReactNative;

class SuggesterResultsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<WebView
      source={{uri: 'https://www.google.com'}}
    />)
  }
}

export default SuggesterResultsItem;