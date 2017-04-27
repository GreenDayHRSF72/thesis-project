import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import endpoint from '../config/global';

const baseURL = endpoint.baseURL;

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderColor: 'gray',
    width: '98%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 3,
    marginBottom: 3,
    padding: 5,
    backgroundColor: '#27ae60',
    borderRadius: 5,
  },
  username: {
    color: 'white',
    paddingTop: 2,
    fontWeight: 'bold',
    fontSize: 12,
    paddingLeft: 5,
  },
  body: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    color: '#DCDCDC',
  },
});

class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          <Text style={styles.username}>{this.props.post.username.toUpperCase()}:{'\n'}</Text>
          <Text style={styles.body}>{this.props.post.body}</Text>
        </Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    event: state.event,
    user: state.user,
    activeEvent: state.activeEvent,
    activities: state.activities,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);