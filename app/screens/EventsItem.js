import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import {ScrollView } from 'react-native';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

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

  // radioButton(props) {
  //   return (
  //     <View
  //       style={[{
  //         height: 24,
  //         width: 24,
  //         borderRadius: 12,
  //         borderWidth: 2,
  //         borderColor: '#000',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //       }, props.style]}
  //     >
  //       {props.selected ?
  //         <View
  //           style={{
  //             height: 12,
  //             width: 12,
  //             borderRadius: 6,
  //             backgroundColor: '#000',
  //           }}
  //         />
  //           : null
  //       }
  //     </View>
  //   );
  // }

  render() {
    const { name, description, eventDate, location, startTime, endTime } = this.props.navigation.state.params;
    return (
      <ScrollView>
        <Text>{name}</Text>
        <Text>{description}</Text>
        <Text>{eventDate}</Text>
        <Text>{location}</Text>
        <Text>{startTime}</Text>
        <Text>{endTime}</Text>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return { simpleCounter: state.simpleCounter };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Me);
