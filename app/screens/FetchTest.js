import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';
import 

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
      googCall: [],
    };

    this.getHome = this.getHome.bind(this);
    this.getLocation = this.getLocation.bind(this);
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

  add 


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
          The first value in the database is: {this.props.testResults[this.props.testResults.length - 1].value}
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