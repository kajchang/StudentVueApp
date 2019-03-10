import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import LoginView from './src/views/LoginView';
import LandingView from './src/views/LandingView';

const MainNavigator = createStackNavigator({
    Login: { screen: LoginView },
    Landing: { screen: LandingView }
});

const App = createAppContainer(MainNavigator);

export default App;
