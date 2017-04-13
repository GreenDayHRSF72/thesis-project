import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactNative from 'react-native';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import EventsList from './EventsList';

const {
  View,
  Text,
  TouchableHighlight,
} = ReactNative;


class Me extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return <View>
        <Text style={{ marginTop: 20 }}>
          this is the counter for testing(Redux template)!
          count: {this.props.simpleCounter}
        </Text>
        <TouchableHighlight onPress={() => {this.props.addCount() }}>
          <Text>click to add</Text>
        </TouchableHighlight>
      <EventsList />
    </View>;
  }
}

function mapStateToProps(state) {
  return { simpleCounter: state.simpleCounter };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Me);
