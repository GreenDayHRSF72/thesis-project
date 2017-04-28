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
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#2ecc71',
  },
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
  subtitle: {
    textAlign: 'center',
    paddingTop: 10,
    color: 'white',
    fontWeight: '700',
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: -30,
    height: 75,
    backgroundColor: '#27ae60',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderStyle: 'solid',
    width: '120%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  headerText: {
    color: 'white',
    paddingTop: 25,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});

const BUTTONS = [
  'Get More Info',
  'Setup Event (Redirect to Event Creattion)',
  'Setup Proposed Activity',
  'Cancel',
];

const CANCEL_INDEX = 3;

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
      name: name,
      description: `Let's go to ${name}!`,
    });
    this.props.navigation.navigate('Event');
  }

   redirectToNewActivity(yelp) {
    const address = yelp.location;
    const addStr = `${address.address1}, ${address.city}`;
    const name = yelp.name;

     this.props.saveSuggestedActivity({
      location: addStr,
      name: name,
    });
    this.props.navigation.navigate('NewActivity');
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
      } else if (buttonIndex === 2) {
        this.redirectToNewActivity(item);
      }
    });
  }

  render() {
    return (<ScrollView
      style={styles.container}
      >
      <Text
        style={styles.subtitle}
      >
        We found {this.props.yelpResults.length} things that you may be interested in doing!
      </Text>
      <Image
        style={styles.image}
        source={require('../img/ppp2.gif')}
      />
      <Text
        style={styles.subtitle}
      >
        Click on any of the options to see more information about them, or auto fill an event with the venue's information!
      </Text>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Results</Text>
      </View>
      <List>
        {
        this.props.yelpResults.map((result, i) => (
          <ListItem
            style={styles.listItem}
            roundAvatar
            key={i}
            title={result.name}
            avatar={{ uri: result.image_url }}
            subtitle={`Address: ${result.location.address1}${'\n'}Category: ${result.categories[0].title} ${this.highRecommend(i)}`}
            onPress={() => { this.showActionSheet(result); }}
          />
        ))
      }
      </List>
    </ScrollView>);
  }
}

function mapStateToProps(state) {
  return {
    yelpResults: state.yelpResults,
    event: state.event,
    suggestedActivity: state.suggestedActivity,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SuggesterResults);
