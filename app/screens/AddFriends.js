import React, { PropTypes } from 'react';
import { View, ListView, StyleSheet, Text, TextInput, TouchableOpacity, AlertIOS } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import util from '../lib/utility';
import endpoint from '../config/global';

const baseURL = endpoint.baseURL;
// TODO: style cancel button
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ecc71',
  },
  formContainer: {
    marginTop: 10,
    padding: 20,
    flexGrow: 1,
  },
  place: {
    height: 40,
    backgroundColor: '#27ae60',
    marginBottom: 15,
    color: 'white',
    paddingLeft: 10,
  },
  buttonContainer: {
    backgroundColor: '#27ae60',
    height: 40,
    marginBottom: 10,
  },
  buttonText: {
    paddingTop: 10,
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
  },
  friendContainer: {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e67e22',
    marginBottom: 10,
  },
  friendText: {
    marginLeft: 12,
    fontSize: 16,
    color: 'white',
  },
  cancelButton: {
    marginLeft: 150,
  },
});

const propTypes = {
  user: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  invitedFriends: PropTypes.array.isRequired,
  saveFriendToInvitationList: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  saveEventId: PropTypes.func.isRequired,
  removeFriendFromInvitationList: PropTypes.func.isRequired,
  saveEvent: PropTypes.func.isRequired,
};

class AddFriends extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      friendList: [],
      friendName: '',
      friendEmail: '',
    };
    this.onPressAddButton = this.onPressAddButton.bind(this);
    this.onPressDoneButton = this.onPressDoneButton.bind(this);
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  onPressAddButton() {
    if (this.state.friendName === '') {
      AlertIOS.alert("Friend name cannot be empty, please enter a friend's name");
    } else if (this.state.friendEmail === '') {
      AlertIOS("Friend email cannot be empty, please enter a friend's email");
    } else {
      const temp = this.props.invitedFriends.slice();
      temp.push({ username: this.state.friendName, email: this.state.friendEmail });
      this.props.saveFriendToInvitationList({ username: this.state.friendName, email: this.state.friendEmail });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(temp),
      });
    }
    this.friendNameInput.setNativeProps({ text: '' });
    this.friendEmailInput.setNativeProps({ text: '' });
  }

  onPressDoneButton() {
    // event will be saved to DB in here
    let eventId = null;
    if (this.props.user.id) {
      fetch(`${baseURL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.props.event.name,
          creator_id: this.props.user.id,
          location: this.props.event.location,
          eventDate: this.props.event.eventDate,
          description: this.props.event.description,
          startTime: util.formatTime(this.props.event.startTime),
          endTime: util.formatTime(this.props.event.endTime),
        }),
      })
      .then(response => response.json())
      .then((responseJson) => {
        eventId = responseJson;
        this.props.saveEventId(eventId);
        return util.addParticipantsToDB(eventId, this.props.invitedFriends, this.props.user, this.props.event.name);
      })
      .then(() => {
        this.props.addCount();
        this.setState({ friendList: [] });
        this.setState({ dataSource: this.state.dataSource.cloneWithRows([]) });
        this.props.saveEvent({});
        this.props.navigation.navigate('Redirect');
      })
      .catch(err => console.log(err));
    } else {
      AlertIOS.alert('user id is not avaiable, please log in again');
    }
  }

  onCancelButtonClick(email) {
    this.props.removeFriendFromInvitationList(email);
    const temp = this.props.invitedFriends.filter(friend => friend.email !== email);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(temp),
    });
  }

  renderRow(rowData) {
    return (
      <View style={styles.friendContainer}>
        <Text style={styles.friendText}>{rowData.username}</Text>
        <View style={styles.cancelButton}>
        <TouchableOpacity onPress={() => this.onCancelButtonClick(rowData.email)}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            ref={(input) => { this.friendNameInput = input; }}
            clearTextOnFocus={true}
            onChangeText={name => this.setState({ friendName: name })}
            style={styles.place}
            autoCorrect={false}
            placeholder="friend's name"
          />
          <TextInput
            ref={(input) => { this.friendEmailInput = input; }}
            clearTextOnFocus={true}
            onChangeText={email => this.setState({ friendEmail: email })}
            style={styles.place}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="friend's email"
          />
          <TouchableOpacity onPress={this.onPressAddButton} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>ADD TO INVITATION LIST</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressDoneButton} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>DONE</Text>
          </TouchableOpacity>
          <Text>A notification email will be sent to friends.</Text>
        </View>
        <View style={{ flexGrow: 10, marginTop: 0, padding: 10 }}>
          <ListView
            enableEmptySections={true}
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
          />
        </View>
      </View>
    );
  }
}


AddFriends.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    event: state.event,
    user: state.user,
    invitedFriends: state.invitedFriends,
    simpleCounter: state.simpleCounter,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFriends);




