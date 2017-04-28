import { View, StyleSheet, TextInput, Text, KeyboardAvoidingView, Image, TouchableOpacity, AlertIOS, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Post from './Post';
import endpoint from '../config/global';

const baseURL = endpoint.baseURL;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#2ecc71',
  },
  title: {
    color: 'white',
    opacity: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  buttonContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#e67e22',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    width: 100,
  },
  buttonText: {
    paddingTop: 10,
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
  },
  message: {
    marginTop: 15,
    height: 40,
    backgroundColor: '#27ae60',
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: 'white',
    paddingLeft: 20,
    borderRadius: 8,
    width: '98%',
  },
  title: {
    marginLeft: 10,
    color: 'white',
    opacity: 1,
    fontSize: 20,
    fontWeight: '500',
  },
});

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // do not know if I will need yet?
      message: '',
    };

    this.displayComments = this.displayComments.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }

  displayComments() {
    if (this.props.comments.length > 0) {
      return this.props.comments.map((post, i) => {
        return (<Post post={post}/>)
      });
    } else { 
      return (<Text>No one has posted to this event</Text>);
    }
  }

  submitComment() {
    const com = this;
    const body = this.state.message;
    const userId = this.props.user.id;
    const eventId = this.props.activeEvent.id;

    console.log(body, userId, eventId);

    fetch(`${baseURL}/post`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body,
        userId,
        eventId,
      }),
    })
    .then(res => res.json())
    .then((resJson) => {
      console.log(resJson);
      com.setState({message: ''});
    })
    .catch((err) => { console.log(err) });
  }

  render() {
    return (<ScrollView style={styles.container}>
      <Text style={styles.title}>
        Enter Comment In Field Below
      </Text>
      <TextInput
        style={styles.message}
        placeholder='This event is going to be fun'
        onChangeText={(text) => { this.setState({message: text}); }}
        value={this.state.message}
        clearTextOnFocus={false}
        autoCorrect={false}
        placeholderColor='gray'
      />
      <TouchableOpacity onPress={this.submitComment} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Comment</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        Comments
      </Text>
      <View>
        {this.displayComments()}
      </View> 
    </ScrollView>);
  }
}

function mapStateToProps(state) {
  return { activeEvent: state.activeEvent, comments: state.comments, user: state.user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);


