import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  voteButton: {
    borderWidth: 0,
    borderRadius: 4,
    height: 20,
    width: 75,
    backgroundColor: '#2980b9',
    overflow: 'hidden',
  },
  voteTitle: {
    textAlign: 'center',
    paddingTop: 5,
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

class ActivityVote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Info should be stored in redux
    }

    this.vote = this.vote.bind(this);
  }

  vote () {
    Alert.alert('I VOTE'); 
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <Text>
          Name: {this.props.activity.name}{'\n'}
          Location: {this.props.activity.location}
        </Text>
        <TouchableOpacity onPress={this.vote} style={styles.voteButton}>
          <Text style={styles.voteTitle}>Vote</Text>
        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(ActivityVote);