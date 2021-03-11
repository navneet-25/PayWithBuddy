import React from 'react';
import { Component } from 'react';

import { createAppContainer, createSwitchNavigator, } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from './component/home';
import ProfilePage from './component/profile';
import SignUpPage from './component/signUp';
import LoginPage from './component/logIn';
import AuthPage from './component/auth';
import FirstPage from './component/firstPage';
import Drawer from './component/drawer';
import Details from './component/details';
import DairyDetails from './component/dairy_details';
import NotificationPage from './component/notification';
import LogPage from './component/logs';
import LogDetail from './component/logOverview';

const DrawerNavigatorExample = createDrawerNavigator(
  {
    First: FirstPage,
    DetailPage: Details,
    Profile: ProfilePage,
    Log: LogPage
  },
  {
    drawerPosition: 'left',
    contentComponent: Drawer,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoure: 'DrawerClose',
    initialRouteName: 'First'
  }

);

const AppNavigator = createStackNavigator(
  {
    First: DrawerNavigatorExample,
    Notification: NotificationPage,
    Home: HomeScreen,
    Profile: ProfilePage,
    Dairy_data: DairyDetails,
    LogDetailPage: LogDetail
  }, {
  initialRouteName: 'First',
  headerMode: 'none'
}
);

const User_login = createStackNavigator(
  {
    SignUp: SignUpPage,
    LogIn: LoginPage
  }, {
  initialRouteName: 'LogIn',
  headerMode: 'none'
}
);

const SwitchNavigator = createSwitchNavigator(
  {
    Auth: AuthPage,
    Stack: AppNavigator,
    StackLogin: User_login,
  },
  {
    initialRouteName: 'Auth',
    headerMode: 'none'
  }
)

export default createAppContainer(SwitchNavigator);

