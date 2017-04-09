import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Login from './Login';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

class Feed extends Component {
  moreInfo() {
    this.props.navigation.navigate('Me');
  }
 
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Friendly
        </Text>
        <Login />
      </View>
    );
  }
}

export default Feed;
