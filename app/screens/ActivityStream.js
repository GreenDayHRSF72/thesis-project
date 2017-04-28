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
  TouchableHighlight,
  ScrollView,
} = ReactNative;

const styles = StyleSheet.create({
  textContainer: {
    marginLeft: 15,
    marginTop: 10,
  },
  container: {
    backgroundColor: '#2ecc71',
  },
  titleText: {
    padding: 10,
    fontSize: 30,
    marginTop: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  defaultText: {
    textAlign: 'center',
    marginTop: 15,
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
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
      let duplication = false;
      this.state.activities.forEach((activity) => {
        if (activity.activity === data.activity) {
          duplication = true;
          return duplication;
        }
        return duplication;
      });
      if (!duplication) {
        this.state.activities.push(data);
        this.setState({ current: this.state.activities[this.state.activities.length - 1].activity, currentImg: this.state.activities[this.state.activities.length - 1].authorImage });
      }
    });
  }

  onLearnMore(event) {
    this.props.navigation.navigate('EventDetails', { ...event });
  }

  createFeed() {
    return this.state.activities.map((item, i) => {
      return (
        <TouchableHighlight key={i} onPress={() => this.onLearnMore(item.eventDetails)}>
          <View key={i} style={{ marginLeft: 'auto', marginRight: 'auto', padding: 10, width: '98%', backgroundColor: '#27ae60', borderRadius: 5, }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ width: 50, height: 50, borderRadius: 25 }}
                source={{ uri: item.authorImage }}
              />
              <View style={styles.textContainer}>
                <View style={{ flexWrap: 'wrap' }}>
                  <Text style={{ fontWeight: '600', color: 'white' }}>{item.author}{'\n'}{item.activity}.</Text>
                </View>
                <Text style={{ color: '#D3D3D3' }}>{moment(item.createdAt).fromNow()}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      );
    });
  }


  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.titleText}>
            Live Feed
          </Text>
        </View>
        <View>
          { this.state.activities.length === 0 ? (<Text style={styles.defaultText}>Nothing is happening at the moment.{'\n'}Please do the things!</Text>) : this.createFeed() }
        </View>
      </ScrollView>
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
