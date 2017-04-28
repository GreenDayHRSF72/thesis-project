import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-native-elements';
import { ActionCreators } from '../actions';
import endpoint from '../config/global';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

const baseURL = endpoint.baseURL;

const styles = StyleSheet.create({
  place: {
    height: 40,
    backgroundColor: '#27ae60',
    marginBottom: 15,
    color: 'white',
    paddingLeft: 20,
    borderRadius: 8,
  },
  description: {
    color: 'white',
  },
  textContainer: {
    marginLeft: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textInput: {
    margin: 20,
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#2ecc71',
  },
  eventName: {
    marginTop: 15,
    fontSize: 30,
    marginBottom: 2,
    color: 'white',
    fontWeight: '600',
    marginLeft: 20,
  },
  otherText: {
    margin: 5,
    fontSize: 15,
    color: 'white',
    fontWeight: '500',
    paddingLeft: 5,
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

class NewActivity extends Component {
  constructor(props) {
    super(props);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  handleButtonPress() {
    const sug = this; 
    //name, event_id, location
    // const activityName = this.state.activityName.slice(0);
    // const activityLocation = this.state.activityLocation.slice(0);
    if (this.props.suggestedActivity.name === '') {
      alert('Activity Name is empty. Please enter an Activity Name!');
    } else if (this.props.suggestedActivity.location === ''){
      alert('Activity Location is empty. Please enter an Activity Location!')
    } else {
      fetch(`${baseURL}/activities`, {
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
      .then(() => {
        console.log('successfully save activity to DB');
        sug.props.navigation.navigate('EventDetails', sug.props.activeEvent);
      })
      .catch(err => console.log(err));
    }
  }

  render() {
    const { description, endTime, eventDate, id, location, name, photourl, startTime, username } = this.props.activeEvent;
    return (
      <View style={styles.container}>
        <Text style={styles.eventName}>{name}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.description}>{description === null || description === undefined ? 'NO DESCRIPTION' : description}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.textContainer}>
            <Icon type="font-awesome" name="user" size={20} color="#e67e22"/><Text style={styles.otherText}>{username}</Text>
          </View>
          <View style={styles.textContainer}>
            <Icon type="font-awesome" name="location-arrow" size={20} color="#e67e22"/><Text style={styles.otherText}>{location === null || location === undefined ? 'NO LOCATION' : location}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.textContainer}>
            <Icon type="font-awesome" name="calendar" size={20} color="#e67e22"/><Text style={styles.otherText}>{ eventDate.substring(0, 10)}</Text>
          </View>
          <View style={styles.textContainer}>
            <Icon type="font-awesome" name="clock-o" size={20} color="#e67e22"/><Text style={styles.otherText}>{startTime.substring(0, 5)} - {endTime.substring(0, 5)}</Text>
          </View>
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <TextInput
            placeholderTextColor="white"
            style={styles.place}
            clearTextOnFocus={true}
            autoCorrect={false}
            onChangeText={(name) => this.props.saveSuggestedActivityName(name)}
            value={this.props.suggestedActivity.name}
            placeholder="Enter Activity Name"
          />
          <TextInput
            placeholderTextColor="white"
            style={styles.place}
            clearTextOnFocus={true}
            autoCorrect={false}
            onChangeText={(location) => this.props.saveSuggestedActivityLocation(location)}
            value={this.props.suggestedActivity.location}
            placeholder="Enter Activity Location"
          />
          <TouchableOpacity onPress={() => this.handleButtonPress()} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>ADD ACTIVITY TO EVENT</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
