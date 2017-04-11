import React, { Component } from 'react';
import ReactNative from 'react-native';
import Prompt from 'react-native-prompt';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';


const {
  View,
  Text,
  TouchableHighlight,
  Button, 
  Alert,
  TextInput,
} = ReactNative;


class FetchTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeText: 'PLACEHOLDER',
      yelpCall: [],
      googCall: [],
      messageText: '',
    };

    this.getHome = this.getHome.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.addToTest = this.addToTest.bind(this);
  }

  getHome() {
    fetch('https://hst-friend-ly-staging.herokuapp.com/test')
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.getTestData(responseJson);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  addToTest() {
    var screen = this;
    fetch('https://hst-friend-ly-staging.herokuapp.com/test', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'.
      },
      body: JSON.Stringify({
        value: screen.state.messageText
      })
    })
  }


  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.getGeolocation(position.coords);
      }
    )
  }



  render() {
    return <View>
        <Text>
          Click the buttons below to test out out connection
        </Text>
        <Text>
          The most recent value in the database is: {this.props.testResults[this.props.testResults.length - 1].value}
        </Text>
        <Button
          title='Click to get text from homepage'
          onPress={this.getHome}
        />
         <Text>
          Your current Latitude is: {this.props.locationResults.latitude}
          Your current Longitude is: {this.props.locationResults.longitude}
        </Text>
        <Button
          title='Click to get current location'
          onPress={this.getLocation}
        />
        <Text>
          Enter some text in the input and click the button below to post a {\n} 
          message to the test database!
        </Text>

      <TextInput
        placeholder="Type you message here"
        style={{height: 40}}
        onChangeText{(text) => this.setState(messageText: text)}
      />
      </View>
  }
}

function mapStateToProps(state) { 
  return {testResults: state.testResults, locationResults: state.locationResults};
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators(ActionCreators, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps) (FetchTest);