import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Me from '../screens/Me';


import Login from '../screens/Login';

import Event from '../screens/Event';

import FetchTest from '../screens/FetchTest';






// export const LoginStack = StackNavigator({
//   Login: {
//     screen: Login,
//     navigationOptions: {
//       title: 'Login',
//     },
//   },
// });

export const Tabs = TabNavigator({
  Login: {
    screen: LoginStack,
    navigationOptions: {
      tabBar: {
        label: 'Login',
        icon: ({ tintColor }) => <Icon type="foundation" name="social-facebook" size={30} color={tintColor} />
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
    screen: Event,
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
});

