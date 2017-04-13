import React, { Component } from 'react';
import ReactNative from 'react-native';
import Prompt from 'react-native-prompt';
import Geocoder from 'react-native-geocoding';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

const {
  View,
  Text,
  Button,
  PickerIOS,
  ScrollView,
  Alert,
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

const locationOptions = [
  { text: 'Guantanamo Bay, because you clearly dont want to have fun', value: 0 },
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

class Suggester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationVisible: false,
      budget: '1,2,3,4',
      radius: 500,
      location: 0,
      coords: { latitude: 37.7876, longitude: -122.4001 },
      address: 'Guantanamo bay',
      openNow: '',
      dislikes: [],
      findNew: false,
      yelpLoading: false,
    };

    // bind all the things
    this.getCoords = this.getCoords.bind(this);
    this.alertState = this.alertState.bind(this);
    this.geocodeLocation = this.geocodeLocation.bind(this);
    this.queryYelp = this.queryYelp.bind(this);
    this.geocodeCoords = this.geocodeCoords.bind(this);
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
      suggester.state.address = 'Guantanamo Bay';
    }
  }

  // this function is designed to mitigate my major fuck up with getting the coordinates and
  // thinking the yelp
  // API would find them usefuio

  geocodeCoords(coords) {
    const sug = this;
    const latlngString = `latlng=${coords.latitude},${coords.longitude}`;
    const key = 'AIzaSyAx_7pT4ayHbBHuVOYK0kjPfqmEUfRHcQo';
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

  geocodeLocation(submit) {
    const suggester = this;
    Geocoder.setApiKey('AIzaSyAx_7pT4ayHbBHuVOYK0kjPfqmEUfRHcQo');
    Geocoder.getFromLocation(submit).then((json) => {
      const location = json.results[0].geometry.location;
      const address = json.results[0].formatted_address;
      // I'm assuming that coords are found here, so.... yeah...
      // come back and refactor it to default to another set of coords if neccesary
      suggester.setState({ coords: { latitude: location.lat, longitude: location.lng } });
      suggester.setState({ address });
    }).catch(err => Alert.alert('Something went Wrong', JSON.stringify(err)));
  }

  alertState() {
    const suggester = this;
    const address = JSON.stringify(suggester.state.address);
    const radius = JSON.stringify(suggester.state.radius);
    const price = JSON.stringify(suggester.state.budget);
    Alert.alert(`You want to be within ${radius} meters of ${address}\n You want to only spend ${price} out of 4`);
  }

  // the below function is essentially the basis for the rest of the algorithm. What happens is the
  queryYelp() {
    const sug = this;
    const address = this.state.address;
    const radius = this.state.radius;
    const price = this.state.budget;
    const query = `term=restaurants&location=${address}&radius=${radius}&price=${price}&limit=50`;

    this.setState({
      yelpLoading: true,
    });

    fetch(`${baseURL}/suggestion`, {
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
      if (resJson.businesses.length === 0) {
        sug.props.getYelp(resJson.businesses);

        Alert.alert('Sorry there is nothing fun do at the location specified, please try again!ß');
      } else {
        this.props.getYelp(resJson.businesses);
        Alert.alert(`we have ${sug.props.yelpResults.length}`);
      }
    })
    .catch((error) => {
      sug.setState({ yelpLoading: false });
      Alert.alert('There seems to be an error', JSON.stringify(error));
      // console.log(error);
    });
  }

  render() {
    if (this.state.yelpLoading === false) {
      return (<ScrollView>
        <Text>
          {'\n'}
          Welcome to the Suggester!{'\n'}
          INSERT AN IMAGE HERE AND MAKE SURE ITS FUN{'\n'}
        </Text>
        <Text>
          Don{'\''}t know what to do for your hangout?
          Just answer a few quick questions and we{'\''}ll find something for you!{'\n'}
        </Text>
        <Text>
          Where do you want to go?
        </Text>
        <PickerIOS
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
        <Text>
          How far from the that place are you willing to go?
        </Text>
        <PickerIOS
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
        <Text>
          What are you willing to spend?
        </Text>
        <PickerIOS
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
        <Text>
          Are you looking to spice things up a bit?
        </Text>
        <PickerIOS
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
        <Button
          title="Get my suggestions!"
          onPress={this.queryYelp}
        />
        <Button
          title="Press me to view page state"
          onPress={() => {
            const sug = this;
            Alert.alert(JSON.stringify(sug.state));
          }}
        />
      </ScrollView>);
    } else if (this.state.yelpLoading === true) {
      return (<View>
        <Text
          style={{ textAlign: 'center', marginTop: 150 }}
        >
          MY DUMB ALGORITHM IS CONNECTING TO THE YELP API AND YOUR DB-STORED INFORMATION
          PLEASE WAIT; NOW YOU KNOW THE SECRET NOT SO IMPRESSIVE NOW IS IT?
      </Text>
      </View>);
    }
  }
}

function mapStateToProps(state) {
  return { yelpResults: state.yelpResults };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Suggester);
