import React, { Component, PropTypes } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

const {
  View,
  Text,
  TouchableHighlight,
  ScrollView
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
}

class EventsList extends Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
  }

  componentWillMount() {
    // request all events from db
    fetch(baseURL + '/events')
    .then(response => response.json())
    .then((responseJSON) => {
      this.setState({ events: responseJSON });
    });
  }

  onLearnMore(event) {
    this.props.navigation.navigate('EventDetails', { ...event });
  }

  createFeed() {
      return this.state.events.map((item, i) => {
        return (
          <ListItem
            key={item.id}
            title={`${item.name.toUpperCase()}`}
            subtitle={`${item.description.substring(0, 40)}`}
            onPress={() => this.onLearnMore(item)}
          />
        );
      });
    }

  render() {
    return <View>
      <Text style={{ marginTop: 20 }}>
        this is the counter for testing(Redux template)!
        count: {this.props.simpleCounter}
      </Text>
      <TouchableHighlight onPress={() => { this.props.addCount(); }}>
        <Text>click to add</Text>
      </TouchableHighlight>
      <ScrollView>
        <List>
          {this.createFeed()}
        </List>
      </ScrollView>
      </View>
  }
}

EventsList.propTypes = propTypes;

function mapStateToProps(state) {
  return { simpleCounter: state.simpleCounter };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
