'use-strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import SocketIOClient from 'socket.io-client';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { ActionCreators } from '../actions';
import endpoint from '../config/global';


const baseURL = endpoint.baseURL;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
  },
  welcomeTitle: {
    color: 'white',
    margin: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    color: 'white',
    margin: 20,
    fontSize: 60,
  },
});

const FBSDK = require('react-native-fbsdk');

const {
  GraphRequest,
  LoginButton,
  AccessToken,
  GraphRequestManager,
} = FBSDK;

const propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  saveUserId: PropTypes.func.isRequired,
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.responseInfoCallback = this.responseInfoCallback.bind(this);
  }

  componentWillMount() {
    // Create a graph request asking for user information with a callback to handle the response.
    const infoRequest = new GraphRequest(
      '/me?fields=name,picture,email,friends',
      null,
      this.responseInfoCallback,
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  responseInfoCallback(error, result) {
    if (error) {
      alert('Error fetching Facebook data, please log in Facebook again');
    } else {
      console.log('Facebook user profile=======>', result);
      // save user info to Redux
      this.props.getUserProfile({
        name: result.name,
        pic: result.picture.data.url,
        email: result.email,
        friends: result.friends,
        facebook_id: result.id,
      });

      const saveUserToDB = () => {
        fetch(baseURL + '/users', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: result.name,
            email: result.email,
            photourl: result.picture.data.url,
            facebook_id: result.id,
          }),
        })
        .then(data => console.log('save user to DB'))
        .catch(err => console.log(err));
      };

      fetch(baseURL + '/users/' + result.email)
      .then((response) => response.json())
      .then((responseJson) => {
        if (Object.keys(responseJson).length === 0 && responseJson.constructor === Object) {
          console.log('no user found, needs to save to database');
          saveUserToDB();
        } else {
          this.props.saveUserId(responseJson.id);
          console.log('user already exists in DB, no need to save again');
        }
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  render() {
    const context = this;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          friend.ly
        </Text>
        <Image
          style={{ width: 80, height: 80, borderRadius: 40 }}
          source={{ uri: this.props.user.pic }}
        />
        <Text style={styles.welcomeTitle}>
          Welcome back, {this.props.user.name === undefined ? ' please sign in!' : this.props.user.name }
        </Text>
        <LoginButton
          readPermissions={['public_profile', 'email', 'user_friends']}
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("Facebook Login Error: " + result.error);
              } else if (result.isCancelled) {
                //console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    const infoRequest = new GraphRequest(
                      '/me?fields=name,picture,email,friends',
                      null,
                      this.responseInfoCallback,
                    );
                    new GraphRequestManager().addRequest(infoRequest).start();
                    context.props.navigation.navigate('Event');
                  },
                );
              }
            }
          }
          onLogoutFinished={() => alert('logout.')}
        />
      </View>
    );
  }
}

Login.propTypes = propTypes;

function mapStateToProps(state) {
  return { user: state.user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

