import { View, StyleSheet, TextInput, Text, KeyboardAvoidingView, Image, TouchableOpacity, Alert } from 'react-native';
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
    borderRadius: 8,
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
    backgroundColor: '#e67e22',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
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
    this.onPressButton = this.onPressButton.bind(this);
  }

  onPressButton() {
    if (this.props.event.date === null || this.props.event.date === '') {
      alert('date is empty, please pick a date');
    } else if (this.props.event.location === '' || this.props.event.name === '') {
      alert('event name/location is empty, please enter event name and/or location');
    } else if (this.props.event.description === '') {
      alert('please enter an event description');
    } else if (this.props.event.startTime === null || this.props.event.startTime === '') {
      alert('please pick event start time');
    } else if (this.props.event.endTime === null || this.props.event.endTime === '') {
      alert('please pick event end time');
    } else {
      const event = {
        name: this.props.event.name,
        location: this.props.event.location,
        description: this.props.event.description,
        // date and time are retrieved from Redux store
        eventDate: this.props.event.date,
        startTime: this.props.event.startTime,
        endTime: this.props.event.endTime,
      };
      // save event to Redux
      this.props.saveEvent(event);
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
            Your Event with Friends Starts from Here! If you are unsurof what to do, Please check out our Suggester, or type "HALP!" in the event name box.
          </Text>
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <TextInput
            clearTextOnFocus={true}
            onChangeText={(name) => {
              this.props.changeEventNam(name);
              if (this.props.event.name === 'HALP') {
                this.props.changeEventNam('');
                this.props.navigation.navigate('Suggester');
              }
            }}
            style={styles.place}
            autoCorrect={false}
            value={this.props.event.name}
            placeholder="enter an event name, or... HALP!"
            placeholderTextColor="white"
          />
          <TextInput
            clearTextOnFocus={true}
            onChangeText={location => this.props.changeEventLoc(location)}
            style={styles.place}
            autoCorrect={false}
            value={this.props.event.location}
            placeholder="enter a location"
            placeholderTextColor="white"
          />
          <TextInput
            clearTextOnFocus={true}
            onChangeText={description => this.props.changeEventDes(description)}
            style={styles.place}
            autoCorrect={false}
            value={this.props.event.description}
            placeholder="short description"
            placeholderTextColor="white"
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


