import { View, StyleSheet, TextInput, Text, KeyboardAvoidingView, Image, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import MyDatePicker from './MyDatePicker';

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#2ecc71',
  },
  place: {
    height: 40,
    backgroundColor: '#27ae60',
    marginBottom: 15,
    color: 'white',
    paddingLeft: 20,
  },
  titleContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    marginTop: 10,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    opacity: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 10,
    padding: 20,
    flexGrow: 10,
  },
  buttonContainer: {
    backgroundColor: '#27ae60',
    height: 35,
  },
  buttonText: {
    paddingTop: 10,
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
  },
});

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      description: '',
      name: '',
    };
    this.onPressButton = this.onPressButton.bind(this);
  }

  onPressButton() {
    if (this.props.event.date === null) {
      alert('date is empty, please pick a date');
    } else if (this.state.location === '') {
      alert('event name/location is empty, please enter event name or location');
    } else if (this.props.event.startTime === null) {
      alert('please pick event start time');
    } else if (this.props.event.endTime === null) {
      alert('please pick event end time');
    } else {
      const event = {
        name: this.state.name,
        location: this.state.location,
        description: this.state.description,
        // date and time are retrieved from Redux store
        eventDate: this.props.event.date,
        startTime: this.props.event.startTime,
        endTime: this.props.event.endTime,
      };
      // save event to Redux
      this.props.saveEvent(event);
      //clean textInput form
      this.eventNameInput.setNativeProps({ text: '' });
      this.eventLocationInput.setNativeProps({ text: '' });
      this.eventDescriptionInput.setNativeProps({ text: '' });
      // navigate to AddFriends page after saving event to Redux
      this.props.navigation.navigate('AddFriends');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Image
            style={{ width: 100, height: 100, justifyContent: 'center' }}
            source={require('../img/congratulations.png')}
          />
          <Text style={styles.title}>
            Your Event with Friends Starts from Here!
          </Text>
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <TextInput
            ref={(input) => { this.eventNameInput = input; }}
            clearTextOnFocus={true}
            onChangeText={name => this.setState({ name })}
            style={styles.place}
            autoCorrect={false}
            placeholder="enter an event name"
          />
          <TextInput
            ref={(input) => { this.eventLocationInput = input; }}
            clearTextOnFocus={true}
            onChangeText={location => this.setState({ location })}
            style={styles.place}
            autoCorrect={false}
            value={this.props.event.location}
            placeholder="enter a location"
          />
          <TextInput
            ref={(input) => { this.eventDescriptionInput = input; }}
            clearTextOnFocus={true}
            onChangeText={description => this.setState({ description })}
            style={styles.place}
            autoCorrect={false}
            placeholder="short description"
          />
          <MyDatePicker />
          <TouchableOpacity onPress={this.onPressButton} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { event: state.event };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Event);


