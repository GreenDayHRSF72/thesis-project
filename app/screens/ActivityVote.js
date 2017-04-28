import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import endpoint from '../config/global';
import { Icon } from 'react-native-elements';

const baseURL = endpoint.baseURL;

const styles = StyleSheet.create({
  container: {
    width: '98%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: '#27ae60',
    borderRadius: 5,
    flexWrap:  'wrap',
    flexDirection: 'row',
  },
  voteButton: {
    borderWidth: 0,
    borderRadius: 5,
    height: 60,
    width: 60,
    overflow: 'hidden',
  },
  voteTitle: {
    paddingTop: 5,
    paddingLeft: 5,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  voteLocation: {
    paddingBottom: 5,
    paddingLeft: 5,
    color: 'white',
    fontSize: 15,
    color: '#DCDCDC',

  },
  infoContainer: {
    width: '75%',
    borderRadius: 5,
  },
  voteContainer: {
    width: 50,
    marginLeft: 40,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  image: {
    height: 45,
    width: 45,
  },
  headline: {
    paddingTop: 12,
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
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
      return(<Text style={{ color: "#e67e22", fontWeight: 'bold', paddingLeft: 5, }}>MAIN ACTIVITY</Text>);
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
        <View style={styles.infoContainer}>
          <Text style={styles.voteTitle}>{this.props.activity.name}</Text>
          <Text style={styles.voteLocation}>{this.props.activity.location}</Text>
          {this.displayMain()}
        </View>
        <View style={styles.voteContainer}>
          <TouchableOpacity onPress={this.vote} style={styles.voteButton}>
            <Image
            style={styles.image}
            source={require('../img/heart.gif')}
            >
              <View>
                <Text style={styles.headline}>{this.props.activity.votes}</Text>
              </View>
            </Image>
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