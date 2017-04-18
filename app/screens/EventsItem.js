import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalDropdown from 'react-native-modal-dropdown';
import { ActionCreators } from '../actions';
import { ListItem, List, Icon } from 'react-native-elements';

const {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} = ReactNative;

let baseURL;

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://hst-friend-ly.herokuapp.com';
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://hst-friend-ly-staging.herokuapp.com';
} else {
  baseURL = 'http:/127.0.0.1:5000';
}

const styles = StyleSheet.create({
  textContainer: {
    marginLeft: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  container: {
    flex: 1,
    backgroundColor: '#2ecc71',
  },
  eventName: {
    marginTop: 10,
    fontSize: 25,
    marginBottom: 10,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  otherText: {
    margin: 5,
    fontSize: 15,
    color: 'white',
    fontWeight: '500',
    paddingLeft: 10,
  },
  hostImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 150,
  },
  rsvpContainer: {
    marginLeft: 40,
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inviteeContainer: {
    marginLeft: 40,
    marginTop: 20,
    //backgroundColor: 'white',
  },
  inviteeTitle: {
    fontSize: 20,
    color: 'white',
    marginLeft: 40,
    marginTop: 20,
  },
  participant: {
    fontSize: 15,
    color: 'white',
    fontWeight: '400',
  },
});

class EventsItem extends Component {
  constructor(props) {
    super(props);
    this.state = { participants: [] };
  }

  componentWillMount() {
    this.getParticipantsAndStatus();
  }

  getParticipantsAndStatus() {
    const { id } = this.props.navigation.state.params;

    // request all events from db
    fetch(baseURL + '/events/participants/list/:' + id)
    .then(response => response.json())
    .then((responseJSON) => {
      this.setState({ participants: responseJSON });
    });
  }

  rsvp() {
    return this.state.participants.map((participant, i) => {
      const { id, name } = this.props.navigation.state.params;
      console.log('participants id', id, this.props.navigation.state.params);
      return (
        <View key={i}>
          { this.props.user.id === participant.user_id && 
            <View style={styles.rsvpContainer}>
              <Text style={styles.otherText}>RSVP Here:  </Text>
              <ModalDropdown
                dropdownStyle={{ width: 100 }}
                style={{ borderWidth: 0.5, borderRadius: 4, height: 30, width: 60, backgroundColor: '#2980b9', flex: 1, alignItems: 'center', marginRight: 40 }}
                textStyle={{ color: '#fff', fontSize: 20, fontWeight: '600' }}
                adjustFrame={style => this.adjustFrame(style)}
                options={['yes', 'no', 'maybe']}
                defaultValue={participant.status}
                defaultIndex={['yes', 'no', 'maybe'].indexOf(participant.status)}
                onSelect={(idx, value) => this.changeResponse(idx, value, participant, id, name)}
              />
            </View>
          }
        </View>
      );
    });
  }


  createParticipants() {
    return this.state.participants.map((participant, i) => {
      return (
        <View key={i}>
          <Text style={styles.participant}>{participant.username}   {participant.status}</Text>
        </View>
        // <ListItem key={i} title={participant.username}/>
      );
    });
  }

  adjustFrame(style) {
    style.height -= 65;
    return style;
  }
  changeResponse(idx, value, participant, eventID, eventname) {
    fetch( baseURL + '/events/participants/rsvp', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId: eventID,
        participantId: participant.id,
        participantName: participant.username,
        participantStatus: value,
        eventName: eventname,
      }),
    })
    .then((data) => {
      console.log(data);
      this.getParticipantsAndStatus();
    })
    .catch(err => console.log(err));
  }

  render() {
    const { name, description, eventDate, location, startTime, endTime, username, photourl } = this.props.navigation.state.params;
    //console.log('this.state.participants', this.state.participants);
    return (
      <View style={styles.container}>
        <Text style={styles.eventName}>{name}</Text>
        <Image
          style={styles.hostImage}
          source={{ uri: photourl }}
        />
        <View style={styles.textContainer}>
          <Icon type="font-awesome" name="user" size={20} color="#e67e22"/><Text style={styles.otherText}>Hosted by: {username}</Text>
        </View>
        <View style={styles.textContainer}>
          <Icon type="font-awesome" name="commenting" size={20} color="#e67e22"/><Text style={styles.otherText}>{description === null || description === undefined ? 'NO DESCRIPTION' : description}</Text>
        </View>
        <View style={styles.textContainer}>
          <Icon type="font-awesome" name="calendar" size={20} color="#e67e22"/><Text style={styles.otherText}>{ eventDate.substring(0, 10)}</Text>
        </View>
        <View style={styles.textContainer}>
          <Icon type="font-awesome" name="location-arrow" size={20} color="#e67e22"/><Text style={styles.otherText}>{location === null || location === undefined ? 'NO LOCATION' : location}</Text>
        </View>
        <View style={styles.textContainer}>
          <Icon type="font-awesome" name="clock-o" size={20} color="#e67e22"/><Text style={styles.otherText}>Starts: {startTime.substring(0, 5)}</Text>
        </View>
        <View style={styles.textContainer}>
          <Icon type="font-awesome" name="clock-o" size={20} color="#e67e22"/><Text style={styles.otherText}>Ends: {endTime.substring(0, 5)}</Text>
        </View>
        <View>
          {this.rsvp()}
        </View>
        <Text style={styles.inviteeTitle}>Invitees:</Text>
        <ScrollView style={styles.inviteeContainer}>
          {this.createParticipants()}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { simpleCounter: state.simpleCounter, user: state.user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsItem);
