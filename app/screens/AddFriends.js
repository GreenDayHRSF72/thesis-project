import React, { PropTypes } from 'react';
import { View, ListView, StyleSheet, Text, TextInput, TouchableOpacity, AlertIOS } from 'react-native';
import { Icon } from 'react-native-elements';
import Autocomplete from 'react-native-autocomplete-input';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import util from '../lib/utility';
import endpoint from '../config/global';

const baseURL = endpoint.baseURL;
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
    borderRadius: 8,
    overflow: 'hidden',
  },
  inviteContainer: {
    backgroundColor: '#2980b9',
    height: 40,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  doneContainer: {
    backgroundColor: '#e67e22',
    height: 40,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
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
    borderRadius: 8,
    marginLeft: 15,
    marginRight: 20,
  },
  friendText: {
    marginLeft: 12,
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    marginLeft: 150,
  },
  cancelText: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
    margin: 5,
  },
  nameInputContainer: {
    height: 40,
    borderWidth: 0,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#27ae60',
  },
  autocompleteContainer: {
  },
  cancelContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  friendNameContainer: {
    flex: 4,
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
      facebook_friends: [],
      queryName: '',
      users: [],
    };
    this.onPressAddButton = this.onPressAddButton.bind(this);
    this.onPressDoneButton = this.onPressDoneButton.bind(this);
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  onPressAddButton() {
    if (this.state.queryName === '') {
      AlertIOS.alert("Friend name cannot be empty, please enter a friend's name");
    } else if (this.state.friendEmail === '') {
      AlertIOS.alert("Friend email cannot be empty, please enter a friend's email");
    } else {
      const temp = this.props.invitedFriends.slice();
      temp.push({ username: this.state.queryName, email: this.state.friendEmail });
      this.props.saveFriendToInvitationList({ username: this.state.queryName, email: this.state.friendEmail });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(temp),
      });
    }
    this.setState({ queryName: '' });
    this.setState({ friendEmail: '' });
    //this.friendNameInput.setNativeProps({ text: '' });
    //this.friendEmailInput.setNativeProps({ text: '' });
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
        //this.props.saveEvent({});
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
        <View style={styles.friendNameContainer}>
        <Text style={styles.friendText}>{rowData.username}</Text>
        </View>
        <View style={styles.cancelContainer}>
        <TouchableOpacity onPress={() => this.onCancelButtonClick(rowData.email)}>
          <View>
          <Icon type="font-awesome" name="close" size={20} color="white" />
          </View>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  componentDidMount() {
    this.setState({ facebook_friends: this.props.user.friends.data });
    fetch(`${baseURL}/users`)
    .then((response) => response.json())
    .then((responseJson) => {
     // console.log('users are =========>', responseJson);
      this.setState({ users: responseJson });
    })
    .catch((err) => {
      AlertIOS.alert('user info not available');

    });
  }

  findFriends(queryName) {
    if (queryName === '') {
      return [];
    }
    //return this.props.user.friends.data;
    const { facebook_friends } = this.state;
    const regex = new RegExp(`${queryName.trim()}`, 'i');
    return facebook_friends.filter(friend => friend.name.search(regex) >= 0);
  }

  render() {
    const { queryName } = this.state;
    const facebook_friends = this.findFriends(queryName);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Autocomplete
            style={{ height: 40, color: 'white', padding: 10 }}
            clearTextOnFocus={true}
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.autocompleteContainer}
            inputContainerStyle={styles.nameInputContainer}
            data={facebook_friends.length === 1 && comp(queryName, facebook_friends[0].name) ? [] : facebook_friends}
            defaultValue={queryName}
            onChangeText={text => this.setState({ queryName: text })}
            placeholder="Enter a friend's name"
            placeholderTextColor="white"
            renderItem={({ name }) => (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ queryName: name });
                  const selectedUser = this.state.users.filter(user => user.username === name);
                  if (selectedUser[0]) {
                    this.setState({ friendEmail: selectedUser[0].email });
                }
                }}>
                <Text style={styles.itemText}>
                  {name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TextInput
            ref={(input) => { this.friendEmailInput = input; }}
            clearTextOnFocus={true}
            onChangeText={email => this.setState({ friendEmail: email })}
            value={this.state.friendEmail}
            style={styles.place}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Enter friend's email"
            placeholderTextColor="white"
          />
          <TouchableOpacity onPress={() => this.onPressAddButton()} style={styles.inviteContainer}>
            <Text style={styles.buttonText}>ADD TO INVITATION LIST</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onPressDoneButton()} style={styles.doneContainer}>
            <Text style={styles.buttonText}>DONE</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            <Icon type="font-awesome" name="envelope" size={16} color="#2980b9" />
            <Text style={{ color: 'white', marginLeft: 10, fontSize: 15, fontWeight: '600' }}>A notification email will be sent to friends.</Text>
          </View>
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




