import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

const {
  Text,
  View,
  TouchableHighlight,
  ScrollView,
} = ReactNative;

let baseURL;

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://hst-friend-ly.herokuapp.com';
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://hst-friend-ly-staging.herokuapp.com';
} else {
  baseURL = 'http:/127.0.0.1:5000';
}

const propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: 15,
    color: '#2c3e50',
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
  componentWillReceiveProps(nextProps) {
    // if (nextProps !== this.props) {
    //   console.log('yeah');
    // }
    console.log('========will receive props', this.props.user.id);
    fetch('http:127.0.0.1:5000/events/createdBy/' + this.props.user.email)
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log('active events are =========>', responseJson);
      this.setState({ activeEventsByCreator: responseJson });
    })
    .then(() => {
      return fetch(`http:127.0.0.1:5000/events/${this.props.user.id}`);
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log('invited events are ========>', responseJson);
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
    return events.map((item, i) => {
      //console.log(item);
      return (
        <ListItem
          key={i}
          title={item.name === null || undefined ? `EVENT ${i}` : `${item.name.toUpperCase()}`}
          subtitle={item.description === null || undefined ? 'No description' : `${item.description.substring(0, 40)}`}
          onPress={() => this.onLearnMore(item)}
          containerStyle={{ height: 50 }}
          avatar={{ uri: item.photourl }}
          roundAvatar={true}
        />
        );
      });
    }

  render() {
    return <View>
        {this.state.activeEventsByCreator ?
          <ScrollView>
            <Text style={styles.title}>Created Events</Text>
            <List>
              {this.createFeed(this.state.activeEventsByCreator)}
            </List>
          </ScrollView> : null
        }

        {this.state.invitedEventsByParticipantId ?
          <ScrollView>
            <Text style={styles.title}>Invited Events</Text>
            <List>
              {this.createFeed(this.state.invitedEventsByParticipantId)}
            </List>
          </ScrollView> : null
        }
      </View>
  }
}

EventsList.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    user: state.user,
    event: state.event,
    simpleCounter: state.simpleCounter,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
