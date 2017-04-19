import React, { PropTypes } from 'react';
import { View, ListView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Row from './Row';
import util from '../lib/utility';

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
});

const propTypes = {
  user: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

class AddFriends extends React.Component {
  constructor(props) {
    super(props);
    // this.friendList = ['fred', 'hello', 'steve'];
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      friendList: [],
      friendName: '',
      friendEmail: '',
    };
    this.onPressAddButton = this.onPressAddButton.bind(this);
    this.onPressDoneButton = this.onPressDoneButton.bind(this);
  }

  onPressAddButton() {
    const temp = this.state.friendList.slice();
    if (this.state.friendName === '') {
      alert(`friend name cannot be empty, please enter a friend's name`);
    } else if (this.state.friendEmail === '') {
      alert(`friend email cannot be empty, please enter a friend's email`);
    } else {
      temp.push({ username: this.state.friendName, email: this.state.friendEmail });
      this.setState({ friendList: temp });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(temp),
      });
    }
    this.friendNameInput.setNativeProps({ text: '' });
    this.friendEmailInput.setNativeProps({ text: '' });
  }

  onPressDoneButton() {
    console.log('Done button is pressed', this.props.user);
    // event will be saved to DB in here
    let eventId = null;
    if (this.props.user.id) {
      fetch('http:127.0.0.1:5000/events', {
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
        return util.addParticipantsToDB(eventId, this.state.friendList, this.props.user);
      })
      .then(() => {
        this.props.addCount();
        const event = {
          name: this.props.event.name.slice(0),
          eventDate: this.props.event.eventDate.slice(0),
          location: this.props.event.location.slice(0),
          startTime: util.formatTime(this.props.event.startTime).slice(0),
          endTime: util.formatTime(this.props.event.endTime).slice(0),
          username: this.props.user.name,
          photourl: this.props.user.pic,
          id: eventId,
          description: this.props.event.description.slice(0),
        };
        // clear datepicker after done button is clicked
        this.props.saveDate('');
        this.props.saveStartTime('');
        this.props.saveEndTime('');
        this.setState({ friendList: [] });
        this.setState({ dataSource: this.state.dataSource.cloneWithRows([]) });
        this.props.navigation.navigate('EventDetails', { ...event });
        this.props.changeEventNam('');
        this.props.changeEventLoc('');
        this.props.changeEventDes('');
      })
      .catch(err => console.log(err));
    } else {
      alert('user id is not available, please log in again');
    }
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
            renderRow={rowData => <Row {...rowData} />}
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
    simpleCounter: state.simpleCounter,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFriends);




