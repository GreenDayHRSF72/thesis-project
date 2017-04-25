import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactNative from 'react-native';
import { bindActionCreators } from 'redux';
import SocketIOClient from 'socket.io-client';
import moment from 'moment';
import { ActionCreators } from '../actions';
import endpoint from '../config/global';

const baseURL = endpoint.baseURL;

const {
  View,
  Text,
  Image,
  StyleSheet,
} = ReactNative;

const date = new Date().toLocaleTimeString();

const styles = StyleSheet.create({
  textContainer: {
    marginLeft: 15,
    marginTop: 10,
    width: 200,
  },
  titleContainer: {
    margin: 15,
  },
  titleText: {
    padding: 10,
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    color: '#27ae60',
  },
});

class ActivityStream extends Component {
  constructor(props) {
    super(props);
    this.state = { activities: [], current: '', currentImg: '' };
    this.socket = SocketIOClient(baseURL, { jsonp: false });
  }

  componentDidMount() {
    this.socket.on('refresh feed', (data) => {
      console.log('data from socket refresh feed', data);
      this.state.activities.push(data);
      this.setState({ current: this.state.activities[this.state.activities.length - 1].activity, currentImg: this.state.activities[this.state.activities.length - 1].authorImage });
    });
  }

  createFeed() {
    return this.state.activities.map((item, i) => {
      return (
        <View key={i} style={{ padding: 8, borderBottomWidth: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 25 }}
              source={{ uri: item.authorImage }}
            />
            <View style={styles.textContainer}>
              <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontWeight: '600' }}>{item.author}</Text>
              <Text> {item.activity}</Text>
              </View>
              <Text style={{ color: 'grey' }}>{moment(item.createdAt).fromNow()}</Text>
            </View>
          </View>
        </View>
      );
    });
  }


  render() {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          Live Feed
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
