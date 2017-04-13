import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Me from '../screens/Me';
import Login from '../screens/Login';
import Event from '../screens/Event';
import FetchTest from '../screens/FetchTest';
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
    navigationOptions: {
      title: ({ state }) => `${state.params.name.toUpperCase()}`,
    },
  },
});

export const Tabs = TabNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      tabBar: {
        label: 'Login',
        icon: ({ tintColor }) => <Icon type="font-awesome" name="facebook" size={30} color={tintColor} />
      },
    },
  },
  CurrentEvents: {
    screen: currentEvents,
    navigationOptions: {
      tabBar: {
        label: 'Browse',
        icon: ({ tintColor }) => <Icon type="material" name="event" size={30} color={tintColor} />
      },
    },
  },
  Event: {
    screen: eventStack,
    navigationOptions: {
      tabBar: {
        label: 'Event',
        icon: ({ tintColor }) => <Icon type="font-awesome" name="group" size={25} color={tintColor} />
      },
    },
  },
  FetchTest: {
    screen: FetchTest,
    navigationOptions: {
      tabBar: {
        label: 'Test',
        icon: ({ tintColor }) => <Icon name="account-circle" size={35} color={tintColor} />
      },
    },
  },
  // AddFriends: {
  //   screen: AddFriends,
  //   navigationOptions: {
  //     tabBar: {
  //       visible: false,
  //       showIcon: false,
  //     },
  //   },
  // },
  Feed: {
    screen: ActivityStream,
    navigationOptions: {
      tabBar: {
        label: 'Feed',
        icon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />
      },
    },
  },
  Suggester: {
    screen: Suggester,
    navigationOptions: {
      tabBar: {
        label: 'Suggester',
        icon: ({ tintColor }) => <Icon name="new-releases" size={35} color={tintColor} />
      },
    },
  },
});

