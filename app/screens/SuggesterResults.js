import React, { Component } from 'react';
import ReactNative from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { ActionCreators } from '../actions';

const {
  Text,
  ScrollView,
  Image,
  Button,
  View,
  ActionSheetIOS,
  Alert,
} = ReactNative;

const BUTTONS = [
  'Get more Info',
  'Setup event',
  'Cancel',
];

const CANCEL_INDEX = 2;

class SuggesterResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.yelpResults,
    };

    this.linkOfficialPage = this.linkOfficialPage.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
    this.redirectToEvents = this.redirectToEvents.bind(this);
  }

  linkOfficialPage(link) {
    this.props.navigation.navigate('SuggesterResultsItem', { link: link });
  }

  highRecommend(i) {
    if (i <= 4) {
      return '\nHIGHLY RECOMMENDED!';
    }
    return '';
  }

  redirectToEvents(yelp) {
    const address = yelp.location;
    const addStr = `${address.address1}, ${address.city}`;
    const name = yelp.name;

    this.props.suggestEvent({
      location: addStr,
      name,
      description: 'meh',
    });
    this.props.navigation.navigate('Event');
    Alert.alert(JSON.stringify(this.props.event.location, this.props))
  }

  showActionSheet(item) {
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this.linkOfficialPage(item.url);
      } else if (buttonIndex === 1) {
        this.redirectToEvents(item);
      }
    });
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
            avatar={{ uri: result.image_url }}
            subtitle={`Address: ${result.location.address1}${'\n'}Category: ${result.categories[0].title} ${this.highRecommend(i)}`}
            onPress={() => { this.showActionSheet(result)}} 
          />
        ))
      }
      </List>
    </ScrollView>);
  }
}

function mapStateToProps(state) {
  return { yelpResults: state.yelpResults, event: state.event };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SuggesterResults);
