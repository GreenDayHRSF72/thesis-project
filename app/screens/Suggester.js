import React, { Component } from 'react';
import ReactNative from 'react-native';
import Prompt from 'react-native-prompt';
import Geocoder from 'react-native-geocoding';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

const config = require('../../apis/config.js')

const {
  View,
  Text,
  Button,
  PickerIOS,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#2ecc71',
  },
  picker: {
    marginTop: 0,
    paddingTop: 0,
    flex: 1,
    height: 150,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#ededed',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#7e7e7e',
  },
  buttonContainer: {
    marginTop: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#27ae60',
    height: 35,
    width: '90%',
  },
  buttonText: {
    paddingTop: 10,
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
  },
  questionText: {
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
    fontWeight: '700',
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
  },
  header: {
    fontSize: 18,
    textAlign: 'center', 
    paddingTop: 10,
    color: 'white',
    fontWeight: '700',
  },
});

let baseURL;

// allows for multiuse url
if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://hst-friend-ly.herokuapp.com';
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://hst-friend-ly-staging.herokuapp.com';
} else {
  baseURL = 'http://127.0.0.1:5000';
}

const locationOptions = [
  { text: 'Nothing selected', value: 0 },
  { text: 'Close to my current location', value: 1 },
  { text: 'At another location', value: 2 },
];

const distanceOptions = [
  { text: 'I\'m too lazy to go anywhere else', value: 500 },
  { text: 'I don\'t mind a bit of a stroll', value: 2400 },
  { text: 'Let\'s go on an adventure!', value: 8000 },
  { text: 'Better call an Uber!', value: 16000 },
  { text: 'Might as well run a marathon', value: 40000 },
];

const priceOptions = [
  { text: 'I don\'t have much of a preference', value: '1,2,3,4' },
  { text: 'I\'m super broke right now!', value: '1' },
  { text: 'Something reasonable would be nice', value: '1,2' },
  { text: 'I think I can splurge a little bit I suppose', value: '2,3' },
  { text: 'Let\'s make it rain! Treat Yo\'self!', value: '4' },
];

const freshOptions = [
  { text: 'I really don\'t care', value: false },
  { text: 'I would prefer to try something new', value: true },
];

const dislikeOptions = [
  { text: 'I\'m open to anything', value: 1 },
  { text: 'Let\'s drink some Hater-ade!', value: 2 }
];

