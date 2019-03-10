import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomeView from './src/views/HomeView';
import LandingView from './src/views/LandingView';

const MainNavigator = createStackNavigator({
    Home: { screen: HomeView },
    Landing: { screen: LandingView }
});

const App = createAppContainer(MainNavigator);

export default App;
