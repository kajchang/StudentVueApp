import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';

import { LoginView, LandingView, BarcodeView } from './views';

const store = createStore(reducer);

const MainNavigator = createStackNavigator({
    Login: { screen: LoginView },
    Landing: { screen: LandingView },
    Barcode: { screen: BarcodeView }
}, {
    initialRouteName: 'Login',
    headerMode: 'none'
});

const AppContainer = createAppContainer(MainNavigator);

const App = () => <Provider store={ store }>
    <AppContainer/>
</Provider>;

export default App;
