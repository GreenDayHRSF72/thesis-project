import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactNative from 'react-native';
import { bindActionCreators } from 'redux';
import SocketIOClient from 'socket.io-client';
import { ActionCreators } from '../actions';

let baseURL;

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://hst-friend-ly.herokuapp.com';
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://hst-friend-ly-staging.herokuapp.com';
} else {
  baseURL = 'localhost:5000';
}

const {
  View,
  Text,
  Image,
} = ReactNative;


class ActivityStream extends Component {
  constructor(props) {
    super(props);
    this.state = { activities: [], current: '', currentImg: '' };
    this.socket = SocketIOClient(baseURL, { jsonp: false });
    this.socket.on('refresh feed', (data) => {
      this.state.activities.push(data);
      this.setState({ current: this.state.activities[this.state.activities.length - 1].activity, currentImg: this.state.activities[this.state.activities.length - 1].authorImage });
    });
  }

  createFeed() {
    return this.state.activities.map((item, i) => {
      return (
        <View key={i} style={{ borderWidth: 1, borderRadius: 5, padding: 20 }}>
          <Image
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={{ uri: item.authorImage }}
          />
          <Text>{item.activity}</Text>
        </View>
      );
    });
  }

  render() {
    return (
      <View>
        <Text style={{ marginTop: 20, textAlign: 'center' }}>
          this is the live feed for testing!
        </Text>
        {this.createFeed()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { simpleCounter: state.simpleCounter };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityStream);
