import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import endpoint from '../config/global';
import util from '../lib/utility';

const baseURL = endpoint.baseURL;

const {
  Text,
  ScrollView,
  View,
} = ReactNative;

const propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#2ecc71',
  },
  header: {
    backgroundColor: '#27ae60',
  },
  title: {
    textAlign: 'center',
    marginTop: 15,
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

class EventsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeEventsByCreator: [],
      invitedEventsByParticipantId: [],
    };
  }

  // when props changes (including props received from Redux store),
  // this function will be called. (nextProps must be put there)
  //TODO: this function is being called very often, need to change the logic
  componentWillReceiveProps(nextProps) {
    fetch(baseURL + '/events/createdBy/' + this.props.user.email)
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log('active events are =========>', responseJson);
      //this.props.saveCreatedEvents(responseJson);
      this.setState({ activeEventsByCreator: responseJson });
    })
    .then(() => {
      return fetch(`${baseURL}/events/${this.props.user.id}`);
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ invitedEventsByParticipantId: responseJson });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onLearnMore(event) {
    this.props.navigation.navigate('EventDetails', { ...event });
  }

  createFeed(events) {
    const reversedEvents = [].concat(events).reverse();
    return reversedEvents.map((item, i) => {
      if (!util.isEventPast(item)) {
        if (i === 0) {
          return (
            <ListItem
              key={i}
              rightTitle='NEW!'
              rightTitleContainerStyle={{ flex: 0.3 }}
              titleStyle={{ fontWeight: '500' }}
              rightTitleStyle={{ color: 'orange', fontWeight: '600' }}
              title={item.name === null || item.name === undefined ? `EVENT ${i}` : `${item.name.toUpperCase().substring(0, 20)}`}
              subtitle={item.eventDate.substring(0, 10)}
              onPress={() => this.onLearnMore(item)}
              containerStyle={{ height: 50 }}
              avatar={{ uri: item.photourl }}
              roundAvatar={true}
            />
          );
        } else {
          return (
            <ListItem
              key={i}
              titleStyle={{ fontWeight: '500' }}
              title={item.name === null || item.name === undefined ? `EVENT ${i}` : `${item.name.toUpperCase().substring(0, 24)}`}
              subtitle={item.eventDate.substring(0, 10)}
              onPress={() => this.onLearnMore(item)}
              containerStyle={{ height: 50 }}
              avatar={{ uri: item.photourl }}
              roundAvatar={true}
            />
          );
        }
      }
    });
  }

  render() {
    if (this.props.user.name !== undefined) {
      return (<ScrollView style={styles.container}>
        {this.state.activeEventsByCreator ?
          <ScrollView style={styles.header}>
            <Text style={styles.title}>Created Events</Text>
            <List>
              {this.createFeed(this.state.activeEventsByCreator)}
            </List>
          </ScrollView> : null
        }

        {this.state.invitedEventsByParticipantId ?
          <ScrollView style={styles.header}>
            <Text style={styles.title}>Invited Events</Text>
            <List>
              {this.createFeed(this.state.invitedEventsByParticipantId)}
            </List>
          </ScrollView> : null
        }
      </ScrollView>);
    } else {
      return (<View style={styles.container}>
        <Text style={styles.title}> You must be logged in to view your Created Events and the Events you have been invited to!</Text>
      </View>);
    }
  }
}

EventsList.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    user: state.user,
    event: state.event,
    createdEvents: state.createdEvents,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
