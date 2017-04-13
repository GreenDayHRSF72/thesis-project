import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Me from '../screens/Me';
import Login from '../screens/Login';
import Event from '../screens/Event';
import ActivityStream from '../screens/ActivityStream';
import AddFriends from '../screens/AddFriends';
import Suggester from '../screens/Suggester';
import EventsItem from '../screens/EventsItem';
import EventsList from '../screens/EventsList';

export const eventStack = StackNavigator({
  Event: {
    screen: Event,
    navigationOptions: {
      title: 'Event',
    },
  },
  AddFriends: {
    screen: AddFriends,
    navigationOptions: {
      title: 'Invite Friends',
    },
  },
});

export const currentEvents = StackNavigator({
  EventsList: {
    screen: EventsList,
    navigationOptions: {
      title: 'Current Events',
    },
  },
  EventDetails: {
    screen: EventsItem,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.name.toUpperCase(),
    }),
  },
});

export const Tabs = TabNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      tabBarLabel: 'Login',
      tabBarIcon: ({ tintColor }) => <Icon type="font-awesome" name="facebook" size={30} color={tintColor} />
    },
  },
  CurrentEvents: {
    screen: currentEvents,
    navigationOptions: {   
      tabBarLabel: 'Browse',
      tabBarIcon: ({ tintColor }) => <Icon type="material" name="event" size={30} color={tintColor} />
    },
  },
  Event: {
    screen: eventStack,
    navigationOptions: {
      tabBarLabel: 'Event',
      tabBarIcon: ({ tintColor }) => <Icon type="font-awesome" name="group" size={25} color={tintColor} />
    },
  },

  Feed: {
    screen: ActivityStream,
    navigationOptions: {
      tabBarLabel: 'Feed',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />
    },
  },
  Suggester: {
    screen: Suggester,
    navigationOptions: {
      tabBarLabel: 'Suggester',
      tabBarIcon: ({ tintColor }) => <Icon name="new-releases" size={35} color={tintColor} />
    },
  },
});

