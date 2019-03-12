import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './src/reducers';

import LoginView from './src/views/LoginView';
import LandingView from './src/views/LandingView';

const store = createStore(reducer);

const MainNavigator = createStackNavigator({
    Login: { screen: LoginView },
    Landing: { screen: LandingView },
}, {
    initialRouteName: 'Login',
    headerMode: 'none'
});

const AppContainer = createAppContainer(MainNavigator);

const App = () => <Provider store={ store }>
    <AppContainer/>
</Provider>;

export default App;
