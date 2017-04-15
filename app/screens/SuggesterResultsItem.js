import React, { Component } from 'react';
import ReactNative from 'react-native';

const {
  WebView,
} = ReactNative;

class SuggesterResultsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.navigation.state.params.link,
    };
  }

  render() {
    const comp = this;
    return (<WebView
      source={{ uri: comp.state.link }}
    />);
  }
}

export default SuggesterResultsItem;
