import React, { Component } from 'react';
import ReactNative from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { ActionCreators } from '../actions';

const {
  View,
  Text,
  Button,
  PickerIOS,
  ScrollView,
  Alert,
  ListView,
} = ReactNative;

const PickerItemIOS = PickerIOS.Item;
let baseURL;

// allows for multiuse url
if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://hst-friend-ly.herokuapp.com';
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://hst-friend-ly-staging.herokuapp.com';
} else {
  baseURL = 'http://127.0.0.1:5000';
}

class SuggesterResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.yelpResults
    };
  }

  render() {
      return (<ScrollView>
        <Text>
        Here are our top suggestions for you!
        </Text>
        <List>
        {
          this.props.yelpResults.map((result, i) => (
            <ListItem
              key={result.name}
              title={result.name}
            />
          ))
        }
        </List>
      </ScrollView>)
  }
}

function mapStateToProps(state) {
  return { yelpResults: state.yelpResults };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SuggesterResults);