class Suggester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationVisible: false,
      dislikeVisible: false,
      budget: '1,2,3,4',
      radius: 500,
      location: 0,
      dislike: 1,
      coords: { latitude: 37.7876, longitude: -122.4001 },
      address: 'Guantanamo bay',
      openNow: '',
      dislikes: [],
      findNew: false,
      yelpLoading: false,
      // below are some sample data to test out the filtering algorithm
      testEmail: 'smmakowski@yahoo.com',
      interests: [],
      pastEvents: [{name: 'Mikkeler Bar', category: 'Bars'}, {name: 'Halal Guys'}]
    };

    // bind all the things
    this.getCoords = this.getCoords.bind(this);
    this.alertState = this.alertState.bind(this);
    this.geocodeLocation = this.geocodeLocation.bind(this);
    this.queryYelp = this.queryYelp.bind(this);
    this.geocodeCoords = this.geocodeCoords.bind(this);
    this.getAllUserInfo = this.getAllUserInfo.bind(this);
    this.getDislike = this.getDislike.bind(this);
    this.parseDislike = this.parseDislike.bind(this);
    this.filterDislike = this.filterDislike.bind(this);
    this.getAllUserInfo = this.getAllUserInfo.bind(this);
    this.resetState = this.resetState.bind(this);
    this.filterPast = this.filterPast.bind(this);
  }

  getCoords(value) {
    const suggester = this;
    if (value === 1) {
      navigator.geolocation.getCurrentPosition((position) => {
        suggester.geocodeCoords(position.coords);
      });
    } else if (value === 2) {
      suggester.setState({ locationVisible: true });
      // this will open up the address asker, which will then get your coords
    } else if (value === 0) {
      suggester.setState({
        address: 'guantanamo bay',
      })
    }
  }

  // this function is designed to mitigate my major fuck up with getting the coordinates and
  // thinking the yelp
  // API would find them usefuio


  geocodeCoords(coords) {
    const sug = this;
    const latlngString = `latlng=${coords.latitude},${coords.longitude}`;
    const key = config.apiConfig.google.apiKey;
    // console.log(`https://maps.googleapis.com/maps/api/geocode/json?${latlngString}&key=${key}`);
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?${latlngString}&key=${key}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then((resJson) => {
      // console.log(resJson);
      sug.setState({
        address: resJson.results[0].formatted_address,
      });
    })
    .catch(err => Alert.alert('error encountered', JSON.stringify(err)));
  }

  resetState() {
    this.setState({
      locationVisible: false,
      dislikeVisible: false,
      budget: '1,2,3,4',
      radius: 500,
      location: 0,
      dislike: 1,
      coords: { latitude: 37.7876, longitude: -122.4001 },
      address: 'Guantanamo bay',
      openNow: '',
      dislikes: [],
      findNew: false,
      yelpLoading: false,
      // below are some sample data to test out the filtering algorithm
      testEmail: 'smmakowski@yahoo.com',
      interests: [],
      pastEvents: [{ name: 'Mikkeler Bar' }, { name: 'Halal Guys' }, { name: 'Hack Reactor' }, { name: 'Sarku Japan' }, { name: 'Chipotle Mexican Grill' }, { name: 'Tempest' }],
    });
  }

  geocodeLocation(submit) {
    const suggester = this;
    Geocoder.setApiKey(config.apiConfig.google.apiKey);
    Geocoder.getFromLocation(submit).then((json) => {
      const location = json.results[0].geometry.location;
      const address = json.results[0].formatted_address;
      // I'm assuming that coords are found here, so.... yeah...
      // come back and refactor it to default to another set of coords if neccesary
      suggester.setState({ coords: { latitude: location.lat, longitude: location.lng } });
      suggester.setState({ address });
    }).catch(err => Alert.alert('Something went wrong', JSON.stringify(err)));
  }

  alertState() {
    const suggester = this;
    const address = JSON.stringify(suggester.state.address);
    const radius = JSON.stringify(suggester.state.radius);
    const price = JSON.stringify(suggester.state.budget);
    const userEmail = JSON.stringify(suggester.props.user.name);
    Alert.alert(`${userEmail} wants to be within ${radius} meters of ${address}\n You want to only spend ${price} out of 4`);
  }

  getDislike(value) {
    const suggester = this;
    if (value === 1) {
      suggester.setState({ dislikes: [] });
      Alert.alert('You dislikes have been reset!');
    } else if (value === 2) {
      suggester.setState({ dislikeVisible: true });
      // this will open up the address asker, which will then get your coords
    }
  }

  parseDislike(value) {
    if (value === '') {
      this.setState({
        dislikes: [],
      });
      return;
    }
    const dislikeArr = value.split(',').map(term => term.trim().split('').map(letter =>
        ('.?:"{}|\\][-/_=+!@#$%^&*()').indexOf(letter) > -1 ? '' : letter).join(''),
    ).map(term => term.toUpperCase());
    this.setState({
      dislikes: dislikeArr,
    });
  }

  selectInterests(ints) {
    let interests = ints.slice();
    interests = interests.map(term => term.toLowerCase());
    const preDes = ['beer', 'sushi', 'breweries', 'dispensaries', 'ethiopian', 'pants', 'french', 'burgers', 
    'raw bar', 'halal', 'chicken wings', 'burritos', 'archery', 'pudding', 'ice cream'];

    if (interests.length < 2)  {
      while (interests.length < 2) {
        let ranIdx = Math.floor(Math.random() * preDes.length);
        let idea = preDes[ranIdx].toLowerCase();
        if (interests.indexOf(idea) === -1) {
          interests.push(idea);
        }
      }
    } else {
      while (interests.length > 2) {
        let ranIdx = Math.floor(Math.random() * interests.length);
        interests.splice(ranIdx, 1);
      }
    }
    return interests;
  }

  filterDislike(yelp) {
    // iterate through the results
    console.log('filtering dislike original Length: ', yelp.length);
    const dislikes = this.state.dislikes;

    for (let i = 0; i < yelp.length; i += 1) {
      let result = yelp[i];
      const categories = result.categories;
      const name = result.name.toUpperCase();
      // iterate through categories first and scheckto see if they match
      // note for improvement, It may be better to check for dislikes in a manner
      // similar to the way it is done in the iteration through the names of the people.
      for (let j = 0; j < categories.length; j += 1) {
        let category = categories[j].alias.toUpperCase();
        if (dislikes.indexOf(category) !== -1 || dislikes.indexOf(category + 'S') !== -1) {
          yelp.splice(i, 1);

          console.log(`removed ${name} on the basis of having ${category}`)
        }
      }
      // iterate through dislikes to see if any of the key words are in the name of the location
      for (let k = 0; k < dislikes.length; k += 1) {
        if (name.indexOf(dislikes[k]) > -1) {
          console.log(`removed ${result.name} on the basis of having ${dislikes[k]} in name`)
          yelp.splice(i, 1);
        }
      }
    }
    // if all caps category alias is contained in call caps hate, delete the result
    return yelp;
  }

  filterPast(yelp) {
    if (this.state.pastEvents.length === 0) {
      return yelp;
    }
    const past = this.state.pastEvents.slice().map((item) => { return {name: item.name.toUpperCase()}});
    for (var i = 0; i < yelp.length; i += 1) {
      const venueName = yelp[i].name.toUpperCase();
      console.log('examining ' + venueName)
      if (past.indexOf(venueName) > -1) {
        console.log('removing ' + venueName)
        yelp.splice(i, 1);
        i -= 1;
      }
    }

    return yelp;
  }

  getAllUserInfo() {
    const sug = this;
    const email = sug.state.email;
    fetch(`${baseURL}/suggestion/userinfo`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    })
    .then(res => res.json())
    .then((resJson) => {
      console.log(resJson);
    })
    .catch((error) => {
      console.log(error);
      Alert.alert('There seems to be an error', JSON.stringify(error));
      // console.log(error);
    });
  }
 // the below function is essentially the basis for the rest of the algorithm. What happens is the
  queryYelp() {
    const sug = this;
    const address = this.state.address;
    const radius = this.state.radius;
    const price = this.state.budget;
    let interests = this.state.interests;

    interests = this.selectInterests(interests)
    interests = interests.map(term => term.toLowerCase());
    const intStr = interests.join('+');
    intStr[0] = '';
    
    const query = `term=${intStr}&location=${address}&radius=${radius}&price=${price}&limit=50&sort_by=best_match`;

    this.setState({
      yelpLoading: true,
    });

    fetch(`${baseURL}/suggestion/yelp`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryString: query,
      }),
    })
    .then(res => res.json())
    .then((resJson) => {
      sug.setState({ yelpLoading: false });
      // console.log(resJson);
      let businesses = resJson.businesses;
      if (businesses.length === 0) {
        Alert.alert(`Sorry there is nothing fun do at the location specified, please try again!${'\n'}The questions have been reset!`);
        sug.resetState();
      } else {
        console.log(businesses);
        businesses = sug.filterDislike(businesses);
        // if (sug.state.findNew === true) {
        //   businesses = sug.filterPast(businesses);
        // }
        sug.props.getYelp(businesses);
        sug.resetState();
        sug.props.navigation.navigate('SuggesterResults');
      }
    })
    .catch((error) => {
      sug.setState({ yelpLoading: false });
      console.log(error);
      sug.resetState();
      Alert.alert('There seems to be an error, and you answers have been reset. Please try again!');
      // console.log(error);
    });
  }

  render() {
    if (this.state.yelpLoading === false) {
      return (<ScrollView style={styles.container}>
        <Image
          style={styles.image}
          source={require('../img/ppp3.png')}
        />
        <Text
        style={styles.subtitle}
        >
          Welcome to the Suggester, {this.props.user.name}! Don{'\''}t know what to do for your hangout? Pom Pom Pudding is here to help!
          Just answer a few quick questions and we{'\''}ll find something for you! Slide up on the selection boxes to reveal more choices.
        </Text>
        <Text
          style={styles.questionText}
        >
          Q1: Where do you want to go?
        </Text>
        <PickerIOS
          style={styles.picker}
          selectedValue={this.state.location}
          onValueChange={(value) => {
            this.getCoords(value);
            this.setState({ location: value });
          }}
        >
          {locationOptions.map(option => (
            <PickerIOS.Item
              key={option.value}
              value={option.value}
              label={option.text}
            />
          ))}
        </PickerIOS>
        <Prompt
          title="Please enter the address of where you want to be"
          placeholder="ex. 944 Market Street (or) Halal Guys, San Francisco"
          visible={this.state.locationVisible}
          onCancel={() => {
            this.setState({ locationVisible: false });
          }}
          onSubmit={(value) => {
            this.setState({ locationVisible: false });
            this.geocodeLocation(value);
          }}
        />
        <Text
          style={styles.questionText}
        >
          Q2: How far from the that place are you willing to go from the location you selected?
        </Text>
        <PickerIOS
          style={styles.picker}
          selectedValue={this.state.radius}
          onValueChange={(value) => {
            this.setState({ radius: value });
          }}
        >
          {distanceOptions.map(option => (
            <PickerIOS.Item
              key={option.value}
              value={option.value}
              label={option.text}
            />
          ))}
        </PickerIOS>
        <Text
          style={styles.questionText}
        >
          Q3: What are you willing to spend?
        </Text>
        <PickerIOS
          style={styles.picker}
          selectedValue={this.state.budget}
          onValueChange={(value) => {
            this.setState({ budget: value });
          }}
        >
          {priceOptions.map(option => (
            <PickerIOS.Item
              key={option.value}
              value={option.value}
              label={option.text}
            />
          ))}
        </PickerIOS>
        <Text
          style={styles.questionText}
        >
          Q4: Are you looking to spice things up?
        </Text>
        <PickerIOS
          style={styles.picker}
          selectedValue={this.state.findNew}
          onValueChange={(value) => {
            this.setState({ findNew: value });
          }}
        >
          {freshOptions.map(option => (
            <PickerIOS.Item
              key={option.value}
              value={option.value}
              label={option.text}
            />
          ))}
        </PickerIOS>
        <Text
          style={styles.questionText}
        >
          Q5: Is there anything you don{'\''}t want to do?
        </Text>
        <PickerIOS
          style={styles.picker}
          selectedValue={this.state.dislike}
          onValueChange={(value) => {
            this.setState({ dislike: value });
            this.getDislike(value);
          }}
        >
          {dislikeOptions.map(option => (
            <PickerIOS.Item
              key={option.value}
              value={option.value}
              label={option.text}
            />
          ))}
        </PickerIOS>
        <Prompt
          title="Please list the things you don\'t want to do! Please separate with commas, and no spaces!(that is very important)"
          placeholder="ex. bars,clubs,etc."
          visible={this.state.dislikeVisible}
          onCancel={() => {
            this.setState({ dislikeVisible: false });
          }}
          onSubmit={(value) => {
            this.parseDislike(value);
            this.setState({ dislikeVisible: false });
          }}
        />
      <TouchableOpacity onPress={this.queryYelp} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>GET MY SUGGESTIONS</Text>
          </TouchableOpacity>
        <Button
          title="Test get user Info"
          onPress={this.getAllUserInfo}
        />
      </ScrollView>);
    } else if (this.state.yelpLoading === true) {
      return (<View
          style={styles.container}
        >
        <Text
          style={styles.header}
        >
          Now Loading your results...
        </Text>
        <Image
          style={styles.image}
          source={require('../img/gdt1.gif')}
        />
        <Text
          style={styles.subtitle}
        >
          Pom Pom Pudding is working hard to come up some recommendations for you!{'\n'}
          Isn{'\''}t great that someone can make these hard decisions?{'\n'}
          You should invite him or he{'\''}ll be sad.{'\n'}{'\n'}
          *Note* Your answers will be reset when results will come in *End Note*
      </Text>
      </View>);
    }
  }
}

function mapStateToProps(state) {
  return { yelpResults: state.yelpResults, user: state.user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Suggester);
