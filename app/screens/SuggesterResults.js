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
  Image,
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

    this.linkOfficialPage = this.linkOfficialPage.bind(this);
  }

  linkOfficialPage(link) {
    this.props.navigation.navigate('SuggestionResultsItem', link);
  }

  render() {
      return (<ScrollView>
        <Text>
        We found {this.props.yelpResults.length} things that you may be interested in doing!
        </Text>
        <Image
          source={require('../img/ppp2.gif')}
        />
        <Text>
        Click on any of the options to see more information about them!
        </Text>
        <List>
        {
          this.props.yelpResults.map((result, i) => (
            <ListItem
              roundAvatar
              key={result.name}
              title={result.name}
              avatar={{uri: result.image_url}}
              subtitle={`Address: ${result.location.address1}${'\n'}Category: ${result.categories[0].title}`}
              onPress={()=> {
                this.linkOfficialPage(result.url);
              }}
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
