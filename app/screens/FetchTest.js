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
  Alert,
} = ReactNative;


class FetchTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeText: 'PLACEHOLDER',
      yelpCall: [],
      geoCall: [],
      googCall: [],
    };

    this.getHome = this.getHome.bind(this);
  }

  getHome() {
    fetch('https://hst-friend-ly.herokuapp.com/');


  }



  render() {
    return <View>
        <Text>
          Click the buttons below to test out out connection \n \n
        </Text>
        <Text>
          The text from the homepage is: {this.state.homeText}
        </Text>
        <Button
          title='Click to get text from homepage'
          onPress={this.getHome}
        />
         <Text>
          Your current coords are: {this.state.geoCall}
        </Text>
        <Button
          title='Click to get current location'
          onPress={this.getHome}
        />
         <Text>
         Your current google query has yielded: {this.state.geoCall}
        </Text>
        <Button
          title='Click to get current location'
          onPress={this.getHome}
        />

      </View>
  }
}


export default FetchTest;