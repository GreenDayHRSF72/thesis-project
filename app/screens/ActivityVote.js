import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import endpoint from '../config/global';
import { Icon } from 'react-native-elements';

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
  infoContainer: {
    width: '75%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  voteContainer: {
    width: '25%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});

class ActivityVote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Info should be stored in redux
    };

    this.vote = this.vote.bind(this);
    this.displayMain = this.displayMain.bind(this);
  }

  displayMain() {
    if (this.props.activity.mainActivity === 1) {
      return '\nCURRENT ACTIVITY';
    }
  }
 
  vote() {
    const actId = this.props.activity.id;
    const userId = this.props.user.id;
    const eventId = this.props.activeEvent.id;

    fetch(`${baseURL}/vote`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actId,
        userId,
        eventId,
      }),
    })
    .then(res => res.json())
    .then((resJson) => {
      if (resJson === 'voted') {
        Alert.alert('You have already voted for this event!');
      } else {
        Alert.alert('Thanks for voting!');
      }
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <View>
        <Text>
          Name: {this.props.activity.name}
        </Text>
        <Text>
        {this.props.activity.location}
        </Text>
        <Text>
          {this.displayMain()}
        </Text>
        </View>
        <View>
          <Text>
          Votes{'\n'}
          {this.props.activity.votes}
          </Text>
          <TouchableOpacity onPress={this.vote} style={styles.voteButton}>
            <Text style={styles.voteTitle}>Vote</Text>
          </TouchableOpacity>
        </View>
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