import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-native-elements';
import { ActionCreators } from '../actions';
import endpoint from '../config/global';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Image,
} from 'react-native';

const baseURL = endpoint.baseURL;

const styles = StyleSheet.create({
  textInput: {
    margin: 20,
    height: 40,
  },
});

class NewActivity extends Component {
  constructor(props) {
    super(props);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  handleButtonPress() {
    //name, event_id, location
    // const activityName = this.state.activityName.slice(0);
    // const activityLocation = this.state.activityLocation.slice(0);
    fetch( `${baseURL}/activities`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.props.suggestedActivity.name,
        event_id: this.props.activeEvent.id,
        location: this.props.suggestedActivity.location,
      }),
    })
    .then((data) => {
      console.log('successfully save activity to DB');
    })
    .catch(err => console.log(err));
  }

  render() {
    const { description, endTime, eventDate, id, location, name, photourl, startTime, username } = this.props.activeEvent;
    return (
      <View>
        <Text>{name}</Text>
        <Text>{description}</Text>
        <Text>{location}</Text>
        <Text>host: {username}</Text>
        <Text>start time: {startTime}</Text>
        <Text>end time: {endTime}</Text>
        <TextInput
          style={styles.textInput}
          clearTextOnFocus={true}
          autoCorrect={false}
          onChangeText={(name) => this.props.saveSuggestedActivityName(name)}
          value={this.props.suggestedActivity.name}
          placeholder="enter a place name"
        />
        <TextInput
          style={styles.textInput}
          clearTextOnFocus={true}
          autoCorrect={false}
          onChangeText={(location) => this.props.saveSuggestedActivityLocation(location)}
          value={this.props.suggestedActivity.location}
          placeholder="enter an address"
        />
        <Button
          onPress={() => this.handleButtonPress()}
          title="OK"
          color="#841584"
          accessibilityLabel="Ok, Great!"
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeEvent: state.activeEvent,
    suggestedActivity: state.suggestedActivity,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewActivity);
