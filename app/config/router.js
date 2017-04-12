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
  Me: {
    screen: Me,
    navigationOptions: {
      tabBar: {
        label: 'Profile',
        icon: ({ tintColor }) => <Icon name="account-circle" size={30} color={tintColor} />
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

