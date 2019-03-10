import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import LoginView from './src/views/LoginView';

const MainNavigator = createStackNavigator({
    Home: {screen: LoginView}
});

const App = createAppContainer(MainNavigator);

export default App;
